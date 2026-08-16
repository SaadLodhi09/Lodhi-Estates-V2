import { AboutHero } from '@/components/about/AboutHero';
import { Story } from '@/components/about/Story';
import { Values } from '@/components/about/Values';
import { OfficeList } from '@/components/about/OfficeList';
import { CTABanner } from '@/components/home/CTABanner';

export default function About() {
  return (
    <>
      <AboutHero />
      <Story />
      <Values />
      <OfficeList />
      <CTABanner />
    </>
  );
}
