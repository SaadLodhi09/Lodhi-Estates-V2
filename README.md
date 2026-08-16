# Lodhi Estates

Private real estate marketing site — Vite + React + TypeScript + Tailwind CSS +
Framer Motion. Frontend only; no backend is wired up yet (see notes below).

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

Requires Node 18+.

## Project structure

```
src/
  components/
    layout/     Header, Footer, page Container — shared on every page
    ui/         Button, Reveal, Eyebrow, SpecTag, SplitHeadline — design system primitives
    home/       Homepage-only sections (Hero, Philosophy, FeaturedListings, ...)
    listings/   ListingCard (shared with the homepage), filters, grid, listings hero
    about/      About page sections
    contact/    Contact form + info sidebar
  pages/        One file per route — composes section components, owns page-level state
  data/         Placeholder content: properties.ts, content.ts (copy), images.ts (photo map)
  hooks/        useScrolled (header transparency), useScrollToTop (route change)
  lib/          utils.ts — cn() class merge helper, formatPrice()
  types/        Shared TypeScript interfaces (Property)
```

## Design system

- **Colors** — warm "paper" background (#F6F4EE), near-black "ink" text, deep
  "moss" green + "brass" as accent colors. Defined in `tailwind.config.ts`.
- **Type** — Fraunces (display serif) for headlines, Manrope (sans) for body/UI,
  JetBrains Mono for the "spec sheet" motif (prices, coordinates, ref codes,
  eyebrows) — the signature detail that ties photography, listings, and the
  hero together.
- **Motion** — Framer Motion throughout: `Reveal` handles scroll-triggered
  fade/lift, `SplitHeadline` staggers the hero title in on load, listing cards
  reveal a spec panel on hover.

## Swapping in real content

- **Photography**: everything routes through `src/data/images.ts`. Replace the
  Unsplash IDs with your own asset paths/URLs and every component that uses
  them updates automatically.
- **Listings**: edit `src/data/properties.ts`. Each property is one object —
  no other file needs to change to add/remove/edit a listing.
- **Copy**: nav links, stats, process steps, values, founder note, and office
  locations all live in `src/data/content.ts`.

## Not yet wired up (by design — frontend only)

- `ContactForm.tsx` simulates a submit (see the `NOTE` comment in that file)
  — point it at a real endpoint or CRM when the backend exists.
- The listings filter/sort is fully functional client-side; there's no
  pagination or backend query yet since the placeholder set is small.
- No CMS — content is static TypeScript data, intentionally, so it's easy to
  later swap for a headless CMS (Sanity, Contentful) without touching layout
  components.
