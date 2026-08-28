import type { SiteContent } from '@/types/siteContent';
import { img } from './images';

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: 'Private Residences — Lahore · Islamabad · Karachi',
    headline1: 'Every estate,',
    headline2: 'drawn to scale.',
    description:
      'Lodhi Estates represents a small number of private residences each year — chosen for architecture, siting, and light, then documented like the buildings they are.',
    imageUrl: img('exteriorDusk', 2400),
    primaryBtnText: 'View Current Listings',
    primaryBtnLink: '/listings',
    secondaryBtnText: 'Our Approach',
    secondaryBtnLink: '/about',
  },
  philosophy: {
    eyebrow: 'Why Lodhi Estates',
    headline: 'We look at a house the way its architect did.',
    description:
      'Most listings describe a home the way a spreadsheet would — bedrooms, bathrooms, a price per square foot. We start from the plan: orientation, structure, materials, the decisions an architect made and why. It changes how a house is priced, and it changes who it’s right for.',
    imageUrl: img('interiorWindow', 1400),
    imageTag: 'LE-014 / DHA Phase 6',
    btnText: 'Read Our Approach',
    btnLink: '/about',
  },
  featured: {
    eyebrow: 'Current Collection',
    headline: 'Three residences, open now.',
    btnText: 'View All Listings',
    btnLink: '/listings',
  },
  cta: {
    eyebrow: 'Start a Search',
    headline: 'Tell us what the house needs to do.',
    description:
      'A short call is usually enough to know whether we have something worth showing you — or whether we should keep looking on your behalf.',
    imageUrl: img('exteriorDusk', 2000),
    btnText: 'Book a Viewing',
    btnLink: '/contact',
  },
};
