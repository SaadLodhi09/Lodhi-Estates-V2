# Upgrading an Already-Live Site

You already have a live Supabase project with a working admin login — this
guide is specifically for applying the new client-accounts + security
changes on top of that, without locking yourself out or losing data.

**Read this before running anything.** The short version: run one new SQL
file, then immediately re-promote your own account to admin, in that order.

## What changed

Previously, the database trusted **any logged-in session** as an admin —
fine when only you could log in at all. Now that regular clients can sign
up too, that would let any visitor who creates an account edit your
listings or read every inquiry. So the security model changed to a real
`role` column (`client` or `admin`), checked on every table.

This also adds: client sign-up/sign-in, saved properties (favorites),
per-client inquiry history, spam-limiting on the contact form, and several
missing database indexes.

## Steps

1. **Deploy the updated code** the same way you deployed originally
   (redeploy on Vercel, or wherever it's hosted — pushing to your
   connected Git branch is usually enough to trigger it).

2. **Run the new migration.** In Supabase Studio → SQL Editor → New
   Query, paste the full contents of
   `supabase/migrations/0002_users_and_security.sql` and run it.

   This migration is written to be safe on a database that already has
   real data and an existing admin user — it uses `create table if not
   exists`, `drop policy if exists`, etc., and it **automatically
   backfills a profile row for every existing user**, including the
   admin account you already created. Nobody's access silently breaks
   mid-migration.

3. **Re-confirm your admin role.** The backfill in step 2 gives every
   existing user a profile row, but with the default role of `client` —
   including you. Immediately after running the migration, run this in
   the same SQL Editor (with your real admin email):

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

   Do this for every admin account. Until you do, `/admin` will redirect
   you to the homepage instead of letting you in — that's the new
   role-check working correctly, not a bug.

4. **Verify:**
   - Sign in at `/admin/login` with your existing admin account — you
     should land on the dashboard as before.
   - Visit `/account/sign-up` in an incognito window and create a test
     client account — confirm you can save a property and see it appear
     in "My Account", and that this account does **not** have access to
     `/admin`.

## If you used a different schema than what's in `supabase/migrations/`

Since this went through a round of changes with help from Gemini, it's
possible your live database's schema doesn't match `0001_init.sql` /
`0002_users_and_security.sql` exactly (different column names, missing
tables, etc.). If step 2 errors out:

- Open **Table Editor** in Supabase Studio and compare your actual
  `properties` / `inquiries` columns against `0001_init.sql` — the error
  message from the failed statement will usually point at the mismatch.
- The safest fix is usually to adjust the migration's column names to
  match what you already have, rather than renaming live columns out from
  under existing data. Paste me the exact error and I can help patch the
  migration to fit your actual schema instead of the other way around.

## New environment variables

None — this upgrade only adds new tables/policies and new frontend
routes. Your existing `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
don't change.
