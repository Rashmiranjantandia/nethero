import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import { Play, Info } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { fetchTMDB, endpoints, img, findTrailerKey, formatYear } from '../../lib/tmdb';
import { useModalStore } from '../../store/useModalStore';
import Image from '../common/Image';
import Button from '../common/Button';
import BillboardControls from './BillboardControls';
import Skeleton from '../common/Skeleton';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pick first trending item that has a backdrop. */
const pickFeatured = (results = []) =>
  results.find((r) => r.backdrop_path) ?? results[0] ?? null;

/** Derive maturity rating string from TMDB cert data. */
const getMaturity = (certData, mediaType) => {
  try {
    if (mediaType === 'tv') {
      const us = certData?.results?.find((r) => r.iso_3166_1 === 'US');
      return us?.rating || 'TV-PG';
    }
    const us = certData?.results?.find((r) => r.iso_3166_1 === 'US');
    const cert = us?.release_dates?.[0]?.certification;
    return cert || 'PG';
  } catch {
    return 'PG';
  }
};

// ── Skeleton billboard ────────────────────────────────────────────────────────
const HeroSkeleton = () => (
  <div className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[85vh] 3xl:h-[90vh] bg-nethero-bgLight overflow-hidden">
    <Skeleton className="absolute inset-0 w-full h-full" rounded="rounded-none" />
    <div className="absolute bottom-0 left-0 p-6 sm:p-12 lg:p-16 flex flex-col gap-4">
      <Skeleton className="w-56 h-8 rounded-card" />
      <Skeleton className="w-96 h-4 rounded-card" />
      <Skeleton className="w-80 h-4 rounded-card" />
      <div className="flex gap-3 mt-2">
        <Skeleton className="w-28 h-12 rounded-card" />
        <Skeleton className="w-32 h-12 rounded-card" />
      </div>
    </div>
  </div>
);

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => {
  const navigate   = useNavigate();
  const openModal  = useModalStore((s) => s.openModal);

  // Fetch trending to get featured item
  const { data: trendingData, loading: trendingLoading } = useFetch(
    endpoints.trending('all', 'week')
  );

  const featured = pickFeatured(trendingData?.results);
  const mediaType = featured?.media_type ?? 'movie';

  // Trailer + details state
  const [trailerKey,  setTrailerKey]  = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [muted,       setMuted]       = useState(true);
  const [maturity,    setMaturity]    = useState('PG');
  const trailerTimer = useRef(null);
  const mounted      = useRef(true);

  // When featured is resolved, fetch its videos + cert details
  useEffect(() => {
    if (!featured?.id) return;
    mounted.current = true;

    const loadDetails = async () => {
      // Fetch videos and content rating in parallel
      const [videosRes, detailsRes] = await Promise.all([
        fetchTMDB(endpoints.videos(mediaType, featured.id)),
        fetchTMDB(endpoints.details(mediaType, featured.id), {
          append_to_response: mediaType === 'tv'
            ? 'content_ratings'
            : 'release_dates',
        }),
      ]);

      if (!mounted.current) return;

      // Trailer key
      if (videosRes.data) {
        const key = findTrailerKey(videosRes.data);
        setTrailerKey(key ?? null);
        if (key) {
          // Auto-play trailer after 3 seconds (SPEC requirement)
          trailerTimer.current = setTimeout(() => {
            if (mounted.current) setShowTrailer(true);
          }, 3000);
        }
      }

      // Maturity rating
      if (detailsRes.data) {
        const certSource =
          mediaType === 'tv'
            ? detailsRes.data.content_ratings
            : detailsRes.data.release_dates;
        setMaturity(getMaturity(certSource, mediaType));
      }
    };

    loadDetails();

    return () => {
      mounted.current = false;
      clearTimeout(trailerTimer.current);
      setShowTrailer(false);
      setTrailerKey(null);
    };
  }, [featured?.id, mediaType]);

  const handlePlay = () => {
    if (!featured) return;
    navigate(`/watch/${mediaType}/${featured.id}`);
  };

  const handleMoreInfo = () => {
    if (!featured) return;
    openModal(mediaType, featured.id);
  };

  const title    = featured?.title ?? featured?.name ?? '';
  const synopsis = featured?.overview ?? '';
  const year     = formatYear(featured?.release_date ?? featured?.first_air_date);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (trendingLoading || !featured) return <HeroSkeleton />;

  return (
    <section
      className="relative w-full h-[60vh] sm:h-[75vh] lg:h-[85vh] 3xl:h-[90vh] overflow-hidden"
      aria-label={`Featured: ${title}`}
    >
      {/* ── Layer 1: Backdrop image ────────────────────────────────────────── */}
      <AnimatePresence>
        {!showTrailer && (
          <motion.div
            key="backdrop"
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Image
              src={img.backdrop(featured.backdrop_path, 'original')}
              alt={title}
              className="w-full h-full"
              rounded="rounded-none"
              loading="eager"
              fallback="/placeholder-backdrop.jpg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Layer 2: YouTube trailer (muted, looping) ─────────────────────── */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div
            key="trailer"
            className="absolute inset-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          >
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              playing
              muted={muted}
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
                  // Scale YouTube's 16:9 frame to cover the hero height
                  origin: window.location.origin,
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ambient dark overlay (always present, keeps text readable) ────── */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-nethero-black/80 via-nethero-black/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Bottom gradient fade to page background ────────────────────────── */}
      <div
        className="gradient-bottom absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Left content panel ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
        <motion.div
          className="max-w-2xl px-6 sm:px-12 lg:px-16 flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Year badge */}
          {year && (
            <span className="text-sm text-nethero-grayLight">{year}</span>
          )}

          {/* Title */}
          <h1
            className="text-hero font-bold text-shadow text-nethero-white line-clamp-2 leading-none"
          >
            {title}
          </h1>

          {/* Synopsis */}
          <p className="text-lg text-nethero-grayLight text-shadow line-clamp-3 max-w-xl leading-snug">
            {synopsis}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <Button
              variant="primary"
              size="lg"
              icon={Play}
              onClick={handlePlay}
              aria-label={`Play ${title}`}
            >
              Play
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={Info}
              onClick={handleMoreInfo}
              aria-label={`More info about ${title}`}
            >
              More Info
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom-right: mute toggle + maturity badge ──────────────────────── */}
      <div
        className="absolute bottom-20 sm:bottom-24 right-6 sm:right-12 lg:right-16 z-10"
        aria-label="Playback controls"
      >
        <BillboardControls
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          maturityRating={maturity}
          hasTrailer={!!trailerKey}
        />
      </div>
    </section>
  );
};

export default Hero;
