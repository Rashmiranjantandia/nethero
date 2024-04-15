import { useState, useEffect, useRef } from 'react';
import { fetchTMDB } from '../lib/tmdb';

/**
 * Fetches a TMDB endpoint.
 * @param {string|null} path   - API path (no query strings embedded)
 * @param {object}      params - Extra query params (e.g. { with_genres: 28 })
 * @param {Array}       deps   - Additional dependency array items
 */
export const useFetch = (path, params = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelled = useRef(false);

  // Stable string key so the effect only reruns when path/params actually change
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    cancelled.current = false;
    if (!path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchTMDB(path, params).then(({ data, error }) => {
      if (cancelled.current) return;
      setData(data);
      setError(error);
      setLoading(false);
    });
    return () => {
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, paramsKey, ...deps]);

  return { data, loading, error };
};
