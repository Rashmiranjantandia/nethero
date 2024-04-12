import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, session, loading, init } = useAuthStore();
  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    init();
  }, [init]);
  return { user, session, loading, isAuthed: !!user };
};
