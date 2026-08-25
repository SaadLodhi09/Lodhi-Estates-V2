import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ProfileRow } from '@/types/database';
import { isUserAdmin } from '@/lib/authConfig';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** Re-fetches the profile row — call after a client updates their name, etc. */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) {
    console.error('[auth] failed to load profile', error);
    return null;
  }
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        if (data.session) {
          const userProfile = await loadProfile(data.session.user.id);
          if (mounted) setProfile(userProfile);
        }
      } catch (err) {
        console.error('[auth] session init error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      setLoading(true);
      setSession(nextSession);
      if (nextSession) {
        const userProfile = await loadProfile(nextSession.user.id);
        if (mounted) setProfile(userProfile);
      } else {
        setProfile(null);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function refreshProfile() {
    if (!session) return;
    setProfile(await loadProfile(session.user.id));
  }

  const currentUser = session?.user ?? null;
  const isAdmin = isUserAdmin(currentUser, profile);

  const value: AuthContextValue = {
    session,
    user: currentUser,
    profile,
    loading,
    isAuthenticated: Boolean(session),
    isAdmin,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

