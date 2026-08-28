export interface HeroContent {
  eyebrow: string;
  headline1: string;
  headline2: string;
  description: string;
  imageUrl: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
}

export interface PhilosophyContent {
  eyebrow: string;
  headline: string;
  description: string;
  imageUrl: string;
  imageTag: string;
  btnText: string;
  btnLink: string;
}

export interface FeaturedSectionContent {
  eyebrow: string;
  headline: string;
  btnText: string;
  btnLink: string;
}

export interface CTASectionContent {
  eyebrow: string;
  headline: string;
  description: string;
  imageUrl: string;
  btnText: string;
  btnLink: string;
}

export interface SiteContent {
  hero: HeroContent;
  philosophy: PhilosophyContent;
  featured: FeaturedSectionContent;
  cta: CTASectionContent;
}
