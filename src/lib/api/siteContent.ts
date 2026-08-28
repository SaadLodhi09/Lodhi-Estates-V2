import type { SiteContent } from '@/types/siteContent';
import { defaultSiteContent } from '@/data/defaultSiteContent';

const LOCAL_CONTENT_KEY = 'le_site_content_custom';

export function getStoredSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(LOCAL_CONTENT_KEY);
    if (!raw) return defaultSiteContent;
    const parsed = JSON.parse(raw);
    return {
      hero: { ...defaultSiteContent.hero, ...parsed.hero },
      philosophy: { ...defaultSiteContent.philosophy, ...parsed.philosophy },
      featured: { ...defaultSiteContent.featured, ...parsed.featured },
      cta: { ...defaultSiteContent.cta, ...parsed.cta },
    };
  } catch {
    return defaultSiteContent;
  }
}

export async function fetchSiteContent(): Promise<SiteContent> {
  return getStoredSiteContent();
}

export async function updateSiteContent(newContent: SiteContent): Promise<SiteContent> {
  localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(newContent));
  window.dispatchEvent(new Event('le-content-change'));
  return newContent;
}

export async function resetSiteContent(): Promise<SiteContent> {
  localStorage.removeItem(LOCAL_CONTENT_KEY);
  window.dispatchEvent(new Event('le-content-change'));
  return defaultSiteContent;
}
