/**
 * VideoPlayer — full-screen video playback component.
 *
 * SPEC 19.5:
 *   - Full-screen black background
 *   - Uses react-player (YouTube trailers + MP4 fallback)
 *   - Auto-fullscreen on mount (desktop only, graceful mobile fallback)
 *   - Custom controls overlay (auto-hides after 3s of no movement)
 *   - Saves progress to watch_history every 10 seconds
 *   - Back button top-left → navigate(-1)
 *   - Title + episode info top-left (via PlayerOverlay)
 *
 * SAFETY:
 *   - mousemove listener registered ONCE on container ref, removed on unmount
 *   - Progress timer cleared on unmount / pause / end
 *   - Fullscreen errors caught silently — never crash playback
 *   - No state updates per frame — played/loaded stored in refs, synced to state via progress callback
 *   - ReactPlayer never remounts unnecessarily — url is stable string
 *
 * Props:
 *   url         {string}  YouTube watch URL or MP4 URL
 *   title       {string}
 *   mediaType   {string}  'movie' | 'tv'
 *   mediaId     {number}
 *   onProgress  {fn}      called with { played, playedSeconds } — throttled by ReactPlayer (0.5s default)
 *   onBack      {fn}      navigate(-1) callback
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player/lazy';
import { ArrowLeft } from 'lucide-react';
import PlayerControls from './PlayerControls';
import PlayerOverlay from './PlayerOverlay';

// ── Constants ──────────────────────────────────────────────────────────────
const CONTROLS_HIDE_DELAY = 3000; // ms of inactivity before controls hide

// ── VideoPlayer ────────────────────────────────────────────────────────────
const VideoPlayer = ({ url, title, mediaType, mediaId, onProgress, onBack }) => {
  // ── Playback state ────────────────────────────────────────────────────────
  const [playing,      setPlaying]      = useState(true);
  const [muted,        setMuted]        = useState(false);
  const [volume,       setVolume]       = useState(0.8);
  const [played,       setPlayed]       = useState(0);     // 0–1 fraction
  const [duration,     setDuration]     = useState(0);     // seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVis,  setControlsVis]  = useState(true);  // auto-hide

  // ── Refs — never cause rerenders ─────────────────────────────────────────
  const playerRef        = useRef(null);   // ReactPlayer ref
  const containerRef     = useRef(null);   // outer div for fullscreen + mousemove
  const hideTimerRef     = useRef(null);   // controls hide setTimeout id
  const progressTimerRef = useRef(null);   // watch_history write interval id
  const playedRef        = useRef(0);      // latest played fraction for interval callback
  const playingRef       = useRef(true);   // latest playing state for interval callback
  const controlsVisRef   = useRef(true);   // latest controlsVis for tap handler (no rerender)

  // Keep refs in sync with state (so interval/cleanup callbacks see latest values)
  useEffect(() => { playingRef.current   = playing;     }, [playing]);
  useEffect(() => { playedRef.current    = played;      }, [played]);
  useEffect(() => { controlsVisRef.current = controlsVis; }, [controlsVis]);

  // ── Controls auto-hide ────────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setControlsVis(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      // Only hide if playing (keep visible when paused)
      if (playingRef.current) setControlsVis(false);
    }, CONTROLS_HIDE_DELAY);
  }, []);

  // Register mousemove ONCE on the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', resetHideTimer);
    el.addEventListener('touchstart', resetHideTimer, { passive: true });
    resetHideTimer(); // start the initial timer

    return () => {
      el.removeEventListener('mousemove', resetHideTimer);
      el.removeEventListener('touchstart', resetHideTimer);
      clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // Always show controls when paused
  useEffect(() => {
    if (!playing) {
      clearTimeout(hideTimerRef.current);
      setControlsVis(true);
    } else {
      resetHideTimer();
    }
  }, [playing, resetHideTimer]);

  // ── Auto-fullscreen on mount (desktop only) ───────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Only attempt auto-fullscreen on devices that support it and aren't touch-primary
    const isDesktopLike = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktopLike && document.fullscreenEnabled) {
      el.requestFullscreen().catch(() => {
        // Graceful fallback — fullscreen denial must never crash playback
      });
    }

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      // Exit fullscreen on unmount if still active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []); // runs once on mount

  // ── Fullscreen toggle ─────────────────────────────────────────────────────
  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // ── Watch history persistence — write every 10s, only when playing ────────
  // Uses onProgress prop (called by Watch.jsx which handles Supabase writes)
  // The interval here only drives the callback — no direct Supabase calls inside player.
  useEffect(() => {
    progressTimerRef.current = setInterval(() => {
      // interval fires callback only — Supabase writes are handled upstream in Watch.jsx
      if (playingRef.current && playedRef.current > 0 && onProgress) {
        onProgress({
          played:        playedRef.current,
          playedSeconds: playedRef.current * duration,
        });
      }
    }, 10_000);

    return () => clearInterval(progressTimerRef.current);
  }, [duration, onProgress]);

  // ── ReactPlayer handlers ──────────────────────────────────────────────────
  const handleProgress = useCallback(({ played: p }) => {
    setPlayed(p);
    playedRef.current = p;
  }, []);

  const handleDuration = useCallback((d) => setDuration(d), []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    clearInterval(progressTimerRef.current);
    // Final progress write on end
    if (onProgress) {
      onProgress({ played: 1, playedSeconds: duration });
    }
  }, [duration, onProgress]);

  // ── Control handlers ──────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => setPlaying((p) => !p), []);

  const handleSeek = useCallback((fraction) => {
    setPlayed(fraction);
    playerRef.current?.seekTo(fraction, 'fraction');
  }, []);

  const handleSkip = useCallback((seconds) => {
    const current = playedRef.current * duration;
    const next    = Math.max(0, Math.min(duration, current + seconds));
    const fraction = duration > 0 ? next / duration : 0;
    handleSeek(fraction);
  }, [duration, handleSeek]);

  const handleVolume = useCallback((v) => {
    setVolume(v);
    if (v > 0) setMuted(false);
  }, []);

  const handleMuteToggle = useCallback(() => setMuted((m) => !m), []);

  // ── Container click/tap — BUG #4 FIX ────────────────────────────────────
  // Mobile UX pattern:
  //   First tap when controls are hidden → SHOW controls (do NOT toggle play)
  //   Second tap when controls are visible → TOGGLE play/pause
  // This prevents the frustrating "I tapped to see controls but it paused" issue.
  // Desktop mousemove already keeps controls visible so this mainly matters on touch.
  // First tap reveals controls; second tap (when controls visible) toggles play/pause
  const handleContainerClick = useCallback(() => {
    if (!controlsVisRef.current) {
      // Controls are hidden — first tap just reveals them
      resetHideTimer();
    } else {
      // Controls already visible — toggle play/pause AND reset the hide timer
      handlePlayPause();
      resetHideTimer();
    }
  }, [handlePlayPause, resetHideTimer]);

  // Determine YouTube config
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');

  return (
    <div
      ref={containerRef}
      id="video-player-container"
      className="relative w-full h-full bg-black overflow-hidden select-none"
      onClick={handleContainerClick}
      // Cursor hides when controls are hidden during playback
      style={{ cursor: controlsVis ? 'default' : 'none' }}
    >
      {/* ── ReactPlayer ────────────────────────────────────────────────────── */}
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        muted={muted}
        volume={volume}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        progressInterval={500}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        onError={(e) => console.error('[VideoPlayer] playback error:', e)}
        config={
          isYouTube
            ? {
                youtube: {
                  playerVars: {
                    controls:       0,   // hide YouTube native controls
                    modestbranding: 1,
                    rel:            0,
                    showinfo:       0,
                    iv_load_policy: 3,   // hide annotations
                    origin:         window.location.origin,
                  },
                },
              }
            : {}
        }
      />

      {/* ── Gradient overlays ──────────────────────────────────────────────── */}
      {/* PlayerOverlay isolates gradient layers — keeps player shell JSX focused on controls */}
      <PlayerOverlay visible={controlsVis} />

      {/* ── Top bar: back button + title ───────────────────────────────────── */}
      {/* pointer-events-none on wrapper keeps it visually present; back button */}
      {/* gets pointer-events-auto. onTouchEnd stops touches from bubbling to   */}
      {/* the container's play/pause toggle when controls are visible.          */}
      <div
        className="absolute inset-x-0 top-0 flex items-center gap-4 px-4 pt-4 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: controlsVis ? 1 : 0 }}
        aria-hidden={!controlsVis}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Back button */}
        <button
          type="button"
          aria-label="Go back"
          onClick={(e) => { e.stopPropagation(); onBack?.(); }}
          className="
            pointer-events-auto
            flex items-center justify-center w-10 h-10 rounded-full
            bg-black/40 hover:bg-black/60 transition-colors
            text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
          "
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>

        {/* Title */}
        {title && (
          <h1 className="text-white text-base sm:text-lg font-semibold line-clamp-1 drop-shadow-lg">
            {title}
          </h1>
        )}
      </div>

      {/* ── Bottom controls ─────────────────────────────────────────────────── */}
      {/* BUG #4 FIX: Always pointer-events-auto so mobile taps on the controls  */}
      {/* area reach the buttons even when opacity=0 (hidden state).             */}
      {/* Visibility is communicated via opacity only, NOT pointer-events.       */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <PlayerControls
          playing={playing}
          muted={muted}
          volume={volume}
          played={played}
          duration={duration}
          visible={controlsVis}
          isFullscreen={isFullscreen}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onSkip={handleSkip}
          onVolumeChange={handleVolume}
          onMuteToggle={handleMuteToggle}
          onFullscreen={handleFullscreen}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
