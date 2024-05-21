/**
 * PlayerControls — bottom control bar.
 *
 * SPEC 19.5:
 *   - Play/pause, skip ±10s, volume slider, progress bar (scrubbable),
 *     time display, fullscreen toggle, audio/subtitle picker (UI only)
 *
 * Props:
 *   playing       {boolean}
 *   muted         {boolean}
 *   volume        {number}  0–1
 *   played        {number}  0–1 fraction
 *   duration      {number}  seconds
 *   visible       {boolean} auto-hide state from parent
 *   isFullscreen  {boolean}
 *   onPlayPause   {fn}
 *   onSeek        {fn}   receives fraction 0–1
 *   onSkip        {fn}   receives ±seconds
 *   onVolumeChange{fn}   receives 0–1
 *   onMuteToggle  {fn}
 *   onFullscreen  {fn}
 */
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

// ── Time formatter ────────────────────────────────────────────────────────────
const fmt = (secs) => {
  // NaN guard returns '0:00' — prevents display corruption when duration not yet loaded
  if (!secs || isNaN(secs)) return '0:00';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  const mm = String(m).padStart(h ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

// ── Icon button ───────────────────────────────────────────────────────────────
const Btn = ({ icon: Icon, label, onClick, size = 22, className = '' }) => (
  <button
    type="button"
    aria-label={label}
    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    className={[
      'flex items-center justify-center p-1.5 rounded',
      'text-white hover:text-white/80 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
      className,
    ].join(' ')}
  >
    <Icon size={size} aria-hidden="true" />
  </button>
);

// ── PlayerControls ────────────────────────────────────────────────────────────
const PlayerControls = ({
  playing,
  muted,
  volume,
  played,
  duration,
  visible,
  isFullscreen,
  onPlayPause,
  onSeek,
  onSkip,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
}) => {
  const elapsed   = duration * played;
  const remaining = duration - elapsed;

  return (
    <div
      className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-8 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      {/* Progress bar */}
      {/* thumb opacity 0 at rest, visible on hover — avoids clutter during active playback */}
      <div className="mb-3 group">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={played || 0}
          onChange={(e) => onSeek?.(parseFloat(e.target.value))}
          aria-label="Video progress"
          className="
            w-full h-1 group-hover:h-1.5
            appearance-none bg-white/30 rounded-full
            cursor-pointer transition-all duration-150
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500
            [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100
          "
          style={{
            background: `linear-gradient(to right, #e50914 ${(played || 0) * 100}%, rgba(255,255,255,0.3) ${(played || 0) * 100}%)`,
          }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        {/* Play / Pause */}
        <Btn
          icon={playing ? Pause : Play}
          label={playing ? 'Pause' : 'Play'}
          onClick={onPlayPause}
          size={24}
        />

        {/* Skip back 10s */}
        <Btn
          icon={SkipBack}
          label="Rewind 10 seconds"
          onClick={() => onSkip?.(-10)}
        />

        {/* Skip forward 10s */}
        <Btn
          icon={SkipForward}
          label="Skip forward 10 seconds"
          onClick={() => onSkip?.(10)}
        />

        {/* Volume */}
        <div className="flex items-center gap-1">
          <Btn
            icon={muted || volume === 0 ? VolumeX : Volume2}
            label={muted ? 'Unmute' : 'Mute'}
            onClick={onMuteToggle}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
            aria-label="Volume"
            className="
              w-20 h-1 appearance-none bg-white/30 rounded-full cursor-pointer
              hidden sm:block
              /* volume range hidden on mobile — mute toggle is the primary touch control */
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            "
            style={{
              background: `linear-gradient(to right, white ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(muted ? 0 : volume) * 100}%)`,
            }}
          />
        </div>

        {/* Time display */}
        <span className="text-white text-sm tabular-nums select-none ml-1">
          {fmt(elapsed)} / {fmt(duration)}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Subtitles (UI only per SPEC) */}
        <button
          type="button"
          aria-label="Subtitles (not available)"
          onClick={(e) => e.stopPropagation()}
          className="
            hidden sm:flex items-center justify-center px-2 py-0.5
            border border-white/50 text-white/70 text-xs rounded
            hover:border-white hover:text-white transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
          "
        >
          CC
        </button>

        {/* Fullscreen toggle */}
        <Btn
          icon={isFullscreen ? Minimize : Maximize}
          label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          onClick={onFullscreen}
        />
      </div>
    </div>
  );
};

export default PlayerControls;
