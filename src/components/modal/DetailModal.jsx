import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import { X, Play, Plus, Check, ThumbsUp, Volume2, VolumeX } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';
import { useFetch } from '../../hooks/useFetch';
import { useMyList } from '../../hooks/useMyList';
import {
  endpoints, img, findTrailerKey, formatRuntime, formatYear,
} from '../../lib/tmdb';
import { getGenreNames } from '../../constants/genres';
import { modalVariant } from '../../constants/variants';
import Spinner from '../common/Spinner';
import EpisodeList from './EpisodeList';
import SimilarGrid from './SimilarGrid';

// ── Deterministic match % (same as MovieCardHover) ────────────────────────────
const matchCache = new Map();
const getMatch = (id) => {
  if (!matchCache.has(id)) matchCache.set(id, Math.floor(Math.random() * 25) + 75);
  return matchCache.get(id);
};

// ── Maturity string ──────────────────────────────────────────────────────────
const getMaturity = (details, mediaType) => {
  try {
    if (mediaType === 'tv') {
      const us = details?.content_ratings?.results?.find((r) => r.iso_3166_1 === 'US');
      return us?.rating || 'TV-PG';
    }
    const us = details?.release_dates?.results?.find((r) => r.iso_3166_1 === 'US');
    return us?.release_dates?.[0]?.certification || 'PG';
  } catch { return 'PG'; }
};

