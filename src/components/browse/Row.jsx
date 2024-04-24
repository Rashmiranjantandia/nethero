import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useFetch } from '../../hooks/useFetch';
import Skeleton from '../common/Skeleton';
import MovieCard from './MovieCard';

// ── Swiper CSS — import only what we use ──────────────────────────────────────
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

// ── Breakpoints per SPEC 19.3 ─────────────────────────────────────────────────
const BREAKPOINTS = {
  0:    { slidesPerView: 2, spaceBetween: 4 },
  640:  { slidesPerView: 3, spaceBetween: 6 },
  768:  { slidesPerView: 4, spaceBetween: 6 },
  1024: { slidesPerView: 5, spaceBetween: 8 },
  1280: { slidesPerView: 6, spaceBetween: 8 },
  1536: { slidesPerView: 7, spaceBetween: 8 },
};

// ── Skeleton placeholder row (7 tiles, 16:9 or 2:3) ──────────────────────────
const SkeletonRow = ({ isLarge }) => (
  <div className="flex gap-1.5 px-4 sm:px-8 lg:px-12 overflow-hidden">
    {Array.from({ length: 7 }).map((_, i) => (
      <Skeleton
        key={i}
        rounded="rounded-card"
        className={[
          'flex-shrink-0',
          isLarge
            ? 'w-[140px] h-[210px] sm:w-[160px] sm:h-[240px]'
            : 'w-[180px] h-[100px] sm:w-[220px] sm:h-[124px]',
        ].join(' ')}
      />
    ))}
  </div>
);

// ── Row ───────────────────────────────────────────────────────────────────────
/**
 * Row — horizontal carousel of MovieCards.
 *
 * Props:
 *   title      — section heading string
 *   path       — TMDB API path (no query strings).  Unused when `items` is supplied.
 *   params     — extra query params object (e.g. { with_genres: 28 })
 *   mediaType  — 'movie' | 'tv'
 *   isLarge    — tall poster tiles (Originals row)
 *   items      — optional pre-fetched array (Continue Watching, My List).
 *                When provided, path / useFetch / useInView are skipped entirely.
 */
const Row = ({ title, path, params = {}, mediaType = 'movie', isLarge = false, items: propItems }) => {
  // ── Intersection observer — skipped when items is pre-supplied ───────────
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
    skip: !!propItems,   // bypass observer entirely for pre-fetched rows
  });

  // ── Fetch — only when path-based and row is in view ─────────────────────
  const { data, loading: fetchLoading } = useFetch(
    !propItems && inView ? path : null,
    params,
    [inView]
  );

  // ── Custom nav button refs ───────────────────────────────────────────────
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // ── Row hover state (shows nav arrows) ──────────────────────────────────
  const [rowHovered, setRowHovered] = useState(false);

  // When items are pre-supplied use them directly; otherwise use fetched data
  const items   = propItems ?? data?.results ?? [];
  const loading = propItems ? false : fetchLoading;

  return (
    <section
      ref={inViewRef}
      className="relative py-3 group"
      aria-label={`${title} row`}
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      {/* ── Section title ─────────────────────────────────────────────── */}
      <h2 className="text-row-title text-nethero-white font-semibold px-4 sm:px-8 lg:px-12 mb-2 select-none">
        {title}
      </h2>

      {/* ── Content: skeleton or carousel ─────────────────────────────── */}
      {loading ? (
        <SkeletonRow isLarge={isLarge} />
      ) : (
        <div className="relative">
          {/* Left edge gradient fade */}
          <div
            className="gradient-left absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none hidden lg:block"
            aria-hidden="true"
          />
          {/* Right edge gradient fade */}
          <div
            className="gradient-right absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none hidden lg:block"
            aria-hidden="true"
          />

          {/* ── Left nav arrow — desktop only, row-hover reveals ────── */}
          <button
            ref={prevRef}
            type="button"
            aria-label={`Scroll ${title} left`}
            className={[
              'absolute left-0 top-0 bottom-0 z-20 w-12',
              'hidden lg:flex items-center justify-center',
              'text-nethero-white transition-opacity duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              rowHovered ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-nethero-black/60 hover:bg-nethero-black/80 transition-colors">
              <ChevronLeft size={22} aria-hidden="true" />
            </span>
          </button>

          {/* ── Right nav arrow ──────────────────────────────────────── */}
          <button
            ref={nextRef}
            type="button"
            aria-label={`Scroll ${title} right`}
            className={[
              'absolute right-0 top-0 bottom-0 z-20 w-12',
              'hidden lg:flex items-center justify-center',
              'text-nethero-white transition-opacity duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              rowHovered ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-nethero-black/60 hover:bg-nethero-black/80 transition-colors">
              <ChevronRight size={22} aria-hidden="true" />
            </span>
          </button>

          {/* ── Swiper carousel ──────────────────────────────────────── */}
          <Swiper
            modules={[Navigation, FreeMode]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // Wire up custom buttons before Swiper initialises
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            freeMode={{
              enabled: true,
              sticky: false,
              momentumRatio: 0.5,
              momentumVelocityRatio: 0.5,
            }}
            breakpoints={BREAKPOINTS}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            watchOverflow
            className="!overflow-visible"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            {items.map((item, index) => (
              <SwiperSlide
                key={item.id}
                // overflow-visible so MovieCardHover scale isn't clipped
                className="!overflow-visible"
              >
                <MovieCard
                  item={item}
                  mediaType={mediaType}
                  isLarge={isLarge}
                  index={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default Row;
