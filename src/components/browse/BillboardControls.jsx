import { Volume2, VolumeX } from 'lucide-react';

/**
 * BillboardControls — mute toggle + maturity rating badge.
 * Rendered bottom-right of the Hero billboard.
 *
 * Props:
 *   muted          — boolean, current mute state
 *   onToggleMute   — callback to flip mute state
 *   maturityRating — string, e.g. 'PG-13', 'R', 'TV-MA'. Falls back to 'PG'.
 *   hasTrailer     — if false, hide mute button (no audio to control)
 */
const BillboardControls = ({
  muted,
  onToggleMute,
  maturityRating = 'PG',
  hasTrailer = false,
}) => {
  return (
    <div
      className="flex items-center gap-3"
      role="group"
      aria-label="Billboard controls"
    >
      {/* Mute toggle — only relevant when trailer is playing */}
      {hasTrailer && (
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
          className="
            flex items-center justify-center
            w-9 h-9 rounded-full
            border-2 border-nethero-grayLight
            text-nethero-white bg-transparent
            hover:border-nethero-white
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
          "
        >
          {muted
            ? <VolumeX  size={18} aria-hidden="true" />
            : <Volume2  size={18} aria-hidden="true" />
          }
        </button>
      )}

      {/* Age / maturity rating badge */}
      <span
        className="
          border-l-4 border-nethero-grayLight
          pl-2 pr-3 py-1
          text-nethero-grayLight text-sm font-medium
          bg-nethero-black/40
          select-none
        "
        aria-label={`Maturity rating: ${maturityRating}`}
      >
        {maturityRating}
      </span>
    </div>
  );
};

export default BillboardControls;
