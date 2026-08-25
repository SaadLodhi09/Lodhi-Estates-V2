import { supabase } from '@/lib/supabase';
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

/** Returns the current user's saved properties, most recently saved first. */
export async function fetchSavedProperties(userId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('saved_properties')
    .select('created_at, properties (*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row) => row.properties as unknown as PropertyRow | null)
    .filter((row): row is PropertyRow => row !== null)
    .map(mapPropertyRow);
}

/** Just the set of property IDs the user has saved — cheap check for "is this saved?" UI. */
export async function fetchSavedPropertyIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase.from('saved_properties').select('property_id').eq('user_id', userId);

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.property_id));
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
