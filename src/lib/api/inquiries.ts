import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { InquiryRow, InquiryInsert } from '@/types/database';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  propertyId: string | null;
  userId: string | null;
  status: InquiryRow['status'];
  createdAt: string;
}

function mapRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? '',
    interest: row.interest ?? '',
    message: row.message,
    propertyId: row.property_id,
    userId: row.user_id,
    status: row.status,
    createdAt: row.created_at,
  };
}

export interface InquiryFormInput {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  propertyId?: string | null;
  userId?: string | null;
}

export async function submitInquiry(input: InquiryFormInput): Promise<void> {
  if (!isSupabaseConfigured) return;

  const row: InquiryInsert = {
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    interest: input.interest || null,
    message: input.message,
    property_id: input.propertyId ?? null,
    user_id: input.userId ?? null,
  };

  const { error } = await supabase.from('inquiries').insert(row);
  if (error) throw error;
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[inquiries] fetch error:', error.message);
      return [];
    }
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.warn('[inquiries] fetch exception:', err);
    return [];
  }
}

export async function fetchMyInquiries(userId: string): Promise<Inquiry[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[inquiries] fetchMy error:', error.message);
      return [];
    }
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.warn('[inquiries] fetchMy exception:', err);
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: InquiryRow['status']): Promise<void> {
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
}
