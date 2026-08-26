import { supabase, PROPERTY_IMAGES_BUCKET, isSupabaseConfigured } from '@/lib/supabase';
import type { Property } from '@/types/property';
import type { PropertyRow, PropertyInsert, PropertyUpdate } from '@/types/database';
import { properties, getFeaturedProperties, getPropertyById } from '@/data/properties';

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
  if (!isSupabaseConfigured) {
    return properties;
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[properties] Supabase fetch error, using fallback:', error.message);
      return properties;
    }
    if (!data || data.length === 0) {
      return properties;
    }
    return data.map(mapRow);
  } catch (err) {
    console.warn('[properties] Supabase fetch error, using fallback:', err);
    return properties;
  }
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    return getFeaturedProperties();
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[properties] Supabase fetchFeatured error, using fallback:', error.message);
      return getFeaturedProperties();
    }
    if (!data || data.length === 0) {
      return getFeaturedProperties();
    }
    return data.map(mapRow);
  } catch (err) {
    console.warn('[properties] Supabase fetchFeatured error, using fallback:', err);
    return getFeaturedProperties();
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    return getPropertyById(id) ?? null;
  }

  try {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).maybeSingle();

    if (error) {
      console.warn('[properties] Supabase fetchPropertyById error, using fallback:', error.message);
      return getPropertyById(id) ?? null;
    }
    if (data) {
      return mapRow(data);
    }
    return getPropertyById(id) ?? null;
  } catch (err) {
    console.warn('[properties] Supabase fetchPropertyById error, using fallback:', err);
    return getPropertyById(id) ?? null;
  }
}

/** Form-facing shape for creating/editing a listing from the admin dashboard. */
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

/** Uploads an image to the public property-images bucket and returns its public URL. */
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
