-- =====================================================================
-- Lodhi Estates — users, roles, and hardened security
-- Run this in Supabase Studio SQL Editor AFTER 0001_init.sql.
--
-- This migration changes the security model. Previously, ANY logged-in
-- session was treated as admin (fine when only the site owner could log
-- in at all). Now that clients can sign up too, admin access is gated by
-- an explicit role on a `profiles` table instead — see is_admin() below.
-- =====================================================================

-- ---------------------------------------------------------------------
-- profiles — one row per auth.users row, created automatically on signup
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile (role defaults to 'client') whenever someone signs
-- up. SECURITY DEFINER so it can write to public.profiles regardless of
-- the new user's own (not-yet-existent) permissions.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent a client from granting themselves admin via a direct profile
-- update — role can only change when the person making the change is
-- already an admin (see is_admin() below).
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only an admin can change a user''s role';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Backfill profiles for any users created BEFORE this migration ran —
-- including your existing admin account. Without this, the trigger above
-- only creates a profile for users who sign up from now on, and anyone
-- who logged in before today would have no role at all (and so, no
-- access) under the new policies below.
-- ---------------------------------------------------------------------
insert into public.profiles (id, email, full_name)
select id, email, raw_user_meta_data ->> 'full_name'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- is_admin() — the one place "is this session an admin" is decided.
-- SECURITY DEFINER + a fixed search_path so it can read profiles even
-- though profiles' own RLS would otherwise block a client from reading
-- another row (irrelevant here since it only ever checks auth.uid()'s
-- own row, but the fixed search_path also closes a search-path
-- injection vector on SECURITY DEFINER functions).
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

alter table public.profiles enable row level security;

drop policy if exists "profiles are viewable by owner or admin" on public.profiles;
create policy "profiles are viewable by owner or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles are updatable by owner or admin" on public.profiles;
create policy "profiles are updatable by owner or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- ---------------------------------------------------------------------
-- Replace the old "any authenticated session is admin" policies with
-- proper role checks now that clients can log in too.
-- ---------------------------------------------------------------------
drop policy if exists "properties are writable by admins" on public.properties;
create policy "properties are writable by admins"
  on public.properties for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "inquiries are readable by admins" on public.inquiries;
drop policy if exists "inquiries are updatable by admins" on public.inquiries;
drop policy if exists "inquiries are deletable by admins" on public.inquiries;

drop policy if exists "property images are uploadable by admins" on storage.objects;
create policy "property images are uploadable by admins"
  on storage.objects for insert
  with check (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "property images are updatable by admins" on storage.objects;
create policy "property images are updatable by admins"
  on storage.objects for update
  using (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "property images are deletable by admins" on storage.objects;
create policy "property images are deletable by admins"
  on storage.objects for delete
  using (bucket_id = 'property-images' and public.is_admin());

-- ---------------------------------------------------------------------
-- inquiries — link to the submitter when they're logged in, and let
-- them read (but not edit or delete) their own inquiry history.
-- ---------------------------------------------------------------------
alter table public.inquiries add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists inquiries_user_id_idx on public.inquiries (user_id);
create index if not exists inquiries_property_id_idx on public.inquiries (property_id);

-- Replace the old fully-open insert policy: still allow anonymous
-- submissions, but if a user_id is attached, it must be the submitter's
-- own — nobody can attribute an inquiry to someone else's account.
drop policy if exists "anyone can submit an inquiry" on public.inquiries;
create policy "anyone can submit an inquiry"
  on public.inquiries for insert
  with check (user_id is null or user_id = auth.uid());

create policy "inquiries are readable by admins"
  on public.inquiries for select
  using (public.is_admin());

create policy "clients can read their own inquiries"
  on public.inquiries for select
  using (auth.uid() = user_id);

create policy "inquiries are updatable by admins"
  on public.inquiries for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "inquiries are deletable by admins"
  on public.inquiries for delete
  using (public.is_admin());

-- Basic spam / abuse guard: cap submissions per email address. This is a
-- coarse backstop, not a substitute for a CAPTCHA (e.g. Cloudflare
-- Turnstile) if the form starts attracting bots — see SETUP.md.
create or replace function public.check_inquiry_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.inquiries
  where email = new.email
    and created_at > now() - interval '1 hour';

  if recent_count >= 5 then
    raise exception 'Too many inquiries submitted recently — please try again later.';
  end if;

  return new;
end;
$$;

drop trigger if exists inquiries_rate_limit on public.inquiries;
create trigger inquiries_rate_limit
  before insert on public.inquiries
  for each row execute function public.check_inquiry_rate_limit();

-- ---------------------------------------------------------------------
-- saved_properties — a client's favorites/shortlist
-- ---------------------------------------------------------------------
create table if not exists public.saved_properties (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, property_id)
);

create index if not exists saved_properties_user_id_idx on public.saved_properties (user_id);
create index if not exists saved_properties_property_id_idx on public.saved_properties (property_id);

alter table public.saved_properties enable row level security;

create policy "clients manage their own saved properties"
  on public.saved_properties for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Additional indexes for common query/filter patterns
-- ---------------------------------------------------------------------
create index if not exists properties_type_idx on public.properties (type);
create index if not exists profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------
-- One-time step: promote yourself to admin.
--
-- 1. Sign up for a regular account on the live site (or via Supabase
--    Studio -> Authentication -> Add User, same as before).
-- 2. Run this, with your email:
--
--    update public.profiles set role = 'admin' where email = 'you@example.com';
--
-- Do this for every admin account you want — there's still no public
-- "become an admin" flow, by design.
-- ---------------------------------------------------------------------
