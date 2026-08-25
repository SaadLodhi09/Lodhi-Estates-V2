import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { officeLocations } from '@/data/content';

export function OfficeList() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <Container>
        <Reveal>
          <Eyebrow>Where We Work</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-lg font-display text-display-md text-ink">Three cities, by appointment.</h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 divide-y divide-line border-t border-line md:grid-cols-3 md:divide-x md:divide-y-0 md:border-t-0">
          {officeLocations.map((office, i) => (
            <Reveal key={office.city} delay={i * 0.1} className="py-8 md:px-8 md:py-0">
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-brass">{office.city}</span>
              <p className="mt-4 text-base leading-relaxed text-ink/70">{office.address}</p>
              <p className="mt-3 font-mono text-sm text-stone">{office.phone}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
