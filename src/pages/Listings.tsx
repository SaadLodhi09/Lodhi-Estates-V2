import { useMemo, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { ListingsHero } from '@/components/listings/ListingsHero';
import {
  ListingFilters,
  type PropertyTypeFilter,
  type SortOption,
} from '@/components/listings/ListingFilters';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingCardSkeleton } from '@/components/listings/ListingCardSkeleton';
import { useProperties } from '@/hooks/useProperties';

export default function Listings() {
  const { data: properties, isLoading, isError } = useProperties();
  const [activeType, setActiveType] = useState<PropertyTypeFilter>('All');
  const [sort, setSort] = useState<SortOption>('newest');

  const filtered = useMemo(() => {
    let list = properties ?? [];

    if (activeType !== 'All') {
      list = list.filter((property) => property.type === activeType);
    }

    list = [...list].sort((a, b) => {
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'price-asc') return a.price - b.price;
      return b.yearBuilt - a.yearBuilt;
    });

    return list;
  }, [properties, activeType, sort]);

  return (
    <>
      <ListingsHero count={properties?.length} />
      <section className="bg-paper py-20 md:py-28">
        <Container>
          <ListingFilters
            activeType={activeType}
            onTypeChange={setActiveType}
            sort={sort}
            onSortChange={setSort}
            resultCount={filtered.length}
          />

          {isError && (
            <p className="mt-16 text-center text-ink/50">
              Listings couldn&rsquo;t be loaded right now — please try again shortly.
            </p>
          )}

          {isLoading && (
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && !isError && <ListingGrid properties={filtered} />}
        </Container>
      </section>
    </>
  );
}
