import React, { useEffect } from 'react';
import { useAuth } from '../utils/auth/useAuth';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthModal } from '../utils/auth/useAuthModal';
import { DeepLinkHandler } from '../utils/auth/DeepLinkHandler';
import { ThemeProvider } from '../components/ui';
import { View, Text } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Root layout error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Something went wrong</Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>
            {this.state.error?.message || 'Unknown error occurred'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  const { initiate, isReady } = useAuth();

  console.log('RootLayout render:', { isReady });

  useEffect(() => {
    console.log('RootLayout: calling initiate');
    initiate();
  }, [initiate]);

  useEffect(() => {
    console.log('RootLayout: isReady changed to:', isReady);
    if (isReady) {
      console.log('RootLayout: hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  console.log('RootLayout: about to render, isReady:', isReady);

  if (!isReady) {
    console.log('RootLayout: returning null (not ready)');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('RootLayout: rendering main app');

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Deep Link Handler for Supabase Magic Links */}
            <DeepLinkHandler />
            {/* Global auth modal – can be triggered from anywhere via useAuthModal */}
            <AuthModal />
            <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
              <Stack.Screen name="index" />
            </Stack>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
