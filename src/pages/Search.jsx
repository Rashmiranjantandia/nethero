/**
 * Search page — SPEC 20.8.
 *
 * Reads ?q= from URL.
 * - If query: fetch searchMulti, render SearchResults.
 * - If no query: fetch trending 'all', render as "Top Searches".
 *
 * SearchBar in Navbar handles typing → pushes ?q= → this page reacts.
 */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { useFetch } from '../hooks/useFetch';
import { endpoints } from '../lib/tmdb';
import { ROUTES } from '../constants/routes';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SearchResults from '../components/search/SearchResults';
import DetailModal from '../components/modal/DetailModal';

const Search = () => {
  const navigate      = useNavigate();
  const signOut       = useAuthStore((s) => s.signOut);
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const profiles      = useProfileStore((s) => s.profiles);
  const setActive     = useProfileStore((s) => s.setActiveProfile);
  const clearProfiles = useProfileStore((s) => s.clearProfiles);

  // Read current query from URL (SearchBar keeps this in sync)
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  // ── Fetch: search OR trending (no query) ─────────────────────────────────
  // useFetch is stable — path changes only when query changes (after debounce)
  // Paths are mutually exclusive: search receives null when inactive, trending receives null when query is set
  const { data: searchData, loading: searchLoading } = useFetch(
    query ? endpoints.searchMulti() : null,
    query ? { query } : {},
    [query]
  );

  const { data: trendingData, loading: trendingLoading } = useFetch(
    !query ? endpoints.trending('all', 'week') : null,
    {},
    [query]
  );

  const handleSignOut = async () => {
    clearProfiles();
    await signOut();
    navigate(ROUTES.LANDING, { replace: true });
  };

  // Determine what to show
  const isSearching   = !!query;
  const results       = isSearching
    ? (searchData?.results ?? [])
    : (trendingData?.results ?? []);
  const loading       = isSearching ? searchLoading : trendingLoading;
  const sectionTitle  = isSearching ? `Results for "${query}"` : 'Top Searches';

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
        {/* Section heading */}
        <h1 className="text-nethero-white text-xl sm:text-2xl font-semibold mb-6">
          {sectionTitle}
        </h1>

        {/* Results grid / skeleton / empty state */}
        <SearchResults results={results} loading={loading} />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── DetailModal at page root ────────────────────────────────────── */}
      <DetailModal />
    </div>
  );
};

export default Search;
