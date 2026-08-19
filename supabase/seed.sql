-- =====================================================================
-- Lodhi Estates — seed data
-- Optional: run this after 0001_init.sql if you want the site to launch
-- with the same 9 placeholder residences it shipped with, instead of an
-- empty listings page. Safe to skip and add your own via /admin instead.
-- =====================================================================

insert into public.properties
  (ref_code, name, location, coordinates, type, status, price, area_sqft, bedrooms, bathrooms, year_built, architect, description, image_url, gallery_urls, featured)
values
  ('LE-014', 'The Khayaban House', 'DHA Phase 6, Lahore', '31.4697° N, 74.4142° E', 'Residence', 'Available', 285000000, 6800, 5, 6, 2023, 'Mirza & Farooq Studio',
   'A low, horizontal composition of poured concrete and teak set behind a walled garden. Deep eaves and a recessed entry court keep the façade quiet from the street.',
   'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1600&auto=format&fit=crop','https://images.unsplash.com/photo-1724582586529-62622e50c0b3?q=80&w=1600&auto=format&fit=crop'],
   true),

  ('LE-021', 'Margalla Ridge Retreat', 'Shah Allah Ditta, Islamabad', '33.7294° N, 73.0079° E', 'Villa', 'Available', 410000000, 9200, 6, 7, 2022, 'Studio Nishat',
   'Built into the lower slope of the Margalla foothills, the house steps down across three levels so every principal room keeps its view of the range.',
   'https://images.unsplash.com/photo-1748063578185-3d68121b11ff?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1600&auto=format&fit=crop','https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=1600&auto=format&fit=crop'],
   true),

  ('LE-009', 'Clifton Edge Residence', 'Clifton Block 2, Karachi', '24.8138° N, 67.0300° E', 'Penthouse', 'Under Offer', 320000000, 5400, 4, 5, 2024, 'Anwer Kazmi Associates',
   'A full-floor residence above the Arabian Sea coastline, with a continuous glass edge that removes the line between terrace and interior.',
   'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?q=80&w=1600&auto=format&fit=crop','https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1600&auto=format&fit=crop'],
   true),

  ('LE-032', 'The Quiet House', 'Bahria Town, Lahore', '31.3728° N, 74.1755° E', 'Villa', 'Available', 195000000, 4600, 4, 5, 2023, 'Mirza & Farooq Studio',
   'A single material — lime-washed brick — carries the whole house, inside and out, broken only by full-height timber doors along the courtyard.',
   'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1600&auto=format&fit=crop'],
   false),

  ('LE-006', 'Sea View Estate', 'Phase 8, DHA Karachi', '24.8047° N, 67.0654° E', 'Estate', 'Available', 560000000, 11500, 7, 8, 2021, 'Studio Nishat',
   'The largest plan in the current collection — a walled compound of three linked pavilions arranged around a lap pool and mature banyan.',
   'https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1724582586529-62622e50c0b3?q=80&w=1600&auto=format&fit=crop','https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=1600&auto=format&fit=crop'],
   false),

  ('LE-018', 'Gulberg Courtyard House', 'Gulberg III, Lahore', '31.5099° N, 74.3436° E', 'Residence', 'Reserved', 240000000, 5900, 5, 5, 2020, 'Anwer Kazmi Associates',
   'Organised around a central planted courtyard that pulls light and air through every room, in the tradition of the old city havelis reworked in concrete.',
   'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1600&auto=format&fit=crop'],
   false),

  ('LE-027', 'The Orchard House', 'Chak Shahzad, Islamabad', '33.6255° N, 73.1074° E', 'Estate', 'Available', 375000000, 8100, 6, 6, 2022, 'Studio Nishat',
   'Set on two acres of working orchard on the city''s edge, with the house pulled to one corner of the plot to leave the trees undisturbed.',
   'https://images.unsplash.com/photo-1628012209120-d9db7abf7eab?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1600&auto=format&fit=crop','https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?q=80&w=1600&auto=format&fit=crop'],
   false),

  ('LE-011', 'Canal View Villa', 'Canal Bank, Lahore', '31.4816° N, 74.3427° E', 'Villa', 'Available', 265000000, 6200, 5, 6, 2024, 'Mirza & Farooq Studio',
   'Elevated on a plinth above the canal''s flood line, with a cantilevered upper storey that shades the pool terrace below through the afternoon.',
   'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1600&auto=format&fit=crop','https://images.unsplash.com/photo-1724582586529-62622e50c0b3?q=80&w=1600&auto=format&fit=crop'],
   false),

  ('LE-004', 'DHA Driveway House', 'DHA Phase 5, Lahore', '31.4818° N, 74.4188° E', 'Residence', 'Available', 215000000, 5200, 4, 5, 2021, 'Anwer Kazmi Associates',
   'A restrained street face gives little away; the house opens fully only at the rear, toward a garden shared by the living and dining wings.',
   'https://images.unsplash.com/photo-1688653802629-5360086bf632?q=80&w=1600&auto=format&fit=crop',
   array['https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=1600&auto=format&fit=crop'],
   false)
on conflict (ref_code) do nothing;
