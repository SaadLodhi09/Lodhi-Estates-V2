import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { processSteps } from '@/data/content';

export function Process() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <Container>
        <Reveal>
          <Eyebrow>How It Works</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-lg font-display text-display-md text-ink">
            Three steps. No open houses.
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {processSteps.map((step, i) => (
            <Reveal key={step.index} delay={i * 0.1}>
              <div className="border-t border-line pt-6">
                <span className="font-mono text-sm text-brass">{step.index}</span>
                <h3 className="mt-4 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/65">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
