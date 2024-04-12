import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import App from './App';
import { AuthRoute, ProtectedRoute } from './components/auth/ProtectedRoute';
import Spinner from './components/common/Spinner';

// ── Lazy page imports ─────────────────────────────────────────────────────────
const Landing       = lazy(() => import('./pages/Landing'));
const Login         = lazy(() => import('./pages/Login'));
const Signup        = lazy(() => import('./pages/Signup'));
const ProfileSelect = lazy(() => import('./pages/ProfileSelect'));
const ProfileManage = lazy(() => import('./pages/ProfileManage'));
const Browse        = lazy(() => import('./pages/Browse'));
const Movies        = lazy(() => import('./pages/Movies'));
const TVShows       = lazy(() => import('./pages/TVShows'));
const MyList        = lazy(() => import('./pages/MyList'));
const Search        = lazy(() => import('./pages/Search'));
const Watch         = lazy(() => import('./pages/Watch'));
const NotFound      = lazy(() => import('./pages/NotFound'));

// ── Suspense fallback ────────────────────────────────────────────────────────
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-nethero-bg">
    <Spinner size="lg" aria-label="Loading page" />
  </div>
);

// ── Router ───────────────────────────────────────────────────────────────────
export const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        // ── Public routes ──────────────────────────────────────────────────
        {
          path: ROUTES.LANDING,
          element: (
            <Suspense fallback={<PageFallback />}>
              <Landing />
            </Suspense>
          ),
        },
        {
          path: ROUTES.LOGIN,
          element: (
            <Suspense fallback={<PageFallback />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: ROUTES.SIGNUP,
          element: (
            <Suspense fallback={<PageFallback />}>
              <Signup />
            </Suspense>
          ),
        },

        // ── Tier-1: auth-only (user required, no activeProfile needed) ─────
        // /profiles and /profiles/manage must NOT redirect to /profiles
        // or they cause an infinite loop.
        {
          element: <AuthRoute />,
          children: [
            {
              path: ROUTES.PROFILES,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <ProfileSelect />
                </Suspense>
              ),
            },
            {
              path: ROUTES.PROFILES_MANAGE,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <ProfileManage />
                </Suspense>
              ),
            },
          ],
        },

        // ── Tier-2: auth + active profile (full protection) ───────────────
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: ROUTES.BROWSE,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <Browse />
                </Suspense>
              ),
            },
            {
              path: ROUTES.MOVIES,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <Movies />
                </Suspense>
              ),
            },
            {
              path: ROUTES.TV,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <TVShows />
                </Suspense>
              ),
            },
            {
              path: ROUTES.MY_LIST,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <MyList />
                </Suspense>
              ),
            },
            {
              path: ROUTES.SEARCH,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <Search />
                </Suspense>
              ),
            },
            {
              path: ROUTES.WATCH,
              element: (
                <Suspense fallback={<PageFallback />}>
                  <Watch />
                </Suspense>
              ),
            },
          ],
        },

        // ── Catch-all ─────────────────────────────────────────────────────
        {
          path: ROUTES.NOT_FOUND,
          element: (
            <Suspense fallback={<PageFallback />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
