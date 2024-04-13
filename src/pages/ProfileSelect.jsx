import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { ROUTES } from '../constants/routes';
import Spinner from '../components/common/Spinner';

// ── Avatar colors for profiles that have no avatar_url ───────────────────────
const AVATAR_COLORS = [
  '#E50914', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0',
];

// ── Single avatar tile ────────────────────────────────────────────────────────
const ProfileAvatar = ({ profile, index, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initial = (profile.name || '?')[0].toUpperCase();

  return (
    <motion.button
      type="button"
      onClick={() => onClick(profile)}
      aria-label={`Select profile: ${profile.name}`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center gap-3 group focus-visible:outline-none"
    >
      {/* Avatar image or colour initial fallback */}
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-card overflow-hidden border-2 border-transparent group-hover:border-nethero-white transition-colors"
      >
        {profile.avatar_url && !imgError ? (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          >
            {initial}
          </div>
        )}
      </div>

      {/* Profile name */}
      <span className="text-nethero-gray text-sm group-hover:text-nethero-white transition-colors">
        {profile.name}
      </span>
    </motion.button>
  );
};

// ── Add Profile tile ──────────────────────────────────────────────────────────
const AddProfileTile = ({ onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    aria-label="Add a new profile"
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.96 }}
    transition={{ duration: 0.15 }}
    className="flex flex-col items-center gap-3 group focus-visible:outline-none"
  >
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-card border-2 border-nethero-grayDark group-hover:border-nethero-white flex items-center justify-center transition-colors bg-nethero-bgLight">
      <Plus size={40} className="text-nethero-grayDark group-hover:text-nethero-white transition-colors" />
    </div>
    <span className="text-nethero-gray text-sm group-hover:text-nethero-white transition-colors">
      Add Profile
    </span>
  </motion.button>
);

// ── ProfileSelect page ────────────────────────────────────────────────────────
const ProfileSelect = () => {
  const navigate    = useNavigate();
  const user        = useAuthStore((s) => s.user);
  const { profiles, fetchProfiles, setActiveProfile, clearProfiles } =
    useProfileStore();

  const [loading, setLoading]   = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Wait for user to be available before fetching profiles
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    setLoading(true);
    setFetchError(null);

    fetchProfiles(user.id).then(({ error }) => {
      if (cancelled) return;
      if (error) setFetchError(error);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [user?.id, fetchProfiles]);

  const handleSelectProfile = (profile) => {
    setActiveProfile(profile);
    navigate(ROUTES.BROWSE, { replace: true });
  };

  const handleAddProfile = () => {
    navigate(ROUTES.PROFILES_MANAGE);
  };

  const handleManageProfiles = () => {
    navigate(ROUTES.PROFILES_MANAGE);
  };

  const handleSignOut = async () => {
    clearProfiles();
    await useAuthStore.getState().signOut();
    navigate(ROUTES.LANDING, { replace: true });
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nethero-bg">
        <Spinner size="lg" aria-label="Loading profiles" />
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-nethero-bg text-nethero-white gap-4">
        <p className="text-nethero-grayLight">Could not load profiles.</p>
        <button
          type="button"
          onClick={() => { setLoading(true); fetchProfiles(user.id).then(() => setLoading(false)); }}
          className="px-6 py-2 bg-nethero-white text-nethero-black rounded-card text-sm font-semibold hover:bg-nethero-grayLight transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const MAX_PROFILES = 5;
  const canAddMore = profiles.length < MAX_PROFILES;

  return (
    <div className="min-h-screen bg-nethero-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-nethero-white mb-10 sm:mb-14"
      >
        Who's watching?
      </motion.h1>

      {/* Profile grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-2xl"
        role="list"
        aria-label="Profile list"
      >
        {profiles.map((profile, i) => (
          <div key={profile.id} role="listitem">
            <ProfileAvatar
              profile={profile}
              index={i}
              onClick={handleSelectProfile}
            />
          </div>
        ))}

        {/* Add Profile tile (shown when < 5 profiles) */}
        {canAddMore && (
          <div role="listitem">
            <AddProfileTile onClick={handleAddProfile} />
          </div>
        )}
      </motion.div>

      {/* Manage Profiles button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col items-center gap-3 mt-10 sm:mt-14"
      >
        <button
          type="button"
          onClick={handleManageProfiles}
          className="flex items-center gap-2 border border-nethero-grayDark text-nethero-gray hover:border-nethero-white hover:text-nethero-white px-8 py-2 text-sm tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
        >
          <Pencil size={14} aria-hidden="true" />
          Manage Profiles
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="text-xs text-nethero-gray hover:text-nethero-grayLight transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Sign out
        </button>
      </motion.div>
    </div>
  );
};

export default ProfileSelect;
