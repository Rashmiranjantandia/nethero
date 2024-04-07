import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isOpen: false,
  mediaType: null,   // 'movie' | 'tv'
  mediaId: null,
  data: null,

  openModal: (mediaType, mediaId) => set({ isOpen: true, mediaType, mediaId, data: null }),
  setData: (data) => set({ data }),
  closeModal: () => set({ isOpen: false, mediaType: null, mediaId: null, data: null }),
}));
