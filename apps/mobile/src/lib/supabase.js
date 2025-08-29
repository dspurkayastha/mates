import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Determine if credentials are present
export const SUPABASE_ENABLED = !!(supabaseUrl && supabaseAnonKey);

if (!SUPABASE_ENABLED) {
  console.warn(
    '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Running in \"offline\" mode – cloud sync and auth are disabled.'
  );
}

// Build either a real client or a minimal mock so the rest of the app can import `supabase` safely.
export const supabase = SUPABASE_ENABLED
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : {
      // Only the subset of API the app currently calls.
      auth: {
        // Matches shape:  { data: { session } }
        async getSession() {
          return { data: { session: null } };
        },
        onAuthStateChange() {
          // Return object with unsubscribe() to mirror Supabase behaviour
          return {
            subscription: {
              unsubscribe() {},
            },
          };
        },
        async signOut() {
          /* no-op when disabled */
        },
        async signInWithOtp() {
          return { error: new Error('Supabase disabled – no credentials') };
        },
      },
    };

export default supabase;
