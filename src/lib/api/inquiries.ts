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

const LOCAL_INQUIRIES_KEY = 'le_local_inquiries';

function getLocalInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalInquiries(inquiries: Inquiry[]) {
  localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inquiries));
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
  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    name: input.name,
    email: input.email,
    phone: input.phone || '',
    interest: input.interest || '',
    message: input.message,
    propertyId: input.propertyId ?? null,
    userId: input.userId ?? null,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const list = getLocalInquiries();
  setLocalInquiries([newInquiry, ...list]);

  if (isSupabaseConfigured) {
    try {
      const row: InquiryInsert = {
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        interest: input.interest || null,
        message: input.message,
        property_id: input.propertyId ?? null,
        user_id: input.userId ?? null,
      };
      await supabase.from('inquiries').insert(row);
    } catch (err) {
      console.warn('[inquiries] Supabase submit error:', err);
    }
  }
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  if (!isSupabaseConfigured) {
    return getLocalInquiries();
  }

  try {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (error) return getLocalInquiries();
    return (data ?? []).map(mapRow);
  } catch {
    return getLocalInquiries();
  }
}

export async function fetchMyInquiries(userId: string): Promise<Inquiry[]> {
  if (!isSupabaseConfigured) {
    return getLocalInquiries().filter((i) => i.userId === userId || i.email === userId);
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return getLocalInquiries().filter((i) => i.userId === userId);
    return (data ?? []).map(mapRow);
  } catch {
    return getLocalInquiries().filter((i) => i.userId === userId);
  }
}

export async function updateInquiryStatus(id: string, status: InquiryRow['status']): Promise<void> {
  const list = getLocalInquiries();
  setLocalInquiries(list.map((i) => (i.id === id ? { ...i, status } : i)));

  if (isSupabaseConfigured) {
    try {
      await supabase.from('inquiries').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('[inquiries] Update error:', err);
    }
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  const list = getLocalInquiries();
  setLocalInquiries(list.filter((i) => i.id !== id));

  if (isSupabaseConfigured) {
    try {
      await supabase.from('inquiries').delete().eq('id', id);
    } catch (err) {
      console.warn('[inquiries] Delete error:', err);
    }
  }
}
