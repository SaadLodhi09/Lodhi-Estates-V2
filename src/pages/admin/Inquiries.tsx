import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useInquiries, useUpdateInquiryStatus, useDeleteInquiry } from '@/hooks/useInquiries';
import { useProperties } from '@/hooks/useProperties';
import type { InquiryRow } from '@/types/database';
import { cn } from '@/lib/utils';

const statusClasses: Record<InquiryRow['status'], string> = {
  new: 'text-moss border-moss',
  contacted: 'text-brass border-brass',
  closed: 'text-stone border-stone',
};

export default function AdminInquiries() {
  const { data: inquiries, isLoading } = useInquiries();
  const { data: properties } = useProperties();
  const updateStatus = useUpdateInquiryStatus();
  const deleteMutation = useDeleteInquiry();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const propertyName = (id: string | null) => properties?.find((p) => p.id === id)?.name;

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl text-ink">Inquiries</h1>

      {isLoading && <p className="mt-10 text-sm text-stone">Loading…</p>}

      {!isLoading && (
        <div className="mt-10 divide-y divide-line border-y border-line">
          {(inquiries ?? []).map((inquiry) => {
            const expanded = expandedId === inquiry.id;
            return (
              <div key={inquiry.id}>
                <button
                  onClick={() => setExpandedId(expanded ? null : inquiry.id)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="truncate text-sm text-ink">{inquiry.name}</p>
                      <span
                        className={cn(
                          'shrink-0 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest2',
                          statusClasses[inquiry.status]
                        )}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-stone">
                      {inquiry.email} {propertyName(inquiry.propertyId) ? `· Re: ${propertyName(inquiry.propertyId)}` : ''}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest2 text-stone">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                  {expanded ? <ChevronUp size={16} className="text-stone" /> : <ChevronDown size={16} className="text-stone" />}
                </button>

                {expanded && (
                  <div className="space-y-4 bg-mist px-5 py-5">
                    <p className="text-sm leading-relaxed text-ink/80">{inquiry.message}</p>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-stone">
                      <span>{inquiry.phone || 'No phone given'}</span>
                      {inquiry.interest && (
                        <>
                          <span className="text-line">·</span>
                          <span>{inquiry.interest}</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {(['new', 'contacted', 'closed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus.mutate({ id: inquiry.id, status })}
                          disabled={inquiry.status === status}
                          className={cn(
                            'border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors',
                            inquiry.status === status
                              ? 'border-ink bg-ink text-paper'
                              : 'border-line text-ink/60 hover:border-ink'
                          )}
                        >
                          Mark {status}
                        </button>
                      ))}
                      <button
                        onClick={() => deleteMutation.mutate(inquiry.id)}
                        className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest2 text-stone hover:text-red-600"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {inquiries?.length === 0 && (
            <p className="py-10 text-center text-sm text-stone">No inquiries yet.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
