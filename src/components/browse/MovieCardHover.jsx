import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import {
  Play, Plus, Check, ThumbsUp, ThumbsDown, ChevronDown,
} from 'lucide-react';
import { fetchTMDB, endpoints, findTrailerKey, img, formatRuntime, formatYear } from '../../lib/tmdb';
import { getGenreNames } from '../../constants/genres';
import { useMyList } from '../../hooks/useMyList';
import { useModalStore } from '../../store/useModalStore';

// ── Stable random match % per item id (deterministic, avoids re-randomising) ──
const matchCache = new Map();
const getMatch = (id) => {
  if (!matchCache.has(id)) {
    matchCache.set(id, Math.floor(Math.random() * 25) + 75); // 75–99
  }
  return matchCache.get(id);
};

// ── Maturity badge mapping ────────────────────────────────────────────────────
const getMaturity = (rating) => {
  if (!rating) return 'PG';
  const r = String(rating).toLowerCase();
  if (r.includes('g') && !r.includes('pg')) return 'G';
  if (r.includes('pg-13') || r.includes('tv-14')) return 'PG-13';
  if (r.includes('r') || r.includes('tv-ma')) return 'R';
  if (r.includes('nc-17')) return 'NC-17';
  return 'PG';
};

// ── Small action icon button ──────────────────────────────────────────────────
const ActionBtn = ({ icon: Icon, label, onClick, active = false, size = 18 }) => (
  <button
    type="button"
    aria-label={label}
    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    className={[
      'flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
      active
        ? 'border-nethero-white bg-nethero-white text-nethero-black'
        : 'border-nethero-grayDark bg-nethero-bgHover text-nethero-white hover:border-nethero-white',
    ].join(' ')}
  >
    <Icon size={size} aria-hidden="true" />
  </button>
);

