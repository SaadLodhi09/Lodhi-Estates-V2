import { useNavigate, Link } from 'react-router-dom';
import { Heart, LogOut, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { ListingCard } from '@/components/listings/ListingCard';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/api/auth';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { useMyInquiries } from '@/hooks/useInquiries';
import { cn } from '@/lib/utils';

const statusClasses: Record<string, string> = {
  new: 'text-moss border-moss',
  contacted: 'text-brass border-brass',
  closed: 'text-stone border-stone',
};

export default function AccountDashboard() {
  const navigate = useNavigate();
  const { profile, user, isAdmin } = useAuth();
  const { data: saved, isLoading: savedLoading } = useSavedProperties();
  const { data: inquiries, isLoading: inquiriesLoading } = useMyInquiries();

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <section className="bg-paper py-16 md:py-24">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-moss">My Account</span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 border border-ink/40 bg-ink/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest2 text-ink">
                  <ShieldCheck size={11} className="text-moss" /> Admin Account
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-3xl text-ink">
              {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Welcome'}
            </h1>
            <p className="mt-1 text-sm text-stone">{profile?.email ?? user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-paper transition-opacity hover:opacity-90"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/60 transition-colors hover:border-ink hover:text-ink"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Saved Properties</h2>

          {savedLoading && <p className="mt-6 text-sm text-stone">Loading…</p>}

          {!savedLoading && saved && saved.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((property, i) => (
                <ListingCard key={property.id} property={property} index={i} />
              ))}
            </div>
          )}

          {!savedLoading && saved?.length === 0 && (
            <div className="mt-6 flex flex-col items-start gap-3 border border-line bg-mist px-6 py-10">
              <Heart size={20} className="text-stone" strokeWidth={1.5} />
              <p className="text-sm text-ink/60">
                You haven&rsquo;t saved any properties yet. Tap the heart icon on any listing to add it here.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16">
          <h2 className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Inquiry History</h2>

          {inquiriesLoading && <p className="mt-6 text-sm text-stone">Loading…</p>}

          {!inquiriesLoading && inquiries && inquiries.length > 0 && (
            <div className="mt-6 divide-y divide-line border-y border-line">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{inquiry.message}</p>
                    <p className="mt-1 text-xs text-stone">
                      {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest2',
                      statusClasses[inquiry.status]
                    )}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!inquiriesLoading && inquiries?.length === 0 && (
            <p className="mt-6 text-sm text-ink/60">
              No inquiries yet — reach out from any listing when you&rsquo;re ready.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
