import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

function isValidSupabaseUrl(url?: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (
    lower.includes('placeholder') ||
    lower.includes('your-project-ref') ||
    lower.includes('your_project_ref')
  ) {
    return false;
  }
  return lower.startsWith('https://') || lower.startsWith('http://');
}

function isValidSupabaseKey(key?: string): boolean {
  if (!key) return false;
  const lower = key.toLowerCase();
  if (
    lower.includes('placeholder') ||
    lower.includes('your-anon') ||
    lower.includes('your_anon')
  ) {
    return false;
  }
  return key.length > 20;
}

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(rawUrl) && isValidSupabaseKey(rawKey)
);

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] Live Supabase is not configured or placeholder keys detected. Operating in local demo mode with fallback data.'
  );
}

export const supabase = createClient<Database>(
  isSupabaseConfigured ? rawUrl! : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? rawKey! : 'placeholder-anon-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
    },
  }
);

export const PROPERTY_IMAGES_BUCKET = 'property-images';
