import { useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';

export const useScroll = (threshold = 80) => {
  const setScrolled = useUIStore((s) => s.setNavScrolled);
  useEffect(() => {
    let raf = null;
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        raf = null;
      });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
};
