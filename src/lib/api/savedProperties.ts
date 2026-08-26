import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Property } from '@/types/property';
import type { PropertyRow } from '@/types/database';

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

export async function fetchSavedProperties(userId: string): Promise<Property[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('saved_properties')
      .select('created_at, properties (*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[savedProperties] fetch error:', error.message);
      return [];
    }

    return (data ?? [])
      .map((row) => row.properties as unknown as PropertyRow | null)
      .filter((row): row is PropertyRow => row !== null)
      .map(mapPropertyRow);
  } catch (err) {
    console.warn('[savedProperties] fetch exception:', err);
    return [];
  }
}

export async function fetchSavedPropertyIds(userId: string): Promise<Set<string>> {
  if (!isSupabaseConfigured) return new Set();

  try {
    const { data, error } = await supabase
      .from('saved_properties')
      .select('property_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('[savedProperties] fetchIds error:', error.message);
      return new Set();
    }
    return new Set((data ?? []).map((row) => row.property_id));
  } catch (err) {
    console.warn('[savedProperties] fetchIds exception:', err);
    return new Set();
  }
}

export async function saveProperty(userId: string, propertyId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_properties')
    .insert({ user_id: userId, property_id: propertyId });
  if (error) throw error;
}

export async function unsaveProperty(userId: string, propertyId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_properties')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId);
  if (error) throw error;
}
