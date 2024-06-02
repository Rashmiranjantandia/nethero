import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';
import { useMyListStore } from '../store/useMyListStore';

/**
 * useMyList — Supabase-backed My List hook.
 *
 * All state lives in useMyListStore (Zustand) so every component that calls
 * this hook — MyList.jsx, MovieCardHover, Browse.jsx, DetailModal — shares
 * one items array.
 *
 * KEY FIX (re-render/skeleton flash):
 *   The fetch is guarded by loadedProfileId. If the store already holds data
 *   for the current profile, subsequent mounts of MovieCardHover (on hover)
 *   do NOT re-trigger the fetch and therefore do NOT set loading=true.
 *   This eliminates the skeleton flash observed when hovering cards.
 */
export const useMyList = () => {
  const profile = useProfileStore((s) => s.activeProfile);

  // Read from shared Zustand store — all consumers see the same values
  const items           = useMyListStore((s) => s.items);
  const loading         = useMyListStore((s) => s.loading);
  const loadedProfileId = useMyListStore((s) => s.loadedProfileId);
  const setItems        = useMyListStore((s) => s.setItems);
  const setLoading      = useMyListStore((s) => s.setLoading);
  const addItem         = useMyListStore((s) => s.addItem);
  const removeItem      = useMyListStore((s) => s.removeItem);
  const clearForProfile = useMyListStore((s) => s.clearForProfile);

  // ── Fetch — ONLY runs when profile changes and data isn't yet loaded ──────
  const fetchAll = useCallback(async () => {
    if (!profile?.id) {
      setItems([], null);
      return;
    }

    // Guard: if data is already loaded for this profile, skip entirely.
    // This prevents MovieCardHover mounting on hover from re-triggering
    // the fetch and flashing loading=true into MyList.jsx.
    const alreadyLoaded = useMyListStore.getState().loadedProfileId === profile.id;
    // getState() reads synchronously — avoids a stale closure from the useCallback dep array
    if (alreadyLoaded) return;

    setLoading(true);
    const { data } = await supabase
      .from('my_list')
      .select('*')
      .eq('profile_id', profile.id)
      .order('added_at', { ascending: false });

    // Pass profileId so the store records which profile was loaded
    setItems(data || [], profile.id);
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // When profile switches, clear stale list before re-fetching to prevent cross-profile data bleed
    const currentLoaded = useMyListStore.getState().loadedProfileId;
    if (profile?.id && currentLoaded !== profile.id) {
      clearForProfile();
    }
    fetchAll();
  }, [fetchAll]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── isInList ─────────────────────────────────────────────────────────────
  const isInList = useCallback(
    (tmdbId, mediaType) =>
      items.some((i) => i.tmdb_id === tmdbId && i.media_type === mediaType),
    [items]
  );

  // ── addToList — optimistic then persist ──────────────────────────────────
  const addToList = async (item) => {
    if (!profile?.id) return;

    const payload = {
      profile_id:    profile.id,
      tmdb_id:       item.id,
      media_type:    item.media_type || (item.title ? 'movie' : 'tv'),
      title:         item.title || item.name,
      poster_path:   item.poster_path,
      backdrop_path: item.backdrop_path,
    };

    // Optimistic update — immediately visible in all consumers
    const optimistic = {
      ...payload,
      id:       `tmp-${Date.now()}`,
      added_at: new Date().toISOString(),
    };
    addItem(optimistic);

    // Persist and replace optimistic record with real DB row
    const { data, error } = await supabase
      .from('my_list')
      .insert([payload])
      .select()
      .single();

    if (!error && data) {
      setItems(
        useMyListStore.getState().items.map((i) =>
          i.id === optimistic.id ? data : i
        ),
        profile.id
      );
    } else if (error) {
      // Roll back on error
      removeItem(payload.tmdb_id, payload.media_type);
    }
  };

  // ── removeFromList — optimistic then persist ──────────────────────────────
  const removeFromList = async (tmdbId, mediaType) => {
    if (!profile?.id) return;

    // Optimistic removal — instantly visible in ALL hook consumers
    removeItem(tmdbId, mediaType);

    // Persist to Supabase (fire and forget)
    await supabase
      .from('my_list')
      .delete()
      .eq('profile_id', profile.id)
      .eq('tmdb_id', tmdbId)
      .eq('media_type', mediaType);
  };

  return { items, loading, isInList, addToList, removeFromList, refetch: fetchAll };
};
