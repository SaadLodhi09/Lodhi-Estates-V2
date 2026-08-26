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
    const query = supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    const timeoutPromise = new Promise<{ data: ProfileRow | null; error: any }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Profile load timed out') }), 3000)
    );
    const result = await Promise.race([query, timeoutPromise]);
    if (result.error) {
      console.warn('[auth] failed to load profile:', result.error);
      return null;
    }
    return result.data as ProfileRow | null;
  } catch (err) {
    console.warn('[auth] profile load exception:', err);
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

    // HARD SAFETY NET: no matter what happens, loading MUST become false within 3.5s
    const safetyTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn('[auth] Safety timeout — forcing loading=false');
        setLoading(false);
      }
    }, 3500);

    // Live Supabase Auth Flow
    async function init() {
      try {
        const timeoutPromise = new Promise<{ data: { session: Session | null }; error: any }>((resolve) =>
          setTimeout(() => resolve({ data: { session: null }, error: null }), 3000)
        );

        const sessionResult = await Promise.race([supabase.auth.getSession(), timeoutPromise]);

        if (!mounted) return;

        const sess = sessionResult.data.session;
        setSession(sess);
        setUser(sess?.user ?? null);

        if (sess) {
          const userProfile = await loadProfile(sess.user.id);
          if (mounted) setProfile(userProfile);
        }
      } catch (err) {
        console.warn('[auth] session init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void init();

    let listenerSub: { unsubscribe: () => void } | null = null;
    try {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
        if (!mounted) return;
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
      listenerSub = listener.subscription;
    } catch (err) {
      console.warn('[auth] Failed to set up auth listener:', err);
    }

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      listenerSub?.unsubscribe();
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
