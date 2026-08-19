import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function RequireUser({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Loading…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account/sign-in" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
