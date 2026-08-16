import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ListingCard } from '@/components/listings/ListingCard';
import { getFeaturedProperties } from '@/data/properties';

export function FeaturedListings() {
  const featured = getFeaturedProperties();

  return (
    <section className="bg-mist py-28 md:py-36">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow>Current Collection</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 max-w-xl font-display text-display-md text-ink">
                Three residences, open now.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Button as="link" to="/listings" variant="outline">
              View All Listings
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {featured.map((property, i) => (
            <ListingCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
