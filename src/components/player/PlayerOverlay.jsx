/**
 * PlayerOverlay — top + bottom gradient overlays for control visibility.
 * Pure visual layer, no state, no events.
 * SPEC 19.5: PlayerOverlay — gradient overlays top + bottom for control visibility.
 */
const PlayerOverlay = ({ visible }) => (
  <>
    {/* Top gradient — covers title bar area */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-32 transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
      }}
    />
    {/* Bottom gradient — h-40 covers the full PlayerControls bar height across all viewport sizes */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
      }}
    />
  </>
);

export default PlayerOverlay;
