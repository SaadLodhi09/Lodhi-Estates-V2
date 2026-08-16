import { motion } from 'framer-motion';
import type { Property } from '@/types/property';
import { formatPrice, cn } from '@/lib/utils';

const statusClasses: Record<Property['status'], string> = {
  Available: 'text-moss',
  'Under Offer': 'text-brass',
  Reserved: 'text-stone',
};

export function ListingCard({ property, index = 0 }: { property: Property; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist">
        <img
          src={property.image}
          alt={property.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2">
          <span className="bg-paper/90 px-2 py-1 text-ink">{property.refCode}</span>
        </div>

        <div
          className={cn(
            'absolute right-4 top-4 bg-ink/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest2 backdrop-blur-sm',
            statusClasses[property.status]
          )}
        >
          {property.status}
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
          <div className="border border-paper/25 bg-ink/50 px-4 py-3 font-mono text-[11px] text-paper backdrop-blur-md">
            <div className="flex justify-between border-b border-paper/15 py-1">
              <span className="uppercase tracking-widest2 text-paper/55">Area</span>
              <span>{property.areaSqft.toLocaleString()} sqft</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="uppercase tracking-widest2 text-paper/55">Built</span>
              <span>{property.yearBuilt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-ink">{property.name}</h3>
          <p className="mt-1 text-sm text-stone">{property.location}</p>
        </div>
        <span className="mt-1 whitespace-nowrap font-mono text-sm text-ink">{formatPrice(property.price)}</span>
      </div>

      <div className="mt-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-stone">
        <span>{property.bedrooms} Bed</span>
        <span className="h-1 w-1 rounded-full bg-line" />
        <span>{property.bathrooms} Bath</span>
        <span className="h-1 w-1 rounded-full bg-line" />
        <span>{property.type}</span>
      </div>
    </motion.article>
  );
}
