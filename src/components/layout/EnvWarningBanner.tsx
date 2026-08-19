import { AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export function EnvWarningBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-3 bg-brass px-4 py-2 text-center font-mono text-[11px] uppercase tracking-widest2 text-ink">
      <AlertTriangle size={14} strokeWidth={2} />
      Supabase isn&rsquo;t configured — copy .env.example to .env.local and see SETUP.md
    </div>
  );
}
