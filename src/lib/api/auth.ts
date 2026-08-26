import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isAdminEmail } from '@/lib/authConfig';
import type { ProfileRow } from '@/types/database';

const LOCAL_SESSION_KEY = 'le_local_auth_session';

export async function signIn(email: string, password: string): Promise<void> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!isSupabaseConfigured) {
    const isAdmin = isAdminEmail(trimmedEmail);
    const mockUser = {
      id: `local-user-${Date.now()}`,
      email: trimmedEmail,
      app_metadata: {},
      user_metadata: { full_name: trimmedEmail.split('@')[0] },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const mockProfile: ProfileRow = {
      id: mockUser.id,
      email: trimmedEmail,
      full_name: trimmedEmail.split('@')[0],
      role: isAdmin ? 'admin' : 'client',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(
      LOCAL_SESSION_KEY,
      JSON.stringify({ user: mockUser, profile: mockProfile })
    );
    window.dispatchEvent(new Event('le-auth-change'));
    return;
  }

  // Live Supabase Sign In with timeout
  const timeoutPromise = new Promise<{ error: Error }>((_, reject) =>
    setTimeout(() => reject(new Error('Connection timed out. Check your network or Supabase settings.')), 8000)
  );

  const authPromise = supabase.auth.signInWithPassword({ email: trimmedEmail, password });
  const result = (await Promise.race([authPromise, timeoutPromise])) as { error: Error | null };

  if (result.error) throw result.error;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

export async function signUp({ email, password, fullName }: SignUpParams): Promise<void> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!isSupabaseConfigured) {
    const isAdmin = isAdminEmail(trimmedEmail);
    const mockUser = {
      id: `local-user-${Date.now()}`,
      email: trimmedEmail,
      app_metadata: {},
      user_metadata: { full_name: fullName },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const mockProfile: ProfileRow = {
      id: mockUser.id,
      email: trimmedEmail,
      full_name: fullName,
      role: isAdmin ? 'admin' : 'client',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(
      LOCAL_SESSION_KEY,
      JSON.stringify({ user: mockUser, profile: mockProfile })
    );
    window.dispatchEvent(new Event('le-auth-change'));
    return;
  }

  const { error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  window.dispatchEvent(new Event('le-auth-change'));

  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[auth] signOut error', err);
    }
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/account/reset-password`,
  });
  if (error) throw error;
}
