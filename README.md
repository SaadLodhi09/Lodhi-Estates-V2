# Lodhi Estates

Private real estate marketing site with a full working backend — Vite +
React + TypeScript + Tailwind CSS + Framer Motion on the frontend,
Supabase (Postgres + Auth + Storage) on the backend, Resend for email
notifications.

**First time here?** Start with [SETUP.md](./SETUP.md).
**Already have this live and adding the accounts/security update?** Use
[UPGRADING.md](./UPGRADING.md) instead — order of operations matters.

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
- **Contact form** — real submissions, saved to the database, emailed to
  you, rate-limited and honeypot-protected against spam
- **Client accounts** (`/account`) — sign up, sign in, save/favorite
  listings, see your own inquiry history
- **Admin dashboard** (`/admin`) — role-gated (not just "logged in");
  add, edit, delete listings with photo upload; view and manage every
  inquiry
- No public admin sign-up: every new account defaults to the `client`
  role — you promote your own account to admin with one SQL statement
  (see SETUP.md step 3)

## Project structure

```
src/
  components/
    layout/     Header, Footer, Container, EnvWarningBanner — shared on every public page
    ui/         Button, Reveal, Eyebrow, SpecTag, SplitHeadline — design system primitives
    home/       Homepage-only sections
    listings/   ListingCard, SaveButton, filters, grid, listings hero
    about/      About page sections
    contact/    Contact form + info sidebar
    account/    RequireUser route guard (any signed-in user)
    admin/      AdminLayout, ProtectedRoute (admin-only), image upload fields — code-split
    ErrorBoundary.tsx   Catches render crashes; shows a message instead of a blank page
  pages/            One file per public route
  pages/account/    SignIn, SignUp, Dashboard (saved properties + inquiry history)
  pages/admin/      Dashboard, PropertiesList, PropertyEditor, Inquiries, Login — lazy-loaded
  context/
    AuthContext.tsx   Single source of truth for session + role — one subscription,
                       shared everywhere via useAuth(), instead of every component
                       independently subscribing to Supabase auth state
  lib/
    supabase.ts      Supabase client singleton (fails gracefully if unconfigured)
    api/             Typed data-access functions — the only files that call Supabase
                      directly; everything else goes through hooks
      auth.ts             signIn / signUp / signOut / requestPasswordReset
      properties.ts       Listings CRUD + image upload
      inquiries.ts        Submit + admin/self read + status updates
      savedProperties.ts  Favorites CRUD
    validation/      Zod schemas (authSchemas.ts, inquirySchema.ts) — client-side
                      validation; the database's constraints/RLS are the real backstop
    utils.ts         cn() class merge helper, formatPrice()
  hooks/
    useProperties.ts, useInquiries.ts, useSavedProperties.ts   React Query hooks
    useScrolled.ts, useScrollToTop.ts
  types/
    property.ts     UI-facing Property shape (camelCase)
    database.ts     Raw DB row shapes (snake_case) + Supabase Database generic
  data/
    content.ts      Static site copy — nav, stats, process steps, values, office locations
    images.ts       Placeholder photo URLs, referenced by key everywhere they're used
    properties.ts   Not read at runtime — source seed.sql was generated from

supabase/
  migrations/
    0001_init.sql                  Properties, inquiries, storage bucket — run first
    0002_users_and_security.sql    Profiles/roles, saved_properties, hardened RLS,
                                    rate limiting, indexes — run second
  seed.sql                         Optional: loads the original 9 placeholder listings
  functions/send-inquiry-email/    Edge Function that emails you on new inquiries
```

## Design system

- **Colors** — warm "paper" background (#F6F4EE), near-black "ink" text, deep
  "moss" green + "brass" as accent colors. Defined in `tailwind.config.ts`.
- **Type** — Fraunces (display serif) for headlines, Manrope (sans) for body/UI,
  JetBrains Mono for the "spec sheet" motif (prices, coordinates, ref codes).
- **Motion** — Framer Motion throughout: `Reveal` handles scroll-triggered
  fade/lift, `SplitHeadline` staggers the hero title in on load.

## How data and auth flow

`src/lib/api/*.ts` are the only files that import the Supabase client
directly — they translate between the database's snake_case rows and the
camelCase shapes components use. `src/hooks/*.ts` wrap those functions in
React Query (server state: caching, loading states, auto-refetch after a
mutation). `src/context/AuthContext.tsx` is the one place session + role
state lives (client state) — components read it via `useAuth()` rather
than each subscribing to Supabase independently.

If you ever move off Supabase, only `lib/api/*.ts` and `AuthContext`
need to change — every hook, page, and component keeps working against
the same `Property` / `Inquiry` / auth shapes.

## Security model

Row Level Security (enforced by Postgres itself, not the frontend) is
the real security boundary — the frontend route guards (`ProtectedRoute`,
`RequireUser`) are a UX convenience, not the actual gate:

- Anyone can **read** properties and **submit** an inquiry — no login
  needed, that's the public site working as intended.
- Any **signed-in client** can save/unsave properties and read their own
  inquiry history, and nothing else's.
- Only a session whose `profiles.role = 'admin'` can create/edit/delete
  properties, or read/update/delete *any* inquiry.
- There's no path to becoming an admin except a site owner running a SQL
  `update` by hand — see SETUP.md step 3.
- A trigger blocks a client from ever setting their own `role` to
  `'admin'` via a profile update, even if the frontend were compromised.
- Inquiry submissions are capped at 5 per email address per hour
  (spam/abuse guard) and the contact form carries a honeypot field.

Full policies are in `supabase/migrations/0001_init.sql` and
`0002_users_and_security.sql`.

## Deploying

The frontend deploys anywhere that serves a static Vite build (Vercel,
Netlify, etc.) — set the two `VITE_SUPABASE_*` environment variables in
that host's dashboard. The backend (database, auth, storage, email
function) is already deployed the moment you finish SETUP.md.

**Vercel** (recommended, handles client-side routes correctly out of the
box): `npm install -g vercel && vercel`, then add
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in the project's
Environment Variables settings and redeploy.
