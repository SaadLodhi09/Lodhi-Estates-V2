import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { img } from '@/data/images';
import { useSiteContent } from '@/hooks/useSiteContent';

export function Philosophy() {
  const { data: siteContent } = useSiteContent();
  const philosophy = siteContent?.philosophy;

  const photoUrl = philosophy?.imageUrl || img('interiorWindow', 1400);
  const photoTag = philosophy?.imageTag || 'LE-014 / DHA Phase 6';

  return (
    <section className="bg-paper py-28 md:py-36">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 lg:col-start-1" y={32}>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <img
                src={photoUrl}
                alt="Living space with a full-height window onto the garden"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {photoTag && (
                <div className="absolute left-0 top-0 border-b border-r border-paper/30 bg-ink/50 px-4 py-3 font-mono text-[11px] text-paper backdrop-blur-md">
                  {photoTag}
                </div>
              )}
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>{philosophy?.eyebrow || 'Why Lodhi Estates'}</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-display-md text-ink">
                {philosophy?.headline || 'We look at a house the way its architect did.'}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-ink/70">
                {philosophy?.description ||
                  'Most listings describe a home the way a spreadsheet would — bedrooms, bathrooms, a price per square foot. We start from the plan: orientation, structure, materials, the decisions an architect made and why. It changes how a house is priced, and it changes who it’s right for.'}
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10">
              <Button as="link" to={philosophy?.btnLink || '/about'} variant="outline">
                {philosophy?.btnText || 'Read Our Approach'}
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
