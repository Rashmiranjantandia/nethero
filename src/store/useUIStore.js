import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isNavScrolled: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  toast: null,

  setNavScrolled: (v) => set({ isNavScrolled: v }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  showToast: (toast) => set({ toast }),
  hideToast: () => set({ toast: null }),
}));
