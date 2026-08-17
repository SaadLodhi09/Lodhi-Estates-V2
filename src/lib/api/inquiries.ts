import { supabase } from '@/lib/supabase';
import type { InquiryRow, InquiryInsert } from '@/types/database';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  propertyId: string | null;
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
}

/** Public: anyone can call this from the contact form (RLS allows anonymous inserts). */
export async function submitInquiry(input: InquiryFormInput): Promise<void> {
  const row: InquiryInsert = {
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    interest: input.interest || null,
    message: input.message,
    property_id: input.propertyId ?? null,
  };

  const { error } = await supabase.from('inquiries').insert(row);
  if (error) throw error;
}

/** Admin-only: RLS restricts this to authenticated sessions. */
export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function updateInquiryStatus(id: string, status: InquiryRow['status']): Promise<void> {
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
}
