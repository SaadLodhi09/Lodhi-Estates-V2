import { supabase } from '@/lib/supabase';

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

export async function signUp({ email, password, fullName }: SignUpParams) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
  // A `profiles` row is created automatically by the handle_new_user()
  // trigger (see supabase/migrations/0002_users_and_security.sql) —
  // nothing else to do here. If email confirmation is enabled on the
  // Supabase project, there won't be a session yet until they confirm.
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/account/reset-password`,
  });
  if (error) throw error;
}
