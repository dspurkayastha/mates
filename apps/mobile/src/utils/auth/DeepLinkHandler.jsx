import { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase';
import { useAuthStore } from './store';

/**
 * Deep Link Handler for Supabase Magic Link Authentication
 * 
 * This component listens for incoming deep links from Supabase magic link emails
 * and handles the authentication flow automatically.
 */
export const DeepLinkHandler = () => {
  const router = useRouter();

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;

    // Handle the initial URL if the app was opened via a deep link
    const handleInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await handleDeepLink(initialUrl);
        }
      } catch (error) {
        console.error('Error handling initial URL:', error);
      }
    };

    // Listen for incoming deep links while the app is running
    const handleIncomingURL = (event) => {
      handleDeepLink(event.url);
    };

    // Set up the URL listener
    const subscription = Linking.addEventListener('url', handleIncomingURL);

    // Handle initial URL
    handleInitialURL();

    // Cleanup subscription
    return () => {
      subscription?.remove();
    };
  }, []);

  /**
   * Process incoming deep link URLs
   * @param {string} url - The deep link URL to process
   */
  const handleDeepLink = async (url) => {
    try {
      console.log('Processing deep link:', url);

      // Parse the URL to extract parameters
      const parsedUrl = Linking.parse(url);
      const { queryParams, path } = parsedUrl;

      // Check if this is an authentication callback
      // Handle both custom scheme (mates://) and Expo Go (exp://) URLs
      const isAuthCallback = 
        path?.includes('auth/callback') || 
        queryParams?.access_token || 
        queryParams?.refresh_token ||
        url.includes('#access_token=') || 
        url.includes('&access_token=');

      if (isAuthCallback) {
        console.log('Auth callback detected');

        // Extract auth parameters from URL fragments or query params
        let accessToken, refreshToken, tokenType, expiresIn, errorParam, errorDescription;

        // Check URL fragments first (Supabase often uses fragments)
        if (url.includes('#')) {
          const fragment = url.split('#')[1];
          const fragmentParams = new URLSearchParams(fragment);
          
          accessToken = fragmentParams.get('access_token');
          refreshToken = fragmentParams.get('refresh_token');
          tokenType = fragmentParams.get('token_type');
          expiresIn = fragmentParams.get('expires_in');
          errorParam = fragmentParams.get('error');
          errorDescription = fragmentParams.get('error_description');
        }
        
        // Fallback to query parameters
        if (!accessToken && queryParams) {
          accessToken = queryParams.access_token;
          refreshToken = queryParams.refresh_token;
          tokenType = queryParams.token_type;
          expiresIn = queryParams.expires_in;
          errorParam = queryParams.error;
          errorDescription = queryParams.error_description;
        }

        // Handle authentication errors
        if (errorParam) {
          console.error('Supabase auth error:', errorDescription || errorParam);
          
          Alert.alert(
            'Authentication Error',
            errorDescription || 'Authentication failed',
            [
              {
                text: 'OK',
                onPress: () => {
                  router.replace('/(onboarding)/welcome');
                },
              },
            ]
          );
          return;
        }

        // Handle successful authentication
        if (accessToken && refreshToken) {
          console.log('Auth tokens found, setting session...');
          
          try {
            // Set the session using the tokens from the URL
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('Error setting Supabase session:', error);
              Alert.alert(
                'Authentication Error',
                'Failed to sign in with the magic link. Please try again.'
              );
              return;
            }

            if (data?.session?.user) {
              console.log('Successfully authenticated user:', data.session.user.email);
              
              // Update auth state
              useAuthStore.setState({ 
                auth: data.session.user,
                isReady: true 
              });

              // Show success message
              Alert.alert(
                'Welcome!',
                `Successfully signed in as ${data.session.user.email}`,
                [
                  {
                    text: 'Continue',
                    onPress: () => {
                      // Navigate to the main app
                      router.replace('/(tabs)');
                    },
                  },
                ]
              );
            }
          } catch (sessionError) {
            console.error('Session error:', sessionError);
            Alert.alert(
              'Authentication Error',
              'There was a problem signing you in. Please try again.'
            );
          }
        } else {
          console.log('No auth tokens found in URL');
        }
      } else {
        // Handle other deep links (if any)
        console.log('Non-auth deep link:', url);
      }
    } catch (error) {
      console.error('Error processing deep link:', error);
      Alert.alert(
        'Link Error',
        'There was a problem processing this link. Please try again.'
      );
    }
  };

  // This component doesn't render anything
  return null;
};

export default DeepLinkHandler;