import { Container } from '@/components/layout/Container';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { Reveal } from '@/components/ui/Reveal';

export default function Contact() {
  return (
    <>
      <ContactHero />
      <section className="bg-paper py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <ContactForm />
            </Reveal>
            <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
              <ContactInfo />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
