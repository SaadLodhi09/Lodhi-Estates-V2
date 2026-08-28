import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingCardSkeleton } from '@/components/listings/ListingCardSkeleton';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { useSiteContent } from '@/hooks/useSiteContent';

export function FeaturedListings() {
  const { data: featured, isLoading, isError } = useFeaturedProperties();
  const { data: siteContent } = useSiteContent();

  if (isError) return null;

  const section = siteContent?.featured;

  return (
    <section className="bg-mist py-28 md:py-36">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow>{section?.eyebrow || 'Current Collection'}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 max-w-xl font-display text-display-md text-ink">
                {section?.headline || 'Three residences, open now.'}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Button as="link" to={section?.btnLink || '/listings'} variant="outline">
              {section?.btnText || 'View All Listings'}
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          {!isLoading &&
            featured?.map((property, i) => (
              <ListingCard key={property.id} property={property} index={i} />
            ))}
        </div>
      </Container>
    </section>
  );
}
