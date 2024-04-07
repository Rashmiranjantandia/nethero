import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfile: null,

      fetchProfiles: async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });
        if (!error) set({ profiles: data });
        return { data, error };
      },

      createProfile: async (userId, payload) => {
        const { data, error } = await supabase
          .from('profiles')
          .insert([{ user_id: userId, ...payload }])
          .select()
          .single();
        if (!error) set({ profiles: [...get().profiles, data] });
        return { data, error };
      },

      updateProfile: async (id, payload) => {
        const { data, error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', id)
          .select()
          .single();
        if (!error) {
          set({
            profiles: get().profiles.map(p => p.id === id ? data : p),
            activeProfile: get().activeProfile?.id === id ? data : get().activeProfile,
          });
        }
        return { data, error };
      },

      deleteProfile: async (id) => {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (!error) {
          set({ profiles: get().profiles.filter(p => p.id !== id) });
        }
        return { error };
      },

      setActiveProfile: (profile) => set({ activeProfile: profile }),
      clearProfiles: () => set({ profiles: [], activeProfile: null }),
    }),
    {
      name: 'nethero-profile',
      partialize: (state) => ({ activeProfile: state.activeProfile }),
    }
  )
);
