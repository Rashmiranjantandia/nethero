import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProfileStore } from '../../store/useProfileStore';
import { ROUTES } from '../../constants/routes';
import Spinner from '../common/Spinner';

/**
 * Tier-1 guard: requires authenticated user only.
 * Used for /profiles and /profiles/manage — those pages DON'T need an activeProfile.
 */
export const AuthRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nethero-bg">
        <Spinner size="lg" aria-label="Checking authentication" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

/**
 * Tier-2 guard: requires authenticated user AND an active profile selected.
 * Used for /browse, /movies, /tv, /my-list, /search, /watch.
 */
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const activeProfile = useProfileStore((s) => s.activeProfile);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nethero-bg">
        <Spinner size="lg" aria-label="Checking authentication" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // User is logged in but hasn't selected a profile → go pick one
  if (!activeProfile) {
    return <Navigate to={ROUTES.PROFILES} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
