import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { values } from '@/data/content';

export function Values() {
  return (
    <section className="bg-mist py-28 md:py-36">
      <Container>
        <Reveal>
          <Eyebrow>What Stays Fixed</Eyebrow>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.1}>
              <h3 className="font-display text-2xl text-ink">{value.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/65">{value.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
