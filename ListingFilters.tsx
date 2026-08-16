import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';

export type PropertyTypeFilter = 'All' | Property['type'];
export type SortOption = 'newest' | 'price-desc' | 'price-asc';

const types: PropertyTypeFilter[] = ['All', 'Villa', 'Residence', 'Penthouse', 'Estate'];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
];

interface ListingFiltersProps {
  activeType: PropertyTypeFilter;
  onTypeChange: (type: PropertyTypeFilter) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

export function ListingFilters({
  activeType,
  onTypeChange,
  sort,
  onSortChange,
  resultCount,
}: ListingFiltersProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={cn(
              'border px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors duration-300',
              activeType === type
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-ink/60 hover:border-ink/60 hover:text-ink'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
          {resultCount} {resultCount === 1 ? 'Result' : 'Results'}
        </span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="border border-line bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink outline-none transition-colors focus:border-ink"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
