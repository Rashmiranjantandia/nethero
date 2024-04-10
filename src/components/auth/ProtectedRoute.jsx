import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProfileStore } from '../../store/useProfileStore';
import { ROUTES } from '../../constants/routes';
import Spinner from '../common/Spinner';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const activeProfile = useProfileStore((s) => s.activeProfile);

  // Auth is still initialising — show spinner to avoid flash redirect
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nethero-bg">
        <Spinner size="lg" aria-label="Checking authentication" />
      </div>
    );
  }

  // Not authenticated → /login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Authenticated but no profile selected → /profiles
  if (!activeProfile) {
    return <Navigate to={ROUTES.PROFILES} replace />;
  }

  // All good — render child routes
  return <Outlet />;
};

export default ProtectedRoute;
