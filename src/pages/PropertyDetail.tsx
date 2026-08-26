import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SpecTag } from '@/components/ui/SpecTag';
import { Button } from '@/components/ui/Button';
import { SaveButton } from '@/components/listings/SaveButton';
import { useProperty } from '@/hooks/useProperties';
import { formatPrice, cn } from '@/lib/utils';

const statusClasses: Record<string, string> = {
  Available: 'text-[#A5C89E]',
  'Under Offer': 'text-brass',
  Reserved: 'text-stone-light',
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Loading…</span>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-display text-3xl text-ink">This listing isn&rsquo;t available.</h1>
        <p className="max-w-sm text-sm text-ink/60">
          It may have been sold, withdrawn, or the link may be out of date.
        </p>
        <Button as="link" to="/listings" variant="outline">
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-ink">
        <motion.img
          src={property.image}
          alt={property.name}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-ink/35" />

        <Container className="relative flex h-full flex-col justify-between py-24 md:py-28">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-paper/70 transition-colors hover:text-paper"
            >
              <ArrowLeft size={14} strokeWidth={1.75} />
              All Listings
            </Link>
            <SaveButton propertyId={property.id} size={18} className="h-10 w-10" />
          </motion.div>

          <div className="flex flex-col justify-end gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className={cn(
                  'font-mono text-[11px] uppercase tracking-widest2',
                  statusClasses[property.status] ?? 'text-paper/70'
                )}
              >
                {property.refCode} · {property.status}
              </span>
              <h1 className="mt-3 font-display text-display-lg text-paper">{property.name}</h1>
              <p className="mt-3 text-paper/70">{property.location}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpecTag
                rows={[
                  { label: 'Guide Price', value: formatPrice(property.price) },
                  { label: 'Area', value: `${property.areaSqft.toLocaleString()} sqft` },
                ]}
              />
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-ink/70">{property.description}</p>
              </Reveal>

              {property.gallery.length > 0 && (
                <Reveal delay={0.1} className="mt-12 grid grid-cols-2 gap-4">
                  {property.gallery.map((src) => (
                    <div key={src} className="aspect-[4/3] overflow-hidden bg-mist">
                      <img src={src} alt={property.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </Reveal>
              )}
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={0.1}>
                <div className="border border-line p-6">
                  <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">Key Facts</span>
                  <dl className="mt-5 space-y-3 font-mono text-sm">
                    <Row label="Type" value={property.type} />
                    <Row label="Bedrooms" value={String(property.bedrooms)} />
                    <Row label="Bathrooms" value={String(property.bathrooms)} />
                    <Row label="Area" value={`${property.areaSqft.toLocaleString()} sqft`} />
                    <Row label="Year Built" value={property.yearBuilt ? String(property.yearBuilt) : '—'} />
                    <Row label="Architect" value={property.architect || '—'} />
                    <Row label="Coordinates" value={property.coordinates || '—'} />
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={0.2} className="mt-6">
                <Button as="link" to={`/contact?property=${property.id}`} className="w-full justify-center">
                  Inquire About This Property
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-2">
      <dt className="uppercase tracking-widest2 text-[11px] text-stone">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
