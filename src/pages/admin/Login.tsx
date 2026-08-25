import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { signIn } from '@/lib/api/auth';
import { isAdminEmail } from '@/lib/authConfig';

const inputClasses =
  'w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink';

export default function AdminLogin() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!loading && isAuthenticated) {
    if (isAdmin) {
      const from = (location.state as { from?: Location })?.from;
      return <Navigate to={from?.pathname ?? '/admin'} replace />;
    }
    // If a regular client is logged in and visits /admin/login, send them to /account
    return <Navigate to="/account" replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');

    // Validate upfront that only the authorized admin email is allowed
    if (!isAdminEmail(email)) {
      setStatus('error');
      setErrorMessage('Access denied. Only the authorized administrator email can sign in to the admin panel.');
      return;
    }

    try {
      await signIn(email, password);
      // AuthContext's onAuthStateChange listener will pick up the session and verify admin status
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Sign in failed.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-xl text-ink">
          Lodhi Estates
        </Link>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest2 text-stone">Admin Sign In</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <div>
            <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Admin Email
            </label>
            <input id="email" name="email" type="email" required autoFocus className={`${inputClasses} mt-2`} />
          </div>
          <div>
            <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Password
            </label>
            <input id="password" name="password" type="password" required className={`${inputClasses} mt-2`} />
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-3 border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-ink/80">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-brass" />
              <p>{errorMessage}</p>
            </div>
          )}

          <Button type="submit" disabled={status === 'submitting'} className="w-full justify-center">
            {status === 'submitting' ? 'Signing In…' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-8 text-xs leading-relaxed text-stone">
          This is for the site administrator only. Buying or selling a property?{' '}
          <Link to="/account/sign-in" className="underline hover:text-ink">
            Sign in to your client account
          </Link>{' '}
          instead.
        </p>
      </div>
    </div>
  );
}

