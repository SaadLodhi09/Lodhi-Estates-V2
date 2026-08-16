import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';
import { stats } from '@/data/content';

export function Stats() {
  return (
    <section className="bg-moss-dark py-24 text-paper md:py-32">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="font-display text-5xl text-paper md:text-6xl">
                {stat.value}
                <span className="text-2xl text-paper/60 md:text-3xl">{stat.unit}</span>
              </div>
              <p className="mt-4 max-w-[16ch] text-sm leading-snug text-paper/65">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
