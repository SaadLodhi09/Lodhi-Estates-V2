import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { img } from '@/data/images';
import { useSiteContent } from '@/hooks/useSiteContent';

export function CTABanner() {
  const { data: siteContent } = useSiteContent();
  const cta = siteContent?.cta;

  const bgImage = cta?.imageUrl || img('exteriorDusk', 2000);

  return (
    <section className="relative overflow-hidden bg-ink py-32 md:py-40">
      <img
        src={bgImage}
        alt="Residence at dusk, interior lighting visible through glass façade"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      <Container className="relative">
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow tone="paper">{cta?.eyebrow || 'Start a Search'}</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-display-md text-paper">
              {cta?.headline || 'Tell us what the house needs to do.'}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-base leading-relaxed text-paper/70 text-justify">
              {cta?.description ||
                'A short call is usually enough to know whether we have something worth showing you — or whether we should keep looking on your behalf.'}
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10">
            <Button as="link" to={cta?.btnLink || '/contact'} tone="paper">
              {cta?.btnText || 'Book a Viewing'}
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
