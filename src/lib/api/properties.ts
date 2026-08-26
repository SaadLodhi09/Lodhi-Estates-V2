import { supabase, PROPERTY_IMAGES_BUCKET, isSupabaseConfigured } from '@/lib/supabase';
import type { Property } from '@/types/property';
import type { PropertyRow, PropertyInsert, PropertyUpdate } from '@/types/database';
import { properties as fallbackProperties, getFeaturedProperties, getPropertyById } from '@/data/properties';

function mapRow(row: PropertyRow): Property {
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

export async function fetchProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) return fallbackProperties;

  try {
    const query = supabase.from('properties').select('*').order('created_at', { ascending: false });
    const timeoutPromise = new Promise<{ data: PropertyRow[] | null; error: any }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Properties query timed out') }), 3500)
    );
    const result = await Promise.race([query, timeoutPromise]);

    if (result.error || !result.data || result.data.length === 0) {
      if (result.error) console.warn('[properties] fetch error:', result.error);
      return fallbackProperties;
    }
    return result.data.map(mapRow);
  } catch (err) {
    console.warn('[properties] fetch exception:', err);
    return fallbackProperties;
  }
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) return getFeaturedProperties();

  try {
    const query = supabase.from('properties').select('*').eq('featured', true).order('created_at', { ascending: false });
    const timeoutPromise = new Promise<{ data: PropertyRow[] | null; error: any }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Featured properties query timed out') }), 3500)
    );
    const result = await Promise.race([query, timeoutPromise]);

    if (result.error || !result.data || result.data.length === 0) {
      if (result.error) console.warn('[properties] fetchFeatured error:', result.error);
      return getFeaturedProperties();
    }
    return result.data.map(mapRow);
  } catch (err) {
    console.warn('[properties] fetchFeatured exception:', err);
    return getFeaturedProperties();
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured) return getPropertyById(id) ?? null;

  try {
    const query = supabase.from('properties').select('*').eq('id', id).maybeSingle();
    const timeoutPromise = new Promise<{ data: PropertyRow | null; error: any }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Property detail query timed out') }), 3500)
    );
    const result = await Promise.race([query, timeoutPromise]);

    if (result.error) {
      console.warn('[properties] fetchById error:', result.error);
      return getPropertyById(id) ?? null;
    }
    return result.data ? mapRow(result.data as PropertyRow) : (getPropertyById(id) ?? null);
  } catch (err) {
    console.warn('[properties] fetchById exception:', err);
    return getPropertyById(id) ?? null;
  }
}

export interface PropertyFormInput {
  refCode: string;
  name: string;
  location: string;
  coordinates: string;
  type: Property['type'];
  status: Property['status'];
  price: number;
  areaSqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  architect: string;
  description: string;
  imageUrl: string;
  galleryUrls: string[];
  featured: boolean;
}

function toInsertRow(input: PropertyFormInput): PropertyInsert {
  return {
    ref_code: input.refCode,
    name: input.name,
    location: input.location,
    coordinates: input.coordinates || null,
    type: input.type,
    status: input.status,
    price: input.price,
    area_sqft: input.areaSqft,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    year_built: input.yearBuilt || null,
    architect: input.architect || null,
    description: input.description || null,
    image_url: input.imageUrl || null,
    gallery_urls: input.galleryUrls,
    featured: input.featured,
  };
}

export async function createProperty(input: PropertyFormInput): Promise<Property> {
  const { data, error } = await supabase.from('properties').insert(toInsertRow(input)).select().single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateProperty(id: string, input: PropertyFormInput): Promise<Property> {
  const update: PropertyUpdate = toInsertRow(input);
  const { data, error } = await supabase.from('properties').update(update).eq('id', id).select().single();
  if (error) throw error;
  return mapRow(data);
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadPropertyImage(file: File): Promise<string> {
  const extension = file.name.split('.').pop() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(PROPERTY_IMAGES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
