import { useState, type FormEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { signUp } from '@/lib/api/auth';
import { signUpSchema } from '@/lib/validation/authSchemas';

const inputClasses =
  'w-full border-b border-line bg-transparent py-3 text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-ink';

export default function SignUp() {
  const { isAuthenticated, loading } = useAuth();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!loading && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: data.get('fullName'),
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
    });

    if (!parsed.success) {
      setStatus('error');
      setErrorMessage(parsed.error.issues[0]?.message ?? 'Check your details and try again.');
      return;
    }

    setStatus('submitting');
    try {
      await signUp({ email: parsed.data.email, password: parsed.data.password, fullName: parsed.data.fullName });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Sign up failed.');
    }
  }

  if (status === 'success') {
    return (
      <section className="flex min-h-[80vh] items-center bg-paper px-6 py-20">
        <Container className="max-w-sm !px-0 text-center">
          <CheckCircle2 size={28} className="mx-auto text-moss" strokeWidth={1.5} />
          <h1 className="mt-5 font-display text-2xl text-ink">Check your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            We&rsquo;ve sent a confirmation link to finish setting up your account. Once confirmed, you can
            sign in and start saving properties.
          </p>
          <Button as="link" to="/account/sign-in" variant="outline" className="mt-8">
            Go to Sign In
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="flex min-h-[80vh] items-center bg-paper px-6 py-20">
      <Container className="max-w-sm !px-0">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-moss">Get Started</span>
        <h1 className="mt-4 font-display text-3xl text-ink">Create an Account</h1>
        <p className="mt-3 text-sm text-ink/60">Save properties and track your inquiries in one place.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <div>
            <label htmlFor="fullName" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Full Name
            </label>
            <input id="fullName" name="fullName" type="text" required autoFocus className={`${inputClasses} mt-2`} />
          </div>
          <div>
            <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Email
            </label>
            <input id="email" name="email" type="email" required className={`${inputClasses} mt-2`} />
          </div>
          <div>
            <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Password
            </label>
            <input id="password" name="password" type="password" required className={`${inputClasses} mt-2`} />
            <p className="mt-1.5 text-xs text-stone">
              At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Confirm Password
            </label>
            <input id="confirmPassword" name="confirmPassword" type="password" required className={`${inputClasses} mt-2`} />
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-3 border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-ink/80">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-brass" />
              <p>{errorMessage}</p>
            </div>
          )}

          <Button type="submit" disabled={status === 'submitting'} className="w-full justify-center">
            {status === 'submitting' ? 'Creating Account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-8 text-sm text-stone">
          Already have an account?{' '}
          <Link to="/account/sign-in" className="text-ink underline hover:text-moss">
            Sign in
          </Link>
        </p>
      </Container>
    </section>
  );
}
