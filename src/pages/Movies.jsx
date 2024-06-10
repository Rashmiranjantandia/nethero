import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { endpoints } from '../lib/tmdb';
import { MOVIE_GENRES } from '../constants/genres';
import { ROUTES } from '../constants/routes';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/browse/Hero';
import Row from '../components/browse/Row';
import DetailModal from '../components/modal/DetailModal';

// ── Movie-only row definitions ────────────────────────────────────────────────
const MOVIE_ROWS = [
  { id: 'trending-movies', title: 'Trending Movies',  path: endpoints.trending('movie', 'week'), params: {} },
  { id: 'top-rated',       title: 'Top Rated',        path: endpoints.topRated('movie'),          params: {} },
  { id: 'now-playing',     title: 'Now Playing',      path: endpoints.nowPlaying(),               params: {} },
  { id: 'upcoming',        title: 'Upcoming',         path: endpoints.upcoming(),                 params: {} },
  { id: 'action',          title: 'Action',           path: endpoints.byGenre('movie'),           params: { with_genres: 28 } },
  { id: 'comedy',          title: 'Comedy',           path: endpoints.byGenre('movie'),           params: { with_genres: 35 } },
  { id: 'horror',          title: 'Horror',           path: endpoints.byGenre('movie'),           params: { with_genres: 27 } },
  { id: 'romance',         title: 'Romance',          path: endpoints.byGenre('movie'),           params: { with_genres: 10749 } },
  { id: 'sci-fi',          title: 'Sci-Fi',           path: endpoints.byGenre('movie'),           params: { with_genres: 878 } },
  { id: 'thriller',        title: 'Thriller',         path: endpoints.byGenre('movie'),           params: { with_genres: 53 } },
  { id: 'animation',       title: 'Animation',        path: endpoints.byGenre('movie'),           params: { with_genres: 16 } },
  { id: 'documentary',     title: 'Documentary',      path: endpoints.byGenre('movie'),           params: { with_genres: 99 } },
];

// Genre options for the filter dropdown (id → label)
const GENRE_OPTIONS = [
  { id: null,  label: 'All Genres' },
  ...Object.entries(MOVIE_GENRES).map(([id, label]) => ({ id: Number(id), label })),
];

// ── Movies page ───────────────────────────────────────────────────────────────
const Movies = () => {
  const navigate      = useNavigate();
  const signOut       = useAuthStore((s) => s.signOut);
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const profiles      = useProfileStore((s) => s.profiles);
  const setActive     = useProfileStore((s) => s.setActiveProfile);
  const clearProfiles = useProfileStore((s) => s.clearProfiles);

  // Genre filter — null = show all rows
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  const handleSignOut = async () => {
    clearProfiles();
    await signOut();
    navigate(ROUTES.LANDING, { replace: true });
  };

  // When a genre is selected, show a single genre row instead of all rows
  const visibleRows = selectedGenreId
    ? [{ id: `genre-${selectedGenreId}`, title: MOVIE_GENRES[selectedGenreId] || 'Genre', path: endpoints.byGenre('movie'), params: { with_genres: selectedGenreId } }]
    : MOVIE_ROWS;

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

      {/* ── Hero — movies trending ──────────────────────────────────────── */}
      <Hero trendingType="movie" />

      {/* ── Genre filter + row stack ────────────────────────────────────── */}
      <div className="relative z-[1] -mt-16 pb-8">
        {/* Genre filter dropdown */}
        <div className="px-4 sm:px-8 lg:px-12 pt-4 pb-2 flex items-center gap-3">
          <label
            htmlFor="movie-genre-select"
            className="text-nethero-grayLight text-sm font-medium flex-shrink-0"
          >
            Genre
          </label>
          <select
            id="movie-genre-select"
            value={selectedGenreId ?? ''}
            onChange={(e) =>
              setSelectedGenreId(e.target.value === '' ? null : Number(e.target.value))
            }
            aria-label="Filter movies by genre"
            className="
              bg-nethero-bgHover border border-nethero-border
              text-nethero-white text-sm rounded-card
              px-3 py-1.5
              focus:outline-none focus:ring-2 focus:ring-nethero-white
              cursor-pointer
            "
          >
            {GENRE_OPTIONS.map(({ id, label }) => (
              <option key={id ?? 'all'} value={id ?? ''}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Content rows */}
        {visibleRows.map((row) => (
          <Row
            key={row.id}
            title={row.title}
            path={row.path}
            params={row.params}
            mediaType="movie"
            isLarge={false}
          />
        ))}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── DetailModal — mounted at page root ─────────────────────────── */}
      <DetailModal />
    </div>
  );
};

export default Movies;
