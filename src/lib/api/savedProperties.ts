import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Property } from '@/types/property';
import type { PropertyRow } from '@/types/database';
import { properties } from '@/data/properties';

const LOCAL_SAVED_KEY = 'le_local_saved_properties';

function getLocalSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalSavedIds(ids: string[]) {
  localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event('le-saved-change'));
}

function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    refCode: row.ref_code,
    name: row.name,
    location: row.location,
    coordinates: row.coordinates ?? '',
    type: row.type,
    status: row.status,
    price: Number(row.price),
    currency: 'PKR',
    areaSqft: row.area_sqft,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    yearBuilt: row.year_built ?? 0,
    architect: row.architect ?? '',
    description: row.description ?? '',
    image: row.image_url ?? '',
    gallery: row.gallery_urls ?? [],
    featured: row.featured,
  };
}

/** Returns the current user's saved properties, most recently saved first. */
export async function fetchSavedProperties(userId: string): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    const ids = getLocalSavedIds();
    return properties.filter((p) => ids.includes(p.id));
  }

  try {
    const { data, error } = await supabase
      .from('saved_properties')
      .select('created_at, properties (*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[savedProperties] Supabase error, using local fallback:', error.message);
      const ids = getLocalSavedIds();
      return properties.filter((p) => ids.includes(p.id));
    }

    return (data ?? [])
      .map((row) => row.properties as unknown as PropertyRow | null)
      .filter((row): row is PropertyRow => row !== null)
      .map(mapPropertyRow);
  } catch (err) {
    console.warn('[savedProperties] Fetch exception:', err);
    const ids = getLocalSavedIds();
    return properties.filter((p) => ids.includes(p.id));
  }
}

/** Just the set of property IDs the user has saved — cheap check for "is this saved?" UI. */
export async function fetchSavedPropertyIds(userId: string): Promise<Set<string>> {
  if (!isSupabaseConfigured) {
    return new Set(getLocalSavedIds());
  }

  try {
    const { data, error } = await supabase.from('saved_properties').select('property_id').eq('user_id', userId);
    if (error) {
      return new Set(getLocalSavedIds());
    }
    return new Set((data ?? []).map((row) => row.property_id));
  } catch {
    return new Set(getLocalSavedIds());
  }
}

export async function saveProperty(userId: string, propertyId: string): Promise<void> {
  const current = getLocalSavedIds();
  if (!current.includes(propertyId)) {
    setLocalSavedIds([...current, propertyId]);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('saved_properties').insert({ user_id: userId, property_id: propertyId });
    } catch (err) {
      console.warn('[savedProperties] Insert error:', err);
    }
  }
}

export async function unsaveProperty(userId: string, propertyId: string): Promise<void> {
  const current = getLocalSavedIds();
  setLocalSavedIds(current.filter((id) => id !== propertyId));

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);
    } catch (err) {
      console.warn('[savedProperties] Delete error:', err);
    }
  }
}
