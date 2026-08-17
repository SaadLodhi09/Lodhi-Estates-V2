import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SplitHeadline } from '@/components/ui/SplitHeadline';
import { SpecTag } from '@/components/ui/SpecTag';
import { img } from '@/data/images';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { formatPrice } from '@/lib/utils';

export function Hero() {
  const { data: featured } = useFeaturedProperties();
  const feature = featured?.[0];

  return (
    <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-ink">
      <motion.img
        src={img('exteriorHillside', 2400)}
        alt="Concrete and glass residence set beneath an open sky"
        initial={{ scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-end pb-20 md:pb-24">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Eyebrow tone="paper">Private Residences — Lahore · Islamabad · Karachi</Eyebrow>
          </motion.div>

          <h1 className="mt-6 font-display text-display-xl text-paper">
            <SplitHeadline lines={['Every estate,', 'drawn to scale.']} delay={0.7} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-md text-base leading-relaxed text-paper/75 md:max-w-lg md:text-lg"
          >
            Lodhi Estates represents a small number of private residences each year — chosen for
            architecture, siting, and light, then documented like the buildings they are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <Button as="link" to="/listings" tone="paper">
              View Current Listings
            </Button>
            <Button as="link" to="/about" variant="ghost" tone="paper">
              Our Approach
            </Button>
          </motion.div>
        </Container>
      </div>

      {feature && (
        <div className="absolute bottom-20 right-6 hidden md:bottom-24 md:right-16 lg:block">
          <SpecTag
            align="right"
            rows={[
              { label: 'Featured', value: feature.refCode },
              { label: 'Location', value: feature.location },
              { label: 'Guide Price', value: formatPrice(feature.price) },
            ]}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="absolute bottom-8 left-6 hidden items-center gap-3 md:left-16 lg:flex"
      >
        <span className="h-8 w-px bg-paper/40" />
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-paper/50">Scroll</span>
      </motion.div>
    </section>
  );
}
