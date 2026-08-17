import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth, signIn } from '@/hooks/useAuth';

const inputClasses =
  'w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink';

export default function AdminLogin() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!loading && isAuthenticated) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from?.pathname ?? '/admin'} replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const data = new FormData(e.currentTarget);

    try {
      await signIn(String(data.get('email')), String(data.get('password')));
      // useAuth's onAuthStateChange listener will pick up the new session
      // and the redirect above will fire on next render.
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
              Email
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
          Admin accounts are created directly in Supabase Studio — there&rsquo;s no public sign-up. See
          SETUP.md if you need to create or reset one.
        </p>
      </div>
    </div>
  );
}
