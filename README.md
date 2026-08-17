# Lodhi Estates

Private real estate marketing site with a full working backend — Vite +
React + TypeScript + Tailwind CSS + Framer Motion on the frontend,
Supabase (Postgres + Auth + Storage) on the backend, Resend for email
notifications.

**First time here? Start with [SETUP.md](./SETUP.md)** — it walks
through creating your Supabase project, your admin login, and email
notifications step by step. Nothing below will work until you've done
that (the site needs a database to talk to).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values — see SETUP.md
npm run dev                   # http://localhost:5173
npm run build                 # production build -> dist/
npm run preview               # serve the production build locally
```

Requires Node 18+.

## What's functional

- **Public site** — home, listings (live from the database, with working
  filters/sort), individual property pages, about, contact
- **Contact form** — real submissions, saved to the database and emailed
  to you
- **Admin dashboard** (`/admin`) — email/password login; add, edit,
  delete listings with photo upload; view and manage inquiries
- No public sign-up: you create your one (or more) admin account
  directly in Supabase — see SETUP.md step 3

## Project structure

```
src/
  components/
    layout/     Header, Footer, page Container — shared on every public page
    ui/         Button, Reveal, Eyebrow, SpecTag, SplitHeadline — design system primitives
    home/       Homepage-only sections
    listings/   ListingCard, filters, grid, listings hero — shared between home + listings
    about/      About page sections
    contact/    Contact form + info sidebar
    admin/      AdminLayout, ProtectedRoute, image upload fields — dashboard-only, code-split
  pages/        One file per route
  pages/admin/  Dashboard, PropertiesList, PropertyEditor, Inquiries, Login — lazy-loaded
  lib/
    supabase.ts     Supabase client singleton
    api/            Typed data-access functions (properties.ts, inquiries.ts) — the only
                     files that call Supabase directly; everything else goes through hooks
    utils.ts        cn() class merge helper, formatPrice()
  hooks/
    useProperties.ts   React Query hooks: list/detail/create/update/delete
    useInquiries.ts    React Query hooks: submit (public) + list/update/delete (admin)
    useAuth.ts         Supabase session state + signIn/signOut
    useScrolled.ts, useScrollToTop.ts
  types/
    property.ts     UI-facing Property shape (camelCase)
    database.ts     Raw DB row shapes (snake_case) + Supabase Database generic
  data/
    content.ts      Static site copy — nav, stats, process steps, values, office locations
    images.ts       Placeholder photo URLs, referenced by key everywhere they're used
    properties.ts   No longer read at runtime — kept as the source seed.sql was generated
                     from; listings now live in the database, managed via /admin

supabase/
  migrations/0001_init.sql   Full schema, RLS policies, storage bucket — run this first
  seed.sql                   Optional: loads the original 9 placeholder listings
  functions/send-inquiry-email/   Edge Function that emails you on new inquiries
```

## Design system

- **Colors** — warm "paper" background (#F6F4EE), near-black "ink" text, deep
  "moss" green + "brass" as accent colors. Defined in `tailwind.config.ts`.
- **Type** — Fraunces (display serif) for headlines, Manrope (sans) for body/UI,
  JetBrains Mono for the "spec sheet" motif (prices, coordinates, ref codes,
  eyebrows).
- **Motion** — Framer Motion throughout: `Reveal` handles scroll-triggered
  fade/lift, `SplitHeadline` staggers the hero title in on load, listing cards
  reveal a spec panel on hover.

## How data flows

`src/lib/api/*.ts` are the only files that import the Supabase client
directly — they translate between the database's snake_case rows and the
camelCase shapes components use. `src/hooks/*.ts` wrap those functions in
React Query, which handles caching, loading states, and automatically
refetching lists after an admin edit. Components never call Supabase or
the api/ layer directly — they call a hook.

If you ever move off Supabase, only `lib/api/*.ts` needs to change —
every hook, page, and component keeps working against the same `Property`
/ `Inquiry` shapes.

## Security model

Row Level Security (enforced by Postgres itself, not the frontend) is
the real security boundary:

- Anyone can **read** properties and **submit** an inquiry (no login
  needed — that's the public site working as intended).
- Only an **authenticated** Supabase session can create/edit/delete
  properties, or read/update/delete inquiries.
- There's no public sign-up route, so "authenticated" effectively means
  "an account you created by hand in Supabase Studio."

Full policies are in `supabase/migrations/0001_init.sql`.

## Deploying

The frontend deploys anywhere that serves a static Vite build (Vercel,
Netlify, GitHub Pages, etc.) — just set the two `VITE_SUPABASE_*`
environment variables in that host's dashboard. The backend (database,
auth, storage, email function) is already deployed the moment you finish
SETUP.md — there's no separate server to host.

**Vercel** (recommended, handles the client-side routes correctly out of
the box):
```bash
npm install -g vercel
vercel
```
Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel
project's Environment Variables settings, then redeploy.
