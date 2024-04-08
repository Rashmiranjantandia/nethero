import { useState, useEffect, useRef } from 'react';
import { fetchTMDB } from '../lib/tmdb';

export const useFetch = (path, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    if (!path) { setLoading(false); return; }
    setLoading(true);
    fetchTMDB(path).then(({ data, error }) => {
      if (cancelled.current) return;
      setData(data);
      setError(error);
      setLoading(false);
    });
    return () => { cancelled.current = true; };
  }, deps);

  return { data, loading, error };
};
