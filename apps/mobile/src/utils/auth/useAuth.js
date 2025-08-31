import { useCallback, useEffect } from 'react';
import { useAuthStore } from './store';
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase';
import { useRouter } from 'expo-router';

/**
 * This hook provides authentication functionality.
 * It may be easier to use the `useRequireAuth` hook
 * instead as that will handle navigation to the auth flow
 * automatically.
 */
export const useAuth = () => {
  const { isReady, auth, setAuth } = useAuthStore();
  const router = useRouter();

  const initiate = useCallback(() => {
    // Fetch existing session (if any) from Supabase (persisted in AsyncStorage)
    const init = async () => {
      // If Supabase isn't configured, mark auth as ready with no user
      if (!SUPABASE_ENABLED) {
        useAuthStore.setState({ auth: null, isReady: true });
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      useAuthStore.setState({
        auth: session?.user ?? null,
        isReady: true,
      });
    };
    init();
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initiate();
  }, [initiate]);

  // Subscribe to auth state changes so UI stays in sync
  useEffect(() => {
    if (!SUPABASE_ENABLED) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.setState({ auth: session?.user ?? null });
    });
    return () => subscription?.unsubscribe();
  }, []);

  const signIn = useCallback(() => {
    router.push('/login');
  }, [router]);
  const signUp = useCallback(() => {
    router.push('/login');
  }, [router]);

  const signOut = useCallback(() => {
    supabase.auth.signOut().finally(() => {
      setAuth(null);
    });
  }, []);

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    signIn,
    signOut,
    signUp,
    auth,
    setAuth,
    initiate,
  };
};

/**
 * This hook will automatically open the authentication modal if the user is not authenticated.
 */
export const useRequireAuth = (options) => {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && isReady) {
      router.push('/login');
    }
  }, [isAuthenticated, isReady, router]);
};

export default useAuth;
