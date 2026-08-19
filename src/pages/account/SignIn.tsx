import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { signIn } from '@/lib/api/auth';
import { signInSchema } from '@/lib/validation/authSchemas';

const inputClasses =
  'w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink';

export default function SignIn() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!loading && isAuthenticated) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from?.pathname ?? '/account'} replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: data.get('email'),
      password: data.get('password'),
    });

    if (!parsed.success) {
      setStatus('error');
      setErrorMessage(parsed.error.issues[0]?.message ?? 'Check your details and try again.');
      return;
    }

    setStatus('submitting');
    try {
      await signIn(parsed.data.email, parsed.data.password);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Sign in failed.');
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center bg-paper px-6 py-20">
      <Container className="max-w-sm !px-0">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-moss">Welcome Back</span>
        <h1 className="mt-4 font-display text-3xl text-ink">Sign In</h1>

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

        <p className="mt-8 text-sm text-stone">
          New here?{' '}
          <Link to="/account/sign-up" className="text-ink underline hover:text-moss">
            Create an account
          </Link>
        </p>
      </Container>
    </section>
  );
}
