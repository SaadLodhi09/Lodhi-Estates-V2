# Backend Setup Guide

The site now has a real backend: Supabase (managed Postgres database +
login + file storage — you don't run or maintain a server yourself) and
Resend (sends you an email whenever someone submits the contact form).

Both have generous free tiers, and neither requires ongoing server
maintenance. Follow these steps in order — it takes about 20 minutes the
first time.

---

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free).
2. Click **New Project**. Pick any name (e.g. "lodhi-estates"), a strong
   database password (save it somewhere — you likely won't need it again,
   but keep it safe), and a region close to your users (e.g. Singapore or
   a Gulf region for Pakistan-based traffic).
3. Wait ~2 minutes for the project to finish provisioning.

## 2. Run the database schema

1. In your Supabase project, open **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Open `supabase/migrations/0001_init.sql` from this project, copy
   the whole file, paste it into the editor, and click **Run**.
4. You should see "Success. No rows returned." This created your
   `properties` and `inquiries` tables, locked them down with security
   rules, and set up a storage bucket for photos.

**Optional — launch with example listings:** repeat the same steps with
`supabase/seed.sql` to load the 9 placeholder residences the site shipped
with. Skip this if you'd rather start empty and add your own via the
admin dashboard.

## 3. Create your admin login

There's no public sign-up page by design — only you can create admin
accounts, directly in Supabase:

1. Go to **Authentication** → **Users** in the sidebar.
2. Click **Add User** → **Create new user**.
3. Enter your email and a password. Leave "Auto Confirm User" checked.
4. Click **Create User**.

This is the email/password you'll use to sign in at `/admin/login` on
your site. You can add more admin users the same way later, or come back
here to reset a password.

## 4. Get your API keys

1. Go to **Settings** → **API**.
2. Copy the **Project URL** and the **anon / public** key (not the
   `service_role` key — never put that one in frontend code).
3. In this project folder, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Paste your values into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

Run `npm run dev` now and the site should load listings from your (empty
or seeded) database, and the contact form should successfully save
inquiries — check **Table Editor** → `inquiries` in Supabase after
submitting the form to confirm. Email notifications need steps 5–6 below.

## 5. Set up email notifications (Resend)

1. Go to [resend.com](https://resend.com) and sign up (free tier covers
   plenty of contact-form volume).
2. Go to **API Keys** → **Create API Key**. Copy it — you'll only see it
   once.
3. **Domain verification (recommended):** Under **Domains**, add your
   domain (e.g. `lodhiestates.com`) and follow the DNS instructions from
   your domain registrar. This lets you send from `hello@lodhiestates.com`
   and improves deliverability. Until you do this, Resend's shared test
   domain (`onboarding@resend.dev`) can only deliver to the email address
   you signed up to Resend with — fine for testing, not for real
   customers.

## 6. Deploy the email-sending function

This runs on Supabase's infrastructure (Deno Edge Functions) — not
something you host yourself.

1. Install the Supabase CLI (one-time):
   ```bash
   npm install -g supabase
   ```
2. Log in and link this project to your Supabase project:
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
   Optionally, once your domain is verified in Resend:
   ```bash
   supabase secrets set FROM_EMAIL="Lodhi Estates <hello@lodhiestates.com>"
   ```
4. Deploy the function:
   ```bash
   supabase functions deploy send-inquiry-email
   ```

## 7. Connect the database to the function

Tell Supabase to call the function whenever a new row lands in
`inquiries`:

1. In Supabase Studio, go to **Database** → **Webhooks**.
2. Click **Create a new hook**.
3. Configure:
   - **Name:** `send-inquiry-email`
   - **Table:** `inquiries`
   - **Events:** check only **Insert**
   - **Type:** Supabase Edge Function
   - **Edge Function:** `send-inquiry-email`
4. Save.

Submit a test inquiry through the live site's contact form — you should
receive an email within a few seconds. If not, check **Edge Functions**
→ `send-inquiry-email` → **Logs** in Supabase Studio for the error.

---

## Managing the site day to day

Once deployed (see the main README for hosting), go to
`https://yoursite.com/admin/login` and sign in with the account from
step 3. From there you can:

- **Properties** — add, edit, delete listings; upload photos directly
  (no need to touch code or Unsplash placeholders again)
- **Inquiries** — see every contact-form submission, mark it new /
  contacted / closed, or delete it

## Costs

Both Supabase and Resend have free tiers that comfortably cover a site
like this (a handful of listings, a modest number of monthly inquiries).
You'll only need to pay if traffic grows significantly — check each
provider's pricing page for current thresholds.

## If something's stuck

- **Listings page shows nothing:** confirm `.env.local` has the right
  values and you ran `0001_init.sql` (and `seed.sql` if you want the
  starter listings). Restart `npm run dev` after editing `.env.local`.
- **Can't sign in to /admin:** double check the user was created in
  Authentication → Users with "Auto Confirm" checked.
- **Contact form saves but no email arrives:** check the Edge Function
  logs (step 7) — almost always a missing/incorrect `RESEND_API_KEY` or
  an unverified sender domain.
