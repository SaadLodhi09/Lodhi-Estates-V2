import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  submitInquiry,
  fetchInquiries,
  fetchMyInquiries,
  updateInquiryStatus,
  deleteInquiry,
  type InquiryFormInput,
} from '@/lib/api/inquiries';
import type { InquiryRow } from '@/types/database';
import { useAuth } from '@/context/AuthContext';

const KEY = ['inquiries'] as const;
const MY_KEY = ['my-inquiries'] as const;

/** Admin-only (RLS-gated) list of every inquiry. */
export function useInquiries() {
  return useQuery({ queryKey: KEY, queryFn: fetchInquiries });
}

/** A signed-in client's own inquiry history (account dashboard). */
export function useMyInquiries() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...MY_KEY, user?.id],
    queryFn: () => fetchMyInquiries(user!.id),
    enabled: Boolean(user),
  });
}

/** Public: used by the contact form. */
export function useSubmitInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InquiryFormInput) => submitInquiry(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_KEY }),
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InquiryRow['status'] }) => updateInquiryStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInquiry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
