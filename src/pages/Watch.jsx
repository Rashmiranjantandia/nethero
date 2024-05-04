/**
 * Watch.jsx — full-screen video watch page.
 *
 * SPEC 20.9:
 *   - Full screen VideoPlayer
 *   - Reads :type and :id from URL params
 *   - Fetches details + videos, finds trailer key
 *   - Logs to watch_history on play (debounced — max 1 write per 10s)
 *   - Back button → navigate(-1)
 *
 * SAFETY:
 *   - Supabase writes throttled via lastWriteRef — never spams
 *   - Body overflow reset on unmount
 *   - No global keyboard listeners — VideoPlayer handles its own
 *   - navigate(-1) preserves browser back stack correctly
 */
import { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/useProfileStore';
import { useFetch } from '../hooks/useFetch';
import { endpoints, findTrailerKey } from '../lib/tmdb';
import { supabase } from '../lib/supabase';
import Spinner from '../components/common/Spinner';
import VideoPlayer from '../components/player/VideoPlayer';

// ── Fallback public-domain MP4 for when no YouTube trailer key is found ──────
// Using a verified CC0 test video. The original BigBuckBunny gtv URL had
// intermittent CORS/geo-restriction failures; this sample is reliably accessible.
const FALLBACK_MP4 =
  'https://www.w3schools.com/html/mov_bbb.mp4';

// ── Watch page ────────────────────────────────────────────────────────────────
const Watch = () => {
  const { type, id }  = useParams();
  const navigate      = useNavigate();
  const activeProfile = useProfileStore((s) => s.activeProfile);

  // Fetch full details + videos in one TMDB call
  const { data: details, loading } = useFetch(
    type && id ? endpoints.details(type, id) : null,
    { append_to_response: 'videos' },
    [type, id]
  );

  // Resolve playback URL
  const trailerKey = details?.videos ? findTrailerKey(details.videos) : null;
  const videoUrl   = trailerKey
    ? `https://www.youtube.com/watch?v=${trailerKey}`
    : FALLBACK_MP4;

  const title = details?.title || details?.name || '';

  // ── Hide browser scroll bar while on watch page ───────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── watch_history — throttled Supabase write ──────────────────────────────
  // lastWriteRef prevents spamming even if onProgress is called rapidly.
  const lastWriteRef  = useRef(0);
  const detailsRef    = useRef(null);
  useEffect(() => { detailsRef.current = details; }, [details]);

  const handleProgress = useCallback(async ({ played, playedSeconds }) => {
    // watched_at not included — Supabase auto-populates created_at on each insert
    if (!activeProfile?.id || !id || !type) return;

    const now = Date.now();
    // Throttle: at most one write per 10 seconds
    if (now - lastWriteRef.current < 10_000) return;
    lastWriteRef.current = now;

    const d = detailsRef.current;

    // BUG #1 FIX: use real schema columns (progress_seconds, duration_seconds)
    // Old code incorrectly wrote 'progress' which doesn't exist in the table.
    const totalDuration = d?.runtime
      ? d.runtime * 60          // movie: runtime is in minutes → convert to seconds
      : 0;                       // TV: duration unknown without episode data
    // duration_seconds null for TV is safer than 0 — avoids misleading progress percentage

    // payload keys match exact Supabase column names — verified against schema
    const payload = {
      profile_id:       activeProfile.id,
      tmdb_id:          Number(id),
      media_type:       type,
      title:            d?.title || d?.name || '',
      poster_path:      d?.poster_path || null,
      backdrop_path:    d?.backdrop_path || null,
      progress_seconds: Math.round(playedSeconds || 0),   // real column name
      duration_seconds: Math.round(totalDuration) || null, // real column name; null if unknown
    };

    // Upsert so re-watching updates the SAME row instead of duplicating
    const { error } = await supabase
      .from('watch_history')
      .upsert([payload], {
        onConflict:       'profile_id,tmdb_id,media_type',
        ignoreDuplicates: false,
      });

    if (error) {
      // Silent — never crash playback over a persistence failure
      console.warn('[Watch] watch_history write failed:', error.message);
    }
  }, [activeProfile?.id, id, type]);

  // ── Back navigation ───────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="flex items-center justify-center w-screen h-screen bg-black"
        aria-label="Loading video"
      >
        <Spinner size="xl" aria-label="Loading video" />
      </div>
    );
  }

  // ── Error: no video URL resolved ─────────────────────────────────────────
  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-black gap-4">
        <p className="text-white text-lg">Video unavailable</p>
        <button
          type="button"
          onClick={handleBack}
          className="text-nethero-red underline hover:text-red-400 transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    // Full-viewport container — no Navbar, no Footer on the Watch page
    <div
      className="w-screen h-screen bg-black overflow-hidden"
      id="watch-page-root"
    >
      <VideoPlayer
        url={videoUrl}
        title={title}
        mediaType={type}
        mediaId={Number(id)}
        onProgress={handleProgress}
        onBack={handleBack}
      />
    </div>
  );
};

export default Watch;
