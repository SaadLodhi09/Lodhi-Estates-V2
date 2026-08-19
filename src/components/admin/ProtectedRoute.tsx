import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Gates admin-only pages. Two distinct failure cases, handled differently:
 *  - not logged in at all -> send to the admin login screen
 *  - logged in, but not an admin (i.e. a regular client account) -> send
 *    home, not to the login screen (they don't need to "log in again",
 *    they simply don't have access)
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Loading…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
