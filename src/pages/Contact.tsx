import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { Reveal } from '@/components/ui/Reveal';
import { useProperty } from '@/hooks/useProperties';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('property') ?? undefined;
  const { data: property } = useProperty(propertyId);

  return (
    <>
      <ContactHero />
      <section className="bg-paper py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <ContactForm property={property} />
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
