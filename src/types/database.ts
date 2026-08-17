export interface PropertyRow {
  id: string;
  ref_code: string;
  name: string;
  location: string;
  coordinates: string | null;
  type: 'Villa' | 'Residence' | 'Penthouse' | 'Estate';
  status: 'Available' | 'Under Offer' | 'Reserved';
  price: number;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number | null;
  architect: string | null;
  description: string | null;
  image_url: string | null;
  gallery_urls: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type PropertyInsert = Omit<PropertyRow, 'id' | 'created_at' | 'updated_at'>;
export type PropertyUpdate = Partial<PropertyInsert>;

export interface InquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string;
  property_id: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export type InquiryInsert = Omit<InquiryRow, 'id' | 'created_at' | 'status'>;

/**
 * Minimal Supabase Database generic. Hand-written to match
 * supabase/migrations/0001_init.sql — if you change the schema, update
 * this alongside it. (Swap for `supabase gen types typescript` output
 * once the Supabase CLI is part of your workflow.)
 */
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: PropertyRow;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
      };
      inquiries: {
        Row: InquiryRow;
        Insert: InquiryInsert;
        Update: Partial<InquiryRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
