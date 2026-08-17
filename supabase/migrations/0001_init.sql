-- =====================================================================
-- Lodhi Estates — initial schema
-- Run this once in Supabase Studio: SQL Editor -> New Query -> paste -> Run
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------
create table if not exists public.properties (
  id           uuid primary key default gen_random_uuid(),
  ref_code     text unique not null,
  name         text not null,
  location     text not null,
  coordinates  text,
  type         text not null check (type in ('Villa', 'Residence', 'Penthouse', 'Estate')),
  status       text not null default 'Available' check (status in ('Available', 'Under Offer', 'Reserved')),
  price        bigint not null check (price >= 0),
  area_sqft    integer not null check (area_sqft > 0),
  bedrooms     integer not null default 0,
  bathrooms    integer not null default 0,
  year_built   integer,
  architect    text,
  description  text,
  image_url    text,
  gallery_urls text[] not null default '{}',
  featured     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists properties_featured_idx on public.properties (featured);
create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_created_at_idx on public.properties (created_at desc);

-- keep updated_at current on every edit
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- inquiries  (submitted from the public contact form)
-- ---------------------------------------------------------------------
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  interest    text,
  message     text not null,
  property_id uuid references public.properties(id) on delete set null,
  status      text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at  timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- Model: this is a single-admin site. There is no public sign-up — you
-- create your one admin login by hand in Studio (Authentication -> Users
-- -> Add user). Any authenticated session is therefore trusted as admin.
-- ---------------------------------------------------------------------
alter table public.properties enable row level security;
alter table public.inquiries  enable row level security;

-- properties: anyone can read (it's the public listings site)
drop policy if exists "properties are publicly readable" on public.properties;
create policy "properties are publicly readable"
  on public.properties for select
  using (true);

-- properties: only a logged-in admin can write
drop policy if exists "properties are writable by admins" on public.properties;
create policy "properties are writable by admins"
  on public.properties for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- inquiries: anyone can submit the contact form
drop policy if exists "anyone can submit an inquiry" on public.inquiries;
create policy "anyone can submit an inquiry"
  on public.inquiries for insert
  with check (true);

-- inquiries: only a logged-in admin can read or manage them
drop policy if exists "inquiries are readable by admins" on public.inquiries;
create policy "inquiries are readable by admins"
  on public.inquiries for select
  using (auth.role() = 'authenticated');

drop policy if exists "inquiries are updatable by admins" on public.inquiries;
create policy "inquiries are updatable by admins"
  on public.inquiries for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "inquiries are deletable by admins" on public.inquiries;
create policy "inquiries are deletable by admins"
  on public.inquiries for delete
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- Storage bucket for property photos
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "property images are publicly readable" on storage.objects;
create policy "property images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'property-images');

drop policy if exists "property images are uploadable by admins" on storage.objects;
create policy "property images are uploadable by admins"
  on storage.objects for insert
  with check (bucket_id = 'property-images' and auth.role() = 'authenticated');

drop policy if exists "property images are updatable by admins" on storage.objects;
create policy "property images are updatable by admins"
  on storage.objects for update
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');

drop policy if exists "property images are deletable by admins" on storage.objects;
create policy "property images are deletable by admins"
  on storage.objects for delete
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');
