import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { img } from '@/data/images';

export function AboutHero() {
  return (
    <section className="relative flex h-[64vh] min-h-[480px] w-full items-end overflow-hidden bg-ink">
      <motion.img
        src={img('exteriorGarden', 2200)}
        alt="Residence courtyard with garden and covered terrace"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />

      <Container className="relative pb-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <Eyebrow tone="paper">About Lodhi Estates</Eyebrow>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl font-display text-display-lg text-paper"
        >
          Fewer houses, looked at properly.
        </motion.h1>
      </Container>
    </section>
  );
}
