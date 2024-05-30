/**
 * SearchResults — responsive grid of search result cards.
 *
 * SPEC 19.6:
 *   - Grid: 2 mobile / 3 tablet / 5 desktop / 6 TV
 *   - Filters out media_type === 'person'
 *   - Loading: skeleton grid
 *   - Empty state: "Your search did not have any matches."
 *
 * BUG #2 FIX: Also filters items with no usable image (neither backdrop nor poster).
 * BUG #3 FIX: Passes disableHover=true to MovieCard so the floating
 *   MovieCardHover overlay never mounts on search results cards.
 *   Cards still get a subtle scale+brightness hover via CSS only.
 */
import { motion } from 'framer-motion';
import MovieCard from '../browse/MovieCard';
import Skeleton from '../common/Skeleton';

// ── Validity check — must have at least one usable image ─────────────────────
const isValidItem = (r) =>
  r.media_type !== 'person' &&
  (r.backdrop_path || r.poster_path);

// ── Skeleton grid — matches real grid breakpoints ──────────────────────────
const SkeletonGrid = () => (
  <div
    className="
      grid
      grid-cols-2
      sm:grid-cols-3
      lg:grid-cols-5
      xl:grid-cols-6
      gap-2 sm:gap-3
    "
    aria-hidden="true"
  >
    {Array.from({ length: 18 }).map((_, i) => (
      <Skeleton
        key={i}
        rounded="rounded-card"
        className="w-full aspect-video"
      />
    ))}
  </div>
);

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <p className="text-nethero-white text-xl font-semibold mb-2">
      Your search did not have any matches.
    </p>
    <p className="text-nethero-grayLight text-sm max-w-sm">
      Try different keywords or browse by category.
    </p>
  </div>
);

// ── Card entrance animation (lightweight — no scale from variants) ────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const cardVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.22 } },
};

// ── SearchResults ────────────────────────────────────────────────────────────
/**
 * Props:
 *   results  {Array}   — raw TMDB results array
 *   loading  {boolean}
 */
const SearchResults = ({ results = [], loading }) => {
  if (loading) return <SkeletonGrid />;

  // BUG #2: filter out persons + items with no usable image
  const filtered = results.filter(isValidItem);

  if (filtered.length === 0) return <EmptyState />;

  return (
    <motion.div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-5
        xl:grid-cols-6
        gap-2 sm:gap-3
      "
      variants={containerVariants}
      initial="hidden"
      animate="show"
      aria-label={`${filtered.length} search result${filtered.length !== 1 ? 's' : ''}`}
    >
      {filtered.map((item, index) => (
        <motion.div
          key={`${item.id}-${item.media_type}`}
          variants={cardVariants}
          // CSS-only hover: disableHover suppresses MovieCardHover so brightness+scale give feedback without z-index disruption.
          // The floating MovieCardHover overlay is suppressed via disableHover.
          // group/brightness keeps interaction feedback without z-index chaos.
          className="h-full transition-[filter,transform] duration-200 hover:brightness-125 hover:scale-[1.03]"
        >
          {/* disableHover=true → no MovieCardHover overlay, no trailer, no floating panel */}
          <MovieCard
            item={item}
            mediaType={item.media_type || 'movie'}
            isLarge={false}
            index={index}
            disableHover
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SearchResults;
