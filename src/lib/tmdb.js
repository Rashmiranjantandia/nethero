import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE    = import.meta.env.VITE_TMDB_BASE_URL;
const IMG     = import.meta.env.VITE_TMDB_IMG_URL;

if (!API_KEY || !BASE) {
  console.error(
    '[NetHero] Missing TMDB env variables. ' +
    'Set VITE_TMDB_API_KEY and VITE_TMDB_BASE_URL in .env.local'
  );
}

const tmdb = axios.create({
  baseURL: BASE || 'https://api.themoviedb.org/3',
  params: { api_key: API_KEY, language: 'en-US' },
  timeout: 10000,
});

// Retry once on network fail
tmdb.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    if (!config._retry && err.code !== 'ERR_CANCELED') {
      config._retry = true;
      return tmdb(config);
    }
    return Promise.reject(err);
  }
);

// ==== IMAGE HELPERS ====
const imgBase = (IMG || 'https://image.tmdb.org/t/p').replace(/\/$/, '');

export const img = {
  poster:   (path, size = 'w500')     => path ? `${imgBase}/${size}${path}` : '/placeholder-poster.jpg',
  backdrop: (path, size = 'original') => path ? `${imgBase}/${size}${path}` : '/placeholder-backdrop.jpg',
  profile:  (path, size = 'w185')     => path ? `${imgBase}/${size}${path}` : '/placeholder-avatar.jpg',
  logo:     (path, size = 'w300')     => path ? `${imgBase}/${size}${path}` : null,
};

// ==== ENDPOINTS ====
// IMPORTANT: paths must NOT embed '?' query strings.
// Pass extra filters via the params argument to fetchTMDB / useFetch.
export const endpoints = {
  // Browse rows
  trending:         (type = 'all', window = 'week') => `/trending/${type}/${window}`,
  netflixOriginals: () => `/discover/tv`,        // params: { with_networks: 213 }
  topRated:         (type = 'movie') => `/${type}/top_rated`,
  popular:          (type = 'movie') => `/${type}/popular`,
  upcoming:         () => `/movie/upcoming`,
  nowPlaying:       () => `/movie/now_playing`,
  byGenre:          (type) => `/discover/${type}`, // params: { with_genres: genreId }

  // Details — append_to_response is passed as a param, not in the path
  details:  (type, id) => `/${type}/${id}`,
  videos:   (type, id) => `/${type}/${id}/videos`,
  credits:  (type, id) => `/${type}/${id}/credits`,
  similar:  (type, id) => `/${type}/${id}/similar`,

  // TV-specific
  season: (tvId, seasonNum) => `/tv/${tvId}/season/${seasonNum}`,

  // Search — query string is a param, not embedded in path
  searchMulti: () => `/search/multi`,            // params: { query: q }

  // Genres
  genres: (type = 'movie') => `/genre/${type}/list`,
};

// ==== FETCH HELPERS ====
export const fetchTMDB = async (path, params = {}) => {
  try {
    const { data } = await tmdb.get(path, { params });
    return { data, error: null };
  } catch (err) {
    console.error('[TMDB] error:', path, err.message);
    return { data: null, error: err.message };
  }
};

// ==== ROW PRESETS ====
// Each entry carries a `params` object for genre/network filters.
export const ROW_PRESETS = [
  { id: 'trending',   title: 'Trending Now',       path: endpoints.trending('all', 'week'),  params: {} },
  { id: 'originals',  title: 'NetHero Originals',  path: endpoints.netflixOriginals(),        params: { with_networks: 213 } },
  { id: 'top-movies', title: 'Top Rated Movies',   path: endpoints.topRated('movie'),         params: {} },
  { id: 'top-tv',     title: 'Top Rated TV Shows', path: endpoints.topRated('tv'),            params: {} },
  { id: 'action',     title: 'Action Movies',      path: endpoints.byGenre('movie'),          params: { with_genres: 28 } },
  { id: 'comedy',     title: 'Comedy Movies',      path: endpoints.byGenre('movie'),          params: { with_genres: 35 } },
  { id: 'horror',     title: 'Horror Movies',      path: endpoints.byGenre('movie'),          params: { with_genres: 27 } },
  { id: 'romance',    title: 'Romance Movies',     path: endpoints.byGenre('movie'),          params: { with_genres: 10749 } },
  { id: 'docs',       title: 'Documentaries',      path: endpoints.byGenre('movie'),          params: { with_genres: 99 } },
  { id: 'sci-fi',     title: 'Sci-Fi Adventures',  path: endpoints.byGenre('movie'),          params: { with_genres: 878 } },
];

// ==== UTILITIES ====
export const findTrailerKey = (videos) => {
  if (!videos?.results?.length) return null;
  const trailer =
    videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ||
    videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos.results.find(v => v.site === 'YouTube');
  return trailer?.key || null;
};

export const formatRuntime = (mins) => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatYear = (date) => (date ? new Date(date).getFullYear() : '');
