import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { endpoints } from '../lib/tmdb';
import { TV_GENRES } from '../constants/genres';
import { ROUTES } from '../constants/routes';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/browse/Hero';
import Row from '../components/browse/Row';
import DetailModal from '../components/modal/DetailModal';

// ── TV-only row definitions ───────────────────────────────────────────────────
const TV_ROWS = [
  { id: 'trending-tv',    title: 'Trending TV Shows',   path: endpoints.trending('tv', 'week'),     params: {} },
  // with_networks: 213 is Netflix's TMDB network ID — required to filter Originals content
  { id: 'originals',      title: 'NetHero Originals',   path: endpoints.netflixOriginals(),          params: { with_networks: 213 }, isLarge: true },
  { id: 'top-rated-tv',   title: 'Top Rated',           path: endpoints.topRated('tv'),              params: {} },
  { id: 'popular-tv',     title: 'Popular',             path: endpoints.popular('tv'),               params: {} },
  { id: 'action-adv',     title: 'Action & Adventure',  path: endpoints.byGenre('tv'),               params: { with_genres: 10759 } },
  { id: 'comedy-tv',      title: 'Comedy',              path: endpoints.byGenre('tv'),               params: { with_genres: 35 } },
  { id: 'crime-tv',       title: 'Crime',               path: endpoints.byGenre('tv'),               params: { with_genres: 80 } },
  { id: 'drama-tv',       title: 'Drama',               path: endpoints.byGenre('tv'),               params: { with_genres: 18 } },
  { id: 'sci-fi-tv',      title: 'Sci-Fi & Fantasy',    path: endpoints.byGenre('tv'),               params: { with_genres: 10765 } },
  { id: 'mystery-tv',     title: 'Mystery',             path: endpoints.byGenre('tv'),               params: { with_genres: 9648 } },
  { id: 'docs-tv',        title: 'Documentary',         path: endpoints.byGenre('tv'),               params: { with_genres: 99 } },
  { id: 'kids-tv',        title: 'Kids',                path: endpoints.byGenre('tv'),               params: { with_genres: 10762 } },
];

// Genre options for the filter dropdown
const GENRE_OPTIONS = [
  { id: null, label: 'All Genres' },
  ...Object.entries(TV_GENRES).map(([id, label]) => ({ id: Number(id), label })),
];

// ── TVShows page ──────────────────────────────────────────────────────────────
const TVShows = () => {
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

  // When a genre is selected, show a single genre row
  const visibleRows = selectedGenreId
    ? [{ id: `tv-genre-${selectedGenreId}`, title: TV_GENRES[selectedGenreId] || 'Genre', path: endpoints.byGenre('tv'), params: { with_genres: selectedGenreId } }]
    : TV_ROWS;

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

      {/* ── Hero — TV trending ──────────────────────────────────────────── */}
      <Hero trendingType="tv" />

      {/* ── Genre filter + row stack ────────────────────────────────────── */}
      <div className="relative z-[1] -mt-16 pb-8">
        {/* Genre filter dropdown */}
        <div className="px-4 sm:px-8 lg:px-12 pt-4 pb-2 flex items-center gap-3">
          <label
            htmlFor="tv-genre-select"
            className="text-nethero-grayLight text-sm font-medium flex-shrink-0"
          >
            Genre
          </label>
          <select
            id="tv-genre-select"
            value={selectedGenreId ?? ''}
            onChange={(e) =>
              setSelectedGenreId(e.target.value === '' ? null : Number(e.target.value))
            }
            aria-label="Filter TV shows by genre"
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
            mediaType="tv"
            isLarge={row.isLarge ?? false}
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

export default TVShows;
