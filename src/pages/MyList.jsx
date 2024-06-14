import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { useMyList } from '../hooks/useMyList';
import { img } from '../lib/tmdb';
import { ROUTES } from '../constants/routes';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MovieCard from '../components/browse/MovieCard';
import DetailModal from '../components/modal/DetailModal';
import Spinner from '../components/common/Spinner';

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
    <Bookmark
      size={64}
      className="text-nethero-grayDark mb-6"
      aria-hidden="true"
    />
    <h2 className="text-nethero-white text-2xl font-semibold mb-3">
      Your list is empty
    </h2>
    <p className="text-nethero-grayLight text-base max-w-sm">
      Browse and add titles to your list. They&apos;ll appear here for easy access.
    </p>
  </div>
);

// ── Container animation ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── MyList page ───────────────────────────────────────────────────────────────
const MyList = () => {
  const navigate      = useNavigate();
  const signOut       = useAuthStore((s) => s.signOut);
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const profiles      = useProfileStore((s) => s.profiles);
  const setActive     = useProfileStore((s) => s.setActiveProfile);
  const clearProfiles = useProfileStore((s) => s.clearProfiles);

  // useMyList manages Supabase my_list for the active profile
  const { items, loading } = useMyList();

  const handleSignOut = async () => {
    clearProfiles();
    await signOut();
    navigate(ROUTES.LANDING, { replace: true });
  };

  // Reshape Supabase rows into TMDB-shaped objects for MovieCard
  const cards = items.map((h) => ({
    id:            h.tmdb_id,
    title:         h.title,
    name:          h.title,
    media_type:    h.media_type,
    backdrop_path: h.backdrop_path,
    poster_path:   h.poster_path,
  }));

  return (
    <div className="min-h-screen bg-nethero-bg flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <Navbar
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={setActive}
        onManage={() => navigate(ROUTES.PROFILES_MANAGE)}
        onSignOut={handleSignOut}
      />

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-8 lg:px-12">
        {/* Page header */}
        <h1 className="text-nethero-white text-3xl font-bold mb-6">My List</h1>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" aria-label="Loading your list" />
          </div>
        )}

        {/* Empty state */}
        {!loading && cards.length === 0 && <EmptyState />}

        {/* Grid of MovieCards — responsive per SPEC 20.7 */}
        {!loading && cards.length > 0 && (
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
            aria-label={`My List — ${cards.length} title${cards.length !== 1 ? 's' : ''}`}
          >
            {cards.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                // relative → gives MovieCardHover an absolute-positioning ancestor
                // z-[1] base → [&:hover]:z-[2] elevates above sibling cells on hover
                // so the floating MovieCardHover panel is never clipped by adjacent grid cells
                className="relative h-full z-[1] [&:hover]:z-[2]"
              >
                <MovieCard
                  item={item}
                  mediaType={item.media_type || 'movie'}
                  isLarge={false}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── DetailModal — mounted at page root ─────────────────────────── */}
      <DetailModal />
    </div>
  );
};

export default MyList;
