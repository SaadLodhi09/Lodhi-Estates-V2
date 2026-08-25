import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { img } from '@/data/images';

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-ink py-32 md:py-40">
      <img
        src={img('exteriorDusk', 2000)}
        alt="Residence at dusk, interior lighting visible through glass façade"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      <Container className="relative">
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow tone="paper">Start a Search</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-display-md text-paper">
              Tell us what the house needs to do.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-base leading-relaxed text-paper/70">
              A short call is usually enough to know whether we have something worth showing you —
              or whether we should keep looking on your behalf.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10">
            <Button as="link" to="/contact" tone="paper">
              Book a Viewing
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
