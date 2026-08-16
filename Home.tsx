import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Philosophy } from '@/components/home/Philosophy';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { Process } from '@/components/home/Process';
import { Stats } from '@/components/home/Stats';
import { CTABanner } from '@/components/home/CTABanner';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Philosophy />
      <FeaturedListings />
      <Process />
      <Stats />
      <CTABanner />
    </>
  );
}
