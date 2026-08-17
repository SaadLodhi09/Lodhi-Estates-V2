import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  submitInquiry,
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
  type InquiryFormInput,
} from '@/lib/api/inquiries';
import type { InquiryRow } from '@/types/database';

const KEY = ['inquiries'] as const;

/** Admin-only (RLS-gated) list of inquiries. */
export function useInquiries() {
  return useQuery({ queryKey: KEY, queryFn: fetchInquiries });
}

/** Public: used by the contact form. */
export function useSubmitInquiry() {
  return useMutation({
    mutationFn: (input: InquiryFormInput) => submitInquiry(input),
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
