import { AnimatePresence, motion } from 'framer-motion';
import type { Property } from '@/types/property';
import { ListingCard } from './ListingCard';

export function ListingGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl text-ink/50">No residences match that filter.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {properties.map((property, i) => (
          <motion.div key={property.id} layout exit={{ opacity: 0, scale: 0.96 }}>
            <ListingCard property={property} index={i} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
