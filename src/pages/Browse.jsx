import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';
import { useMyList } from '../hooks/useMyList';
import { ROW_PRESETS, img } from '../lib/tmdb';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/browse/Hero';
import Row from '../components/browse/Row';
import DetailModal from '../components/modal/DetailModal';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../constants/routes';
import { useNavigate } from 'react-router-dom';

// ── Browse page ───────────────────────────────────────────────────────────────
const Browse = () => {
  const navigate      = useNavigate();
  const user          = useAuthStore((s) => s.user);
  const signOut       = useAuthStore((s) => s.signOut);
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const profiles      = useProfileStore((s) => s.profiles);
  const setActive     = useProfileStore((s) => s.setActiveProfile);
  const clearProfiles = useProfileStore((s) => s.clearProfiles);

  // ── My List ───────────────────────────────────────────────────────────────
  const { items: myListItems } = useMyList();

  // ── Continue Watching (watch_history) ─────────────────────────────────────
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    if (!activeProfile?.id) return;
    let cancelled = false;

    supabase
      .from('watch_history')
      .select('*')
      .eq('profile_id', activeProfile.id)
      .order('last_watched_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!cancelled && data) setWatchHistory(data);
      });

    return () => { cancelled = true; };
  }, [activeProfile?.id]);

  // ── Navbar handlers ───────────────────────────────────────────────────────
  const handleSignOut = async () => {
    clearProfiles();
    await signOut();
    navigate(ROUTES.LANDING, { replace: true });
  };

  const handleManage = () => navigate(ROUTES.PROFILES_MANAGE);

  // Reshape watch_history rows into TMDB-shaped items for Row
  const continueItems = watchHistory.map((h) => ({
    id:            h.tmdb_id,
    title:         h.title,
    name:          h.title,
    media_type:    h.media_type,
    backdrop_path: h.backdrop_path,
    poster_path:   h.poster_path,
  }));

  // Reshape My List items into TMDB-shaped items for Row
  const myListMapped = myListItems.map((h) => ({
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
        onManage={handleManage}
        onSignOut={handleSignOut}
      />

      {/* ── Hero billboard ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── Row stack ──────────────────────────────────────────────────── */}
      <div className="relative z-[1] -mt-16 pb-8">
        {/* Continue Watching — only if history has items */}
        {continueItems.length > 0 && (
          <Row
            title="Continue Watching"
            items={continueItems}
            mediaType="movie"   // mixed — individual items carry media_type
            isLarge={false}
          />
        )}

        {/* My List — only if list has items */}
        {myListMapped.length > 0 && (
          <Row
            title="My List"
            items={myListMapped}
            mediaType="movie"
            isLarge={false}
          />
        )}

        {/* Curated rows from ROW_PRESETS */}
        {ROW_PRESETS.map((preset) => (
          <Row
            key={preset.id}
            title={preset.title}
            path={preset.path}
            params={preset.params}
            mediaType={
              preset.id === 'originals' || preset.id === 'top-tv'
                ? 'tv'
                : 'movie'
            }
            isLarge={preset.id === 'originals'}
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

export default Browse;
