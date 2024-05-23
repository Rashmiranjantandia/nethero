/**
 * useMyListStore — Zustand store for My List items.
 *
 * All consumers of useMyList share this single source of truth.
 * loadedProfileId tracks which profile was last fetched so that
 * MovieCardHover mounting on hover does NOT re-trigger a fetch
 * (and therefore does NOT flash loading=true into MyList.jsx).
 */
import { create } from 'zustand';

export const useMyListStore = create((set) => ({
  items:           [],
  loading:         true,
  loadedProfileId: null,   // ← tracks which profile's data is currently in `items`

  setItems: (items, profileId) =>
    set({ items, loading: false, loadedProfileId: profileId ?? null }),

  setLoading: (loading) => set({ loading }),

  /** Optimistic add — prepend item to list without waiting for DB */
  addItem: (item) =>
    set((s) => ({ items: [item, ...s.items] })),

  /** Optimistic remove — filter by tmdb_id + media_type instantly */
  removeItem: (tmdbId, mediaType) =>
    set((s) => ({
      items: s.items.filter(
        (i) => !(i.tmdb_id === tmdbId && i.media_type === mediaType)
      ),
    })),

  /** Called when profile changes — clears stale data */
  clearForProfile: () =>
    set({ items: [], loading: true, loadedProfileId: null }),
}));
