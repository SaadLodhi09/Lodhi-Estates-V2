import { useMemo, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { ListingsHero } from '@/components/listings/ListingsHero';
import {
  ListingFilters,
  type PropertyTypeFilter,
  type SortOption,
} from '@/components/listings/ListingFilters';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { properties } from '@/data/properties';

export default function Listings() {
  const [activeType, setActiveType] = useState<PropertyTypeFilter>('All');
  const [sort, setSort] = useState<SortOption>('newest');

  const filtered = useMemo(() => {
    let list = properties;

    if (activeType !== 'All') {
      list = list.filter((property) => property.type === activeType);
    }

    list = [...list].sort((a, b) => {
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'price-asc') return a.price - b.price;
      return b.yearBuilt - a.yearBuilt;
    });

    return list;
  }, [activeType, sort]);

  return (
    <>
      <ListingsHero />
      <section className="bg-paper py-20 md:py-28">
        <Container>
          <ListingFilters
            activeType={activeType}
            onTypeChange={setActiveType}
            sort={sort}
            onSortChange={setSort}
            resultCount={filtered.length}
          />
          <ListingGrid properties={filtered} />
        </Container>
      </section>
    </>
  );
}
