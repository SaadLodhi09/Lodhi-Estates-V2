# Backend Setup Guide

The site has a real backend: Supabase (managed Postgres database + login
+ file storage — you don't run or maintain a server yourself) and Resend
(sends you an email whenever someone submits the contact form).

**Already have a live site set up?** This guide is for a fresh setup. If
you're adding the newer client-accounts/security features to a site
that's already live, use [UPGRADING.md](./UPGRADING.md) instead — the
order of operations matters so you don't lock yourself out of your own
admin panel.

Both Supabase and Resend have generous free tiers, and neither requires
ongoing server maintenance. Follow these steps in order — it takes about
25 minutes the first time.

---

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free).
2. Click **New Project**. Pick any name (e.g. "lodhi-estates"), a strong
   database password (save it somewhere safe), and a region close to
   your users (e.g. Singapore or a Gulf region for Pakistan-based
   traffic).
3. Wait ~2 minutes for the project to finish provisioning.

## 2. Run the database schema

Run these two files, in order, in **SQL Editor** → **New Query**:

1. `supabase/migrations/0001_init.sql` — creates `properties` and
   `inquiries`, the public listings/contact-form tables, plus the photo
   storage bucket.
2. `supabase/migrations/0002_users_and_security.sql` — creates
   `profiles` (roles) and `saved_properties` (favorites), and replaces
   the early "any logged-in session is trusted" rules with real
   admin-only checks now that clients can sign up too.

Paste each file's full contents and click **Run**; you should see
"Success. No rows returned" for each.

**Optional — launch with example listings:** also run `supabase/seed.sql`
to load the 9 placeholder residences the site shipped with. Skip this if
you'd rather start empty and add your own via the admin dashboard.

## 3. Create your admin login

Only the designated administrator email is authorized to access `/admin`:

1. Once the site is running (see step 4 below to get that far), go to
   `/account/sign-up` and create an account using your admin email (e.g. `admin@lodhiestates.com` or whatever you specify in `VITE_ADMIN_EMAIL`).
2. Back in Supabase Studio → **SQL Editor**, promote your account:
   ```sql
   update public.profiles set role = 'admin' where email = 'admin@lodhiestates.com';
   ```
3. Sign in at `/admin/login` with your admin email and password.

## 4. Get your API keys and configure environment

1. Go to **Settings** → **API**.
2. Copy the **Project URL** and the **anon / public** key (not the
   `service_role` key — never put that one in frontend code).
3. In this project folder, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Paste your values and configure your authorized admin email into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_EMAIL=admin@lodhiestates.com
   ```

Run `npm run dev` now — the site should load listings from your (empty or
seeded) database, the contact form should save inquiries, and you can
create client + admin accounts as in step 3. Email notifications need
steps 5–7 below.

## 5. Set up email notifications (Resend)

1. Go to [resend.com](https://resend.com) and sign up (free tier covers
   plenty of contact-form volume).
2. Go to **API Keys** → **Create API Key**. Copy it — you'll only see it
   once.
3. **Domain verification (recommended):** under **Domains**, add your
   domain and follow the DNS instructions from your registrar. Until you
   do this, Resend's shared test domain can only deliver to the email
   address you signed up to Resend with — fine for testing, not for real
   customers.

## 6. Deploy the email-sending function

This runs on Supabase's infrastructure (Deno Edge Functions) — not
something you host yourself.

1. Install the Supabase CLI (one-time): `npm install -g supabase`
2. Log in and link this project:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```
   (Find `your-project-ref` in Settings → General → Reference ID.)
3. Set the function's secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_key_here
   supabase secrets set NOTIFY_EMAIL=you@example.com
   ```
4. Deploy: `supabase functions deploy send-inquiry-email`

## 7. Connect the database to the function

1. In Supabase Studio: **Database** → **Webhooks** → **Create a new hook**.
2. Configure: **Table** `inquiries`, **Events** Insert only, **Type**
   Supabase Edge Function, **Edge Function** `send-inquiry-email`.
3. Save, then submit a test inquiry through the live site to confirm you
   get an email. If not, check **Edge Functions** → `send-inquiry-email`
   → **Logs**.

---

## Managing the site day to day

Sign in at `/admin/login` (site admin — listings, all inquiries) or
`/account/sign-in` (client accounts — sign up regular visitors get).
From `/admin` you can:

- **Properties** — add, edit, delete listings; upload photos directly
- **Inquiries** — see every submission, mark new / contacted / closed

## Costs

Both Supabase and Resend have free tiers that comfortably cover a site
like this. You'll only pay if traffic grows significantly — check each
provider's current pricing.

## If something's stuck

- **Listings page shows nothing:** confirm `.env.local` has the right
  values and both migrations ran. Restart `npm run dev` after editing
  `.env.local`.
- **Blank/white screen:** check the browser console (F12) for the actual
  error — the app is built to show a visible error banner or reload
  prompt instead of a silent white screen, so if you're seeing pure
  white, something upstream (like a browser extension or a very old
  browser) may be involved. Share the console error and I can help debug.
- **Can't sign in to `/admin`:** most common cause is forgetting step 3
  (the promote-to-admin SQL) — signing up alone only creates a `client`
  account by design.
- **Contact form saves but no email arrives:** check the Edge Function
  logs (step 7) — almost always a missing/incorrect `RESEND_API_KEY` or
  an unverified sender domain.
