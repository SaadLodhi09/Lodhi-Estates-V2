import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ProfileRow } from '@/types/database';
import { isUserAdmin } from '@/lib/authConfig';

const LOCAL_SESSION_KEY = 'le_local_auth_session';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfile(userId: string): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) {
      console.warn('[auth] failed to load profile', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[auth] failed to load profile exception', err);
    return null;
  }
}

function getLocalSession(): { user: User; profile: ProfileRow } | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.user) {
      return {
        user: parsed.user as User,
        profile: parsed.profile as ProfileRow,
      };
    }
  } catch {
    // Ignore JSON parse errors
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Handle local mock auth changes
    function syncLocalAuth() {
      const local = getLocalSession();
      if (local) {
        setUser(local.user);
        setProfile(local.profile);
        setSession({
          access_token: 'local-token',
          refresh_token: 'local-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: local.user,
        } as Session);
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
    }

    if (!isSupabaseConfigured) {
      syncLocalAuth();
      setLoading(false);

      const handleStorageOrCustom = () => {
        if (!mounted) return;
        syncLocalAuth();
      };

      window.addEventListener('le-auth-change', handleStorageOrCustom);
      window.addEventListener('storage', handleStorageOrCustom);

      return () => {
        mounted = false;
        window.removeEventListener('le-auth-change', handleStorageOrCustom);
        window.removeEventListener('storage', handleStorageOrCustom);
      };
    }

    // Live Supabase Auth Flow with Timeout Protection
    async function init() {
      try {
        const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
          setTimeout(() => resolve({ data: { session: null } }), 3500)
        );

        const { data } = await Promise.race([supabase.auth.getSession(), timeoutPromise]);

        if (!mounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session) {
          const userProfile = await loadProfile(data.session.user.id);
          if (mounted) setProfile(userProfile);
        }
      } catch (err) {
        console.warn('[auth] session init error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      setLoading(true);
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
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
    if (!isSupabaseConfigured) {
      const local = getLocalSession();
      if (local) setProfile(local.profile);
      return;
    }
    if (!session) return;
    setProfile(await loadProfile(session.user.id));
  }

  const currentUser = user ?? session?.user ?? null;
  const isAdmin = isUserAdmin(currentUser, profile);

  const value: AuthContextValue = {
    session,
    user: currentUser,
    profile,
    loading,
    isAuthenticated: Boolean(currentUser),
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
