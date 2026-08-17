import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProperties } from '@/hooks/useProperties';
import { useInquiries } from '@/hooks/useInquiries';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const { data: properties } = useProperties();
  const { data: inquiries } = useInquiries();

  const newInquiries = inquiries?.filter((i) => i.status === 'new') ?? [];
  const available = properties?.filter((p) => p.status === 'Available') ?? [];

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Listings" value={properties?.length ?? '—'} />
        <StatCard label="Available Now" value={available.length || '—'} />
        <StatCard label="New Inquiries" value={newInquiries.length} highlight={newInquiries.length > 0} />
      </div>

      <div className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="font-mono text-[11px] uppercase tracking-widest2 text-moss">
            View All
          </Link>
        </div>

        <div className="mt-4 divide-y divide-line border-y border-line">
          {(inquiries ?? []).slice(0, 5).map((inquiry) => (
            <div key={inquiry.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-ink">{inquiry.name}</p>
                <p className="mt-0.5 text-xs text-stone">{inquiry.email}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest2 text-stone">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
          {inquiries?.length === 0 && <p className="py-6 text-sm text-stone">No inquiries yet.</p>}
        </div>
      </div>

      <div className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Recent Listings</h2>
          <Link to="/admin/properties" className="font-mono text-[11px] uppercase tracking-widest2 text-moss">
            Manage All
          </Link>
        </div>

        <div className="mt-4 divide-y divide-line border-y border-line">
          {(properties ?? []).slice(0, 5).map((property) => (
            <Link
              key={property.id}
              to={`/admin/properties/${property.id}`}
              className="flex items-center justify-between py-4 transition-colors hover:bg-mist"
            >
              <div>
                <p className="text-sm text-ink">{property.name}</p>
                <p className="mt-0.5 text-xs text-stone">{property.refCode} · {property.location}</p>
              </div>
              <span className="font-mono text-sm text-ink">{formatPrice(property.price)}</span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className={`border p-6 ${highlight ? 'border-moss bg-moss/5' : 'border-line'}`}>
      <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">{label}</span>
      <p className="mt-3 font-display text-4xl text-ink">{value}</p>
    </div>
  );
}