// ── MovieCardHover ────────────────────────────────────────────────────────────
const MovieCardHover = ({ item, mediaType, isLarge, index, onPlay }) => {
  const openModal    = useModalStore((s) => s.openModal);
  const { isInList, addToList, removeFromList } = useMyList();

  const [trailerKey,   setTrailerKey]   = useState(null);
  const [showTrailer,  setShowTrailer]  = useState(false);
  const [details,      setDetails]      = useState(null);
  const trailerTimer = useRef(null);
  const mounted      = useRef(true);

  const inList = isInList(item.id, mediaType);
  const match  = getMatch(item.id);
  const title  = item.title || item.name || '';
  const year   = formatYear(item.release_date || item.first_air_date);

  // Fetch videos for trailer preview (fires once on mount)
  useEffect(() => {
    mounted.current = true;

    const load = async () => {
      const [videosRes, detailsRes] = await Promise.all([
        fetchTMDB(endpoints.videos(mediaType, item.id)),
        fetchTMDB(endpoints.details(mediaType, item.id)),
      ]);

      if (!mounted.current) return;

      if (videosRes.data) {
        const key = findTrailerKey(videosRes.data);
        setTrailerKey(key);
        if (key) {
          // Delay trailer autoplay by 800ms (SPEC requirement)
          trailerTimer.current = setTimeout(() => {
            if (mounted.current) setShowTrailer(true);
          }, 800);
        }
      }

      if (detailsRes.data) {
        setDetails(detailsRes.data);
      }
    };

    load();

    return () => {
      mounted.current = false;
      clearTimeout(trailerTimer.current);
    };
  }, [item.id, mediaType]);

  const handleToggleList = useCallback(() => {
    if (inList) {
      removeFromList(item.id, mediaType);
    } else {
      addToList({ ...item, media_type: mediaType });
    }
  }, [inList, item, mediaType, addToList, removeFromList]);

  const handleMoreInfo = useCallback(() => {
    openModal(mediaType, item.id);
  }, [openModal, mediaType, item.id]);

  // Genre tags (up to 3)
  const genreNames = getGenreNames(
    (details?.genres ?? item.genre_ids ?? []).map((g) =>
      typeof g === 'object' ? g.id : g
    ),
    mediaType
  ).slice(0, 3);

  // Runtime or episode count
  const runtime = details?.runtime
    ? formatRuntime(details.runtime)
    : details?.number_of_seasons
      ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
      : '';

  // Maturity rating
  const maturity = getMaturity(
    details?.content_ratings?.results?.[0]?.rating ||
    details?.release_dates?.results?.[0]?.release_dates?.[0]?.certification
  );

  return (
    <motion.div
      // Positioned absolutely so it lifts over sibling cards
      className={[
        'absolute inset-0 z-[100]',
        'rounded-card',
        // NO overflow-hidden here — the info panel extends BELOW the card image.
        // overflow-hidden would clip it. Individual sections manage their own overflow.
        'shadow-2xl',
        'will-change-transform',
        'flex flex-col',
      ].join(' ')}
      style={{ originX: 0.5, originY: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // Do NOT stopPropagation on the root — that blocks mobile card clicks.
      // Each action button stops its own propagation individually.
    >
      {/* ── Image / Trailer area ────────────────────────────────────────────── */}
      <div
        className={[
          'relative bg-nethero-black flex-shrink-0',
          isLarge ? 'aspect-[2/3]' : 'aspect-video',
        ].join(' ')}
      >
        {/* Backdrop / Poster fallback — shown before trailer starts */}
        <AnimatePresence>
          {!showTrailer && (
            <motion.img
              key="thumb"
              src={
                isLarge
                  ? img.poster(item.poster_path, 'w500')
                  : img.backdrop(item.backdrop_path, 'w780')
              }
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Muted YouTube trailer — autoplay after 800ms hover */}
        {trailerKey && showTrailer && (
          <div className="absolute inset-0 pointer-events-none">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              playing
              muted
              loop
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              config={{
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  origin: window.location.origin,
                },
              }}
            />
          </div>
        )}

        {/* Bottom gradient blending into info panel */}
        <div
          className="absolute bottom-0 inset-x-0 h-12 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, #181818)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Info panel ─────────────────────────────────────────────────────── */}
      <motion.div
        className="bg-[#181818] px-3 pb-3 pt-2 flex-1 flex flex-col gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {/* Action buttons row */}
        <div className="flex items-center justify-between">
          {/* Left: Play, Add/Remove, Like, Dislike */}
          <div className="flex items-center gap-1.5">
            {/* Play */}
            <button
              type="button"
              aria-label={`Play ${title}`}
              onClick={(e) => { e.stopPropagation(); onPlay?.(); }}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:bg-nethero-grayLight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white will-change-transform"
            >
              <Play size={18} fill="currentColor" aria-hidden="true" />
            </button>

            {/* Add / Remove from My List */}
            <ActionBtn
              icon={inList ? Check : Plus}
              label={inList ? 'Remove from My List' : 'Add to My List'}
              onClick={handleToggleList}
              active={inList}
            />

            {/* Like */}
            <ActionBtn icon={ThumbsUp}   label="I like this"      />
            {/* Dislike */}
            <ActionBtn icon={ThumbsDown} label="Not for me"       />
          </div>

          {/* Right: More Info chevron */}
          <ActionBtn
            icon={ChevronDown}
            label="More info"
            onClick={handleMoreInfo}
          />
        </div>

        {/* Match % + metadata row */}
        <div className="flex items-center gap-2 flex-wrap text-xs leading-none">
          <span className="text-green-400 font-semibold">{match}% Match</span>
          {year && (
            <span className="text-nethero-grayLight">{year}</span>
          )}
          <span className="border border-nethero-gray text-nethero-gray px-1 py-px text-[10px]">
            {maturity}
          </span>
          {runtime && (
            <span className="text-nethero-grayLight">{runtime}</span>
          )}
        </div>

        {/* Genre tags */}
        {genreNames.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {genreNames.map((g, i) => (
              <span key={g} className="flex items-center gap-1.5 text-xs text-nethero-grayLight">
                {g}
                {i < genreNames.length - 1 && (
                  <span className="inline-block w-1 h-1 rounded-full bg-nethero-grayDark" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MovieCardHover;