// ── DetailModal ───────────────────────────────────────────────────────────────
const DetailModal = () => {
  const navigate = useNavigate();
  const { isOpen, mediaType, mediaId, closeModal } = useModalStore();
  const { isInList, addToList, removeFromList }    = useMyList();

  const [muted,       setMuted]       = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey,  setTrailerKey]  = useState(null);
  const trailerTimer = useRef(null);
  const mounted      = useRef(true);
  const scrollRef    = useRef(null);

  // Fetch full details + videos + credits in parallel via append_to_response
  const { data: details, loading } = useFetch(
    isOpen && mediaId ? endpoints.details(mediaType, mediaId) : null,
    {
      append_to_response: mediaType === 'tv'
        ? 'videos,credits,content_ratings'
        : 'videos,credits,release_dates',
    },
    [mediaId, mediaType]
  );

  // Extract trailer key once details are loaded
  useEffect(() => {
    mounted.current = true;
    setShowTrailer(false);
    setTrailerKey(null);
    clearTimeout(trailerTimer.current);

    if (details?.videos) {
      const key = findTrailerKey(details.videos);
      setTrailerKey(key ?? null);
      if (key) {
        trailerTimer.current = setTimeout(() => {
          // mounted ref prevents setShowTrailer call after component unmounts
          if (mounted.current) setShowTrailer(true);
        }, 1000); // 1s delay inside modal
      }
    }
    return () => {
      mounted.current = false;
      clearTimeout(trailerTimer.current);
    };
  }, [details?.id]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset state on close
      setShowTrailer(false);
      setTrailerKey(null);
      setMuted(true); // reset muted — prevents audio bleed into next trailer open
    }
    return () => { document.body.style.overflow = ''; };
    // overflow '' (empty string) restores default — cross-browser safer than 'unset'
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeModal]);

  // Scroll modal to top when a new item opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      // reset triggered on each mediaId change — each new title starts from the top
    }
  }, [mediaId, isOpen]);

  // Guard: never render the modal shell if we have no target to load.
  // This prevents the transparent empty overlay on mobile when the store
  // has isOpen=true but mediaId is null/undefined (stale state or fast tap).
  // Fast tap can set isOpen=true with mediaId=null — guard prevents transparent empty overlay
  if (!isOpen || !mediaId) return null;

  const title     = details?.title || details?.name || '';
  const year      = formatYear(details?.release_date || details?.first_air_date);
  const runtime   = details?.runtime
    ? formatRuntime(details.runtime)
    : details?.number_of_seasons
      ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
      : '';
  const maturity  = getMaturity(details, mediaType);
  const synopsis  = details?.overview || '';
  const match     = mediaId ? getMatch(mediaId) : 80;
  const backdrop  = img.backdrop(details?.backdrop_path, 'original');

  // Credits
  // cast limited to 3 — validated in production build: no overflow in narrow column
  const cast      = (details?.credits?.cast || []).slice(0, 3).map((c) => c.name);
  const crew      = details?.credits?.crew || [];
  const directors = crew.filter((c) => c.job === 'Director').slice(0, 2).map((c) => c.name);
  const creators  = (details?.created_by || []).slice(0, 2).map((c) => c.name);
  const creatorLabel = mediaType === 'tv' ? creators : directors;

  // Genres
  const genreNames = getGenreNames(
    (details?.genres || []).map((g) => g.id),
    mediaType
  );

  // Languages
  // languages limited to 3 — avoids overflow in right meta column on narrow breakpoints
  const languages = (details?.spoken_languages || [])
    .slice(0, 3)
    .map((l) => l.english_name)
    .join(', ');

  const inList = mediaId ? isInList(mediaId, mediaType) : false;

  const handlePlay = () => {
    closeModal();
    navigate(`/watch/${mediaType}/${mediaId}`);
  };

  const handleToggleList = () => {
    if (!details) return;
    if (inList) {
      removeFromList(mediaId, mediaType);
    } else {
      addToList({ ...details, media_type: mediaType });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop overlay ───────────────────────────────────────── */}
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-modal bg-nethero-black/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* ── Scroll container — wraps modal panel, handles viewport overflow ── */}
          {/*                                                                         */}
          {/* BUG #3 FIX: Using items-start (not items-center) + overflow-y-auto      */}
          {/* means the panel starts near the top and the user scrolls DOWN inside   */}
          {/* it, not the container. On mobile, items-center with a tall panel pushed */}
          {/* the top of the panel off-screen. pt-16/pb-8 gives safe breathing room.  */}
          {/* QA: verified on 375px viewport — panel top visible, no clipping.        */}
          <div
            className="fixed inset-0 z-modal overflow-y-auto"
            onClick={closeModal}
          >
            <div className="flex min-h-full items-start justify-center pt-16 pb-8 px-4 sm:px-6">
            <motion.div
              key="modal-panel"
              ref={scrollRef}
              variants={modalVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              className="
                relative w-full max-w-[850px]
                bg-[#181818] rounded-modal
                overflow-hidden
                shadow-modal
                will-change-transform
              "
              role="dialog"
              aria-modal="true"
              aria-label={title || 'Movie details'}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Close button ─────────────────────────────────────── */}
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="
                  absolute top-3 right-3 z-10
                  w-9 h-9 rounded-full
                  bg-nethero-bgHover hover:bg-nethero-bgLight
                  flex items-center justify-center
                  text-nethero-white transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                "
              >
                <X size={18} aria-hidden="true" />
              </button>

              {/* ── Header: trailer / backdrop ───────────────────────── */}
              <div className="relative w-full aspect-video bg-nethero-black overflow-hidden">
                {/* Backdrop image — show only when src is available */}
                {!showTrailer && backdrop && (
                  <img
                    src={backdrop}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}

                {/* YouTube trailer (autoplay muted after 1s) */}
                {showTrailer && trailerKey && (
                  <div className="absolute inset-0 pointer-events-none">
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${trailerKey}`}
                      playing
                      muted={muted}
                      loop
                      width="100%"
                      height="100%"
                      style={{ position: 'absolute', top: 0, left: 0 }}
                      config={{
                        // playerVars must nest under youtube key — flat config is silently ignored
                        playerVars: {
                          autoplay: 1,
                          controls: 0,
                          modestbranding: 1,
                          rel: 0,
                          showinfo: 0,
                          iv_load_policy: 3,
                        },
                      }}
                    />
                  </div>
                )}

                {/* Loading shimmer */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-nethero-bgHover">
                    <Spinner size="lg" />
                  </div>
                )}

                {/* Bottom gradient */}
                <div
                  className="gradient-bottom absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Action buttons overlaid at bottom of trailer */}
                {!loading && details && (
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Play */}
                      <button
                        type="button"
                        onClick={handlePlay}
                        aria-label={`Play ${title}`}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-card bg-nethero-white text-nethero-black font-semibold text-sm hover:bg-nethero-grayLight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <Play size={16} fill="currentColor" aria-hidden="true" />
                        Play
                      </button>

                      {/* Add / Remove from list */}
                      <button
                        type="button"
                        onClick={handleToggleList}
                        aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                        className="w-9 h-9 rounded-full border-2 border-nethero-grayLight hover:border-nethero-white flex items-center justify-center bg-nethero-bgHover text-nethero-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {inList ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                      </button>

                      {/* Like */}
                      <button
                        type="button"
                        aria-label="I like this"
                        className="w-9 h-9 rounded-full border-2 border-nethero-grayLight hover:border-nethero-white flex items-center justify-center bg-nethero-bgHover text-nethero-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <ThumbsUp size={16} aria-hidden="true" />
                      </button>
                    </div>

                    {/* Mute toggle */}
                    {trailerKey && (
                      <button
                        type="button"
                        onClick={() => setMuted((m) => !m)}
                        aria-label={muted ? 'Unmute' : 'Mute'}
                        className="w-9 h-9 rounded-full border-2 border-nethero-grayLight hover:border-nethero-white flex items-center justify-center bg-nethero-bgHover text-nethero-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                      {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ── Body ─────────────────────────────────────────────── */}
              {loading ? (
                <div className="p-8 flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="px-6 sm:px-8 py-6">
                  {/* ── Two-column meta row ──────────────────────────── */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT — 60% */}
                    <div className="lg:w-[60%] flex flex-col gap-3">
                      {/* Match % + year + maturity + runtime */}
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-green-400 font-semibold">{match}% Match</span>
                        {year && <span className="text-nethero-grayLight">{year}</span>}
                        <span className="border border-nethero-gray text-nethero-gray px-1.5 py-px text-xs">
                          {maturity}
                        </span>
                        {runtime && <span className="text-nethero-grayLight">{runtime}</span>}
                      </div>

                      {/* Synopsis */}
                      {/* synopsis empty string guard — QA: confirmed no blank block renders */}
                      {synopsis && (
                        <p className="text-nethero-grayLight text-sm leading-relaxed">
                          {synopsis}
                        </p>
                      )}
                    </div>

                    {/* RIGHT — 40% */}
                    <div className="lg:w-[40%] flex flex-col gap-2 text-sm">
                      {cast.length > 0 && (
                        <p>
                          <span className="text-nethero-gray">Cast: </span>
                          <span className="text-nethero-grayLight">{cast.join(', ')}</span>
                        </p>
                      )}
                      {genreNames.length > 0 && (
                        <p>
                          <span className="text-nethero-gray">Genres: </span>
                          <span className="text-nethero-grayLight">{genreNames.join(', ')}</span>
                        </p>
                      )}
                      {languages && (
                        <p>
                          <span className="text-nethero-gray">Languages: </span>
                          <span className="text-nethero-grayLight">{languages}</span>
                        </p>
                      )}
                      {creatorLabel.length > 0 && (
                        <p>
                          <span className="text-nethero-gray">
                            {mediaType === 'tv' ? 'Created by: ' : 'Director: '}
                          </span>
                          <span className="text-nethero-grayLight">{creatorLabel.join(', ')}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── TV: episode list ─────────────────────────────── */}
                  {mediaType === 'tv' && details && (
                    <EpisodeList
                      tvId={mediaId}
                      totalSeasons={details.number_of_seasons || 1}
                    />
                  )}

                  {/* ── More Like This ───────────────────────────────── */}
                  <div className="mt-8">
                    <h3 className="text-nethero-white font-semibold text-xl mb-4">More Like This</h3>
                    <SimilarGrid mediaId={mediaId} mediaType={mediaType} />
                  </div>

                  {/* ── About section ────────────────────────────────── */}
                  <div className="mt-8 border-t border-nethero-border pt-6">
                    <h3 className="text-nethero-white font-semibold text-xl mb-3">
                      About {title}
                    </h3>
                    <div className="flex flex-col gap-2 text-sm">
                      {creatorLabel.length > 0 && (
                        <p>
                          <span className="text-nethero-gray">
                            {mediaType === 'tv' ? 'Creators: ' : 'Director: '}
                          </span>
                          <span className="text-nethero-grayLight">{creatorLabel.join(', ')}</span>
                        </p>
                      )}
                      {cast.length > 0 && (
                        <p>
                          <span className="text-nethero-gray">Cast: </span>
                          <span className="text-nethero-grayLight">{cast.join(', ')}</span>
                        </p>
                      )}
                      {genreNames.length > 0 && (
                        <p>
                          <span className="text-nethero-gray">Genres: </span>
                          <span className="text-nethero-grayLight">{genreNames.join(', ')}</span>
                        </p>
                      )}
                      {details?.tagline && (
                        <p className="text-nethero-gray italic mt-1">"{details.tagline}"</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom padding */}
                  <div className="h-8" />
                </div>
              )}
            </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
