import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, wire this to an error-tracking service (Sentry, etc.)
    // instead of just the console.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
          <h1 className="font-display text-2xl text-ink">Something went wrong.</h1>
          <p className="max-w-sm text-sm text-ink/60">
            The page hit an unexpected error. Reloading usually fixes it — if it keeps happening,
            check the browser console for details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 border border-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
