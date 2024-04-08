import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, session, loading, init } = useAuthStore();
  useEffect(() => { init(); }, []);
  return { user, session, loading, isAuthed: !!user };
};
