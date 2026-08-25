import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Doesn't throw — the site should still render (with a visible warning
  // banner, see EnvWarningBanner) rather than white-screen if env vars
  // aren't set yet. createClient() itself would throw on an empty/invalid
  // URL, so we fall back to a syntactically valid placeholder — every
  // request against it will fail loudly (visible in the network tab)
  // rather than crashing the whole app before it can render.
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
      'Copy .env.example to .env.local and fill in your project values — see SETUP.md.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
);

export const PROPERTY_IMAGES_BUCKET = 'property-images';
