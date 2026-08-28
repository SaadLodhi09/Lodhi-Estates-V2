import { Container } from '@/components/layout/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { founderNote } from '@/data/content';

export function Story() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>The Short Version</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-display-md text-ink">Why we started this.</h2>
            </Reveal>
          </div>

          <div className="space-y-6 lg:col-span-7 lg:col-start-6">
            {founderNote.body.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 20)} delay={0.15 + i * 0.1}>
                <p className="text-lg leading-relaxed text-ink/70 text-justify">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
