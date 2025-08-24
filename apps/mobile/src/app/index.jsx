import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from '@/utils/auth/useAuth';

/**
 * Root index route – decides whether to show onboarding or the main app.
 * While deciding we render nothing, then perform a `router.replace()`
 * once the auth store reports it is ready.
 */
export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(onboarding)/welcome');
    }
  }, [isAuthenticated, isReady, router]);

  // Render nothing while redirecting.
  return null;
}