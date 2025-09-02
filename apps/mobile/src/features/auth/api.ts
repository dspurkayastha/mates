import { supabase, SUPABASE_ENABLED } from '@/lib/supabase';

export async function signInWithPassword(email: string, password: string) {
  if (!SUPABASE_ENABLED) return;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  if (!SUPABASE_ENABLED) return;
  await supabase.auth.signOut();
}
