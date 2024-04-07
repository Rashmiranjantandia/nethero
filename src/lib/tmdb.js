import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = import.meta.env.VITE_TMDB_BASE_URL;
const IMG = import.meta.env.VITE_TMDB_IMG_URL;

const tmdb = axios.create({
  baseURL: BASE,
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
export const img = {
  poster:    (path, size = 'w500') => path ? `${IMG}/${size}${path}` : '/placeholder-poster.jpg',
  backdrop:  (path, size = 'original') => path ? `${IMG}/${size}${path}` : '/placeholder-backdrop.jpg',
  profile:   (path, size = 'w185') => path ? `${IMG}/${size}${path}` : '/placeholder-avatar.jpg',
  logo:      (path, size = 'w300') => path ? `${IMG}/${size}${path}` : null,
};

// ==== ENDPOINTS ====
export const endpoints = {
  // Browse rows
  trending:        (type='all', window='week') => `/trending/${type}/${window}`,
  netflixOriginals:() => `/discover/tv?with_networks=213`,
  topRated:        (type='movie') => `/${type}/top_rated`,
  popular:         (type='movie') => `/${type}/popular`,
  upcoming:        () => `/movie/upcoming`,
  nowPlaying:      () => `/movie/now_playing`,
  byGenre:         (type, genreId) => `/discover/${type}?with_genres=${genreId}`,

  // Details
  details:         (type, id) => `/${type}/${id}?append_to_response=videos,credits,similar,recommendations,images`,
  videos:          (type, id) => `/${type}/${id}/videos`,
  credits:         (type, id) => `/${type}/${id}/credits`,
  similar:         (type, id) => `/${type}/${id}/similar`,

  // TV-specific
  season:          (tvId, seasonNum) => `/tv/${tvId}/season/${seasonNum}`,

  // Search
  searchMulti:     (q) => `/search/multi?query=${encodeURIComponent(q)}`,

  // Genres
  genres:          (type='movie') => `/genre/${type}/list`,
};

// ==== FETCH HELPERS ====
export const fetchTMDB = async (path, params = {}) => {
  try {
    const { data } = await tmdb.get(path, { params });
    return { data, error: null };
  } catch (err) {
    console.error('TMDB error:', path, err.message);
    return { data: null, error: err.message };
  }
};

// ==== ROW PRESETS (ready to consume in Browse page) ====
export const ROW_PRESETS = [
  { id: 'trending',  title: 'Trending Now',           path: endpoints.trending('all','week') },
  { id: 'originals', title: 'NetHero Originals',       path: endpoints.netflixOriginals() },
  { id: 'top-movies',title: 'Top Rated Movies',        path: endpoints.topRated('movie') },
  { id: 'top-tv',    title: 'Top Rated TV Shows',      path: endpoints.topRated('tv') },
  { id: 'action',    title: 'Action Movies',           path: endpoints.byGenre('movie', 28) },
  { id: 'comedy',    title: 'Comedy Movies',           path: endpoints.byGenre('movie', 35) },
  { id: 'horror',    title: 'Horror Movies',           path: endpoints.byGenre('movie', 27) },
  { id: 'romance',   title: 'Romance Movies',          path: endpoints.byGenre('movie', 10749) },
  { id: 'docs',      title: 'Documentaries',           path: endpoints.byGenre('movie', 99) },
  { id: 'sci-fi',    title: 'Sci-Fi Adventures',       path: endpoints.byGenre('movie', 878) },
];

// ==== UTILITIES ====
export const findTrailerKey = (videos) => {
  if (!videos?.results?.length) return null;
  const trailer = videos.results.find(v =>
    v.type === 'Trailer' && v.site === 'YouTube' && v.official
  ) || videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    || videos.results.find(v => v.site === 'YouTube');
  return trailer?.key || null;
};

export const formatRuntime = (mins) => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatYear = (date) => date ? new Date(date).getFullYear() : '';
