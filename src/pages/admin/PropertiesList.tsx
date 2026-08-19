import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Star } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { useProperties, useDeleteProperty } from '@/hooks/useProperties';
import { formatPrice, cn } from '@/lib/utils';

export default function AdminProperties() {
  const { data: properties, isLoading } = useProperties();
  const deleteMutation = useDeleteProperty();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    deleteMutation.mutate(id, { onSettled: () => setConfirmId(null) });
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Properties</h1>
        <Button as="link" to="/admin/properties/new" icon={false}>
          <span className="flex items-center gap-2">
            <Plus size={14} /> Add Listing
          </span>
        </Button>
      </div>

      {isLoading && <p className="mt-10 text-sm text-stone">Loading…</p>}

      {!isLoading && (
        <div className="mt-10 divide-y divide-line border-y border-line">
          {(properties ?? []).map((property) => (
            <div key={property.id} className="flex items-center justify-between gap-4 py-4">
              <Link to={`/admin/properties/${property.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden bg-mist">
                  {property.image && (
                    <img src={property.image} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm text-ink">{property.name}</p>
                    {property.featured && <Star size={12} className="shrink-0 fill-brass text-brass" />}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-stone">
                    {property.refCode} · {property.location} · {property.status}
                  </p>
                </div>
              </Link>

              <span className="hidden shrink-0 font-mono text-sm text-ink sm:block">
                {formatPrice(property.price)}
              </span>

              <button
                onClick={() => handleDelete(property.id)}
                className={cn(
                  'shrink-0 border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-colors',
                  confirmId === property.id
                    ? 'border-red-600 bg-red-600 text-paper'
                    : 'border-line text-ink/50 hover:border-red-600 hover:text-red-600'
                )}
              >
                {confirmId === property.id ? (
                  'Confirm'
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Trash2 size={12} /> Delete
                  </span>
                )}
              </button>
            </div>
          ))}

          {properties?.length === 0 && (
            <p className="py-10 text-center text-sm text-stone">No listings yet — add your first one above.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
