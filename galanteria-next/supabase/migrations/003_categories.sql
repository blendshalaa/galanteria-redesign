-- =============================================================================
-- 003_categories.sql — Make categories data instead of hardcoded strings
-- =============================================================================
--
-- WHY THIS EXISTS
-- ---------------
-- Today a product's category is a free-text display name typed into a dropdown
-- that is hardcoded in the JavaScript (AdminProducts.jsx). Three consequences:
--
--   1. Adding a category requires a developer, a code change and a redeploy.
--   2. The public site matches products by comparing that display string
--      exactly. Any drift in a diacritic silently empties a whole category —
--      which already happened, and is why CategoryPage.jsx carries a hardcoded
--      `.in(['Tavolinë Pune','Tavolina Pune','Arbeits Tisch','Arbeits Tische'])`
--      workaround for one category.
--   3. The category heading on every category page is a hardcoded Albanian
--      literal, shown to English and German visitors too.
--
-- This migration introduces a real `categories` table with one stable `slug`
-- and three translated names, and backfills a `category_slug` column on
-- products so lookups stop depending on how someone typed an "ë".
--
-- The old free-text `products.category` column is deliberately LEFT IN PLACE.
-- Do not drop it until the new code has been running in production for a
-- release; the DROP statement is provided, commented out, at the bottom.
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- It is safe to run more than once.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- The table
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,          -- stable, URL-safe, never translated
  name_sq     text not null,
  name_en     text not null,
  name_de     text not null,
  image_url   text,                          -- cover photo for the homepage grid
  sort_order  integer not null default 0,
  is_active   boolean not null default true, -- hide a category without deleting it
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_sort_idx on public.categories (sort_order);


-- -----------------------------------------------------------------------------
-- Seed the ten categories the site already has.
-- Names are lifted from src/lang.js so nothing visible changes for visitors.
-- `on conflict (slug) do nothing` makes this safe to re-run — it will not
-- overwrite names the client has since edited in the admin panel.
-- -----------------------------------------------------------------------------
insert into public.categories (slug, name_sq, name_en, name_de, sort_order) values
  ('working-tables',  'Tavolina Pune',      'Working Tables',  'Arbeits Tische',       1),
  ('meeting-tables',  'Tavolina Takimesh',  'Meeting Tables',  'Besprechungs Tische',  2),
  ('drawers',         'Sirtarët',           'Drawers',         'Schubladen',           3),
  ('office-chairs',   'Karrige Zyreje',     'Office Chairs',   'Büro Stühle',          4),
  ('meeting-chairs',  'Karrige Takimesh',   'Meeting Chairs',  'Besprechungs Stühle',  5),
  ('waiting-chairs',  'Karrige Pritjeje',   'Waiting Chairs',  'Warte Stühle',         6),
  ('cabinets',        'Kabinete',           'Cabinets',        'Schränke',             7),
  ('workstations',    'Ambiente Pune',      'Workstations',    'Arbeits Plätze',       8),
  ('bathrooms',       'Banjë',              'Bathrooms',       'Badezimmer',           9),
  ('others',          'Të tjera',           'Others',          'Andere',              10)
on conflict (slug) do nothing;


-- -----------------------------------------------------------------------------
-- Add the FK-ish column to products and projects.
-- We store the slug rather than a uuid: it keeps the admin simple, keeps URLs
-- readable, and means a category rename never has to touch the products table.
-- -----------------------------------------------------------------------------
alter table public.products add column if not exists category_slug text;

create index if not exists products_category_slug_idx on public.products (category_slug);


