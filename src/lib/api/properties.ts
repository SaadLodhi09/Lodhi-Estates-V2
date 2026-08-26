import { supabase, PROPERTY_IMAGES_BUCKET, isSupabaseConfigured } from '@/lib/supabase';
import type { Property } from '@/types/property';
import type { PropertyRow, PropertyInsert, PropertyUpdate } from '@/types/database';
import { properties, getFeaturedProperties, getPropertyById } from '@/data/properties';

const LOCAL_PROPERTIES_KEY = 'le_local_properties_data';

function getLocalProperties(): Property[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROPERTIES_KEY);
    if (!raw) return properties;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : properties;
  } catch {
    return properties;
  }
}

function setLocalProperties(data: Property[]) {
  localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(data));
}

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
    return getLocalProperties();
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[properties] Supabase fetch error, using fallback:', error.message);
      return getLocalProperties();
    }
    if (!data || data.length === 0) {
      return getLocalProperties();
    }
    return data.map(mapRow);
  } catch (err) {
    console.warn('[properties] Supabase fetch error, using fallback:', err);
    return getLocalProperties();
  }
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    return getLocalProperties().filter((p) => p.featured);
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[properties] Supabase fetchFeatured error, using fallback:', error.message);
      return getLocalProperties().filter((p) => p.featured);
    }
    if (!data || data.length === 0) {
      return getLocalProperties().filter((p) => p.featured);
    }
    return data.map(mapRow);
  } catch (err) {
    console.warn('[properties] Supabase fetchFeatured error, using fallback:', err);
    return getLocalProperties().filter((p) => p.featured);
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    return getLocalProperties().find((p) => p.id === id) ?? getPropertyById(id) ?? null;
  }

  try {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).maybeSingle();

    if (error) {
      console.warn('[properties] Supabase fetchPropertyById error, using fallback:', error.message);
      return getLocalProperties().find((p) => p.id === id) ?? getPropertyById(id) ?? null;
    }
    if (data) {
      return mapRow(data);
    }
    return getLocalProperties().find((p) => p.id === id) ?? getPropertyById(id) ?? null;
  } catch (err) {
    console.warn('[properties] Supabase fetchPropertyById error, using fallback:', err);
    return getLocalProperties().find((p) => p.id === id) ?? getPropertyById(id) ?? null;
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
  if (!isSupabaseConfigured) {
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      refCode: input.refCode,
      name: input.name,
      location: input.location,
      coordinates: input.coordinates || '',
      type: input.type,
      status: input.status,
      price: input.price,
      currency: 'PKR',
      areaSqft: input.areaSqft,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      yearBuilt: input.yearBuilt || 0,
      architect: input.architect || '',
      description: input.description || '',
      image: input.imageUrl || '',
      gallery: input.galleryUrls || [],
      featured: input.featured,
    };
    const current = getLocalProperties();
    setLocalProperties([newProperty, ...current]);
    return newProperty;
  }

  const { data, error } = await supabase.from('properties').insert(toInsertRow(input)).select().single();
  if (error) throw error;
  return mapRow(data);
}

export async function updateProperty(id: string, input: PropertyFormInput): Promise<Property> {
  if (!isSupabaseConfigured) {
    const current = getLocalProperties();
    const updated: Property = {
      id,
      refCode: input.refCode,
      name: input.name,
      location: input.location,
      coordinates: input.coordinates || '',
      type: input.type,
      status: input.status,
      price: input.price,
      currency: 'PKR',
      areaSqft: input.areaSqft,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      yearBuilt: input.yearBuilt || 0,
      architect: input.architect || '',
      description: input.description || '',
      image: input.imageUrl || '',
      gallery: input.galleryUrls || [],
      featured: input.featured,
    };
    setLocalProperties(current.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  const update: PropertyUpdate = toInsertRow(input);
  const { data, error } = await supabase.from('properties').update(update).eq('id', id).select().single();
  if (error) throw error;
  return mapRow(data);
}

export async function deleteProperty(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const current = getLocalProperties();
    setLocalProperties(current.filter((p) => p.id !== id));
    return;
  }

  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

/** Uploads an image to the public property-images bucket or returns data URL in local mode. */
export async function uploadPropertyImage(file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

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
