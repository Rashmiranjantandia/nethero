import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';

export const useMyList = () => {
  const profile = useProfileStore((s) => s.activeProfile);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    const { data } = await supabase
      .from('my_list').select('*')
      .eq('profile_id', profile.id)
      .order('added_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => { fetch(); }, [fetch]);

  const isInList = useCallback((tmdbId, mediaType) =>
    items.some(i => i.tmdb_id === tmdbId && i.media_type === mediaType),
    [items]
  );

  const addToList = async (item) => {
    if (!profile) return;
    const payload = {
      profile_id: profile.id,
      tmdb_id: item.id,
      media_type: item.media_type || (item.title ? 'movie' : 'tv'),
      title: item.title || item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
    };
    const { data, error } = await supabase.from('my_list').insert([payload]).select().single();
    if (!error) setItems(prev => [data, ...prev]);
  };

  const removeFromList = async (tmdbId, mediaType) => {
    if (!profile) return;
    await supabase.from('my_list').delete()
      .eq('profile_id', profile.id)
      .eq('tmdb_id', tmdbId).eq('media_type', mediaType);
    setItems(prev => prev.filter(i => !(i.tmdb_id === tmdbId && i.media_type === mediaType)));
  };

  return { items, loading, isInList, addToList, removeFromList, refetch: fetch };
};