-- -----------------------------------------------------------------------------
-- BACKFILL — map every historical spelling to its slug.
--
-- These are the exact values produced by the original data/products.js
-- migration (Albanian, with the "Tavolinë"/"Tavolina" split), plus the German
-- and English display names, plus the values the hardcoded admin dropdown
-- could produce. `lower(trim(...))` absorbs casing and whitespace drift.
--
-- Only rows whose category_slug is still null are touched, so re-running this
-- will never stomp a category a human has since corrected in the admin panel.
-- -----------------------------------------------------------------------------
update public.products set category_slug = case lower(trim(category))

  when 'karrigë zyreje'       then 'office-chairs'
  when 'karrige zyreje'       then 'office-chairs'
  when 'office chairs'        then 'office-chairs'
  when 'büro stühle'          then 'office-chairs'

  when 'karrigë takimesh'     then 'meeting-chairs'
  when 'karrige takimesh'     then 'meeting-chairs'
  when 'meeting chairs'       then 'meeting-chairs'
  when 'besprechungs stühle'  then 'meeting-chairs'

  when 'karrigë pritjeje'     then 'waiting-chairs'
  when 'karrige pritjeje'     then 'waiting-chairs'
  when 'waiting chairs'       then 'waiting-chairs'
  when 'warte stühle'         then 'waiting-chairs'

  -- the four spellings that forced the .in([...]) hack in CategoryPage.jsx
  when 'tavolinë pune'        then 'working-tables'
  when 'tavolina pune'        then 'working-tables'
  when 'arbeits tisch'        then 'working-tables'
  when 'arbeits tische'       then 'working-tables'
  when 'working tables'       then 'working-tables'

  when 'tavolina takimi'      then 'meeting-tables'
  when 'tavolina takimesh'    then 'meeting-tables'
  when 'meeting tables'       then 'meeting-tables'
  when 'besprechungs tische'  then 'meeting-tables'

  when 'workstation'          then 'workstations'
  when 'workstations'         then 'workstations'
  when 'ambiente pune'        then 'workstations'
  when 'arbeits plätze'       then 'workstations'

  when 'dollapë'              then 'cabinets'
  when 'dollape'              then 'cabinets'
  when 'kabinete'             then 'cabinets'
  when 'cabinets'             then 'cabinets'
  when 'schränke'             then 'cabinets'

  when 'sirtar'               then 'drawers'
  when 'sirtarët'             then 'drawers'
  when 'drawers'              then 'drawers'
  when 'schubladen'           then 'drawers'

  when 'banjë'                then 'bathrooms'
  when 'banje'                then 'bathrooms'
  when 'bathrooms'            then 'bathrooms'
  when 'badezimmer'           then 'bathrooms'

  when 'tjera'                then 'others'
  when 'të tjera'             then 'others'
  when 'others'               then 'others'
  when 'andere'               then 'others'

  else null
end
where category_slug is null;


-- -----------------------------------------------------------------------------
-- Anything the mapping did not recognise lands in "others" rather than
-- disappearing from the site entirely. Check the report below before trusting
-- this — an unexpected value usually means a typo worth fixing at the source.
-- -----------------------------------------------------------------------------
-- REPORT: run this FIRST and look at the output before running the UPDATE below.
--
--   select category, count(*) from public.products
--     where category_slug is null group by category order by 2 desc;
--
-- Then, once you are happy:
--
--   update public.products set category_slug = 'others' where category_slug is null;


-- -----------------------------------------------------------------------------
-- RLS for the new table (same shape as 001_rls.sql: public read, auth write)
-- -----------------------------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists public_read           on public.categories;
drop policy if exists authenticated_insert  on public.categories;
drop policy if exists authenticated_update  on public.categories;
drop policy if exists authenticated_delete  on public.categories;

create policy public_read on public.categories
  for select to anon, authenticated using (true);
create policy authenticated_insert on public.categories
  for insert to authenticated with check (true);
create policy authenticated_update on public.categories
  for update to authenticated using (true) with check (true);
create policy authenticated_delete on public.categories
  for delete to authenticated using (true);


-- -----------------------------------------------------------------------------
-- VERIFY
-- -----------------------------------------------------------------------------
-- Every category and how many products landed in it:
--
--   select c.slug, c.name_en, count(p.id) as products
--     from public.categories c
--     left join public.products p on p.category_slug = c.slug
--    group by c.slug, c.name_en, c.sort_order
--    order by c.sort_order;
--
-- Anything still unmapped (should be zero rows):
--
--   select id, name, category from public.products where category_slug is null;


-- -----------------------------------------------------------------------------
-- LATER — only after the new code has shipped and the report above is clean:
--
--   alter table public.products drop column category;
-- -----------------------------------------------------------------------------
