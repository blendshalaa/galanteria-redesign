-- =============================================================================
-- 001_rls.sql — Lock down the public catalogue tables
-- =============================================================================
--
-- WHY THIS EXISTS
-- ---------------
-- The site talks to Supabase directly from the browser using the *anon* key.
-- That key is public by design — anyone can read it out of the JavaScript
-- bundle. The only thing that decides what an anonymous visitor may DO with it
-- is Row Level Security.
--
-- Until this file is applied, RLS is off, which means the anon key can INSERT,
-- UPDATE and DELETE every product, project and setting in the database. The
-- password prompt at /admin does not prevent that: it only decides which React
-- component renders, and an attacker never has to load the page at all.
--
-- After this file is applied:
--   * anyone may READ the catalogue (it is a public website)
--   * only a signed-in Supabase Auth user may WRITE anything
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- It is safe to run more than once.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Turn RLS on. Once enabled, the default is DENY EVERYTHING — every operation
-- must be explicitly permitted by a policy below.
-- -----------------------------------------------------------------------------
alter table public.products      enable row level security;
alter table public.projects      enable row level security;
alter table public.hero_images   enable row level security;
alter table public.settings      enable row level security;
alter table public.testimonials  enable row level security;


-- -----------------------------------------------------------------------------
-- Helper: drop a policy if it already exists, so this script can be re-run.
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
  p text;
begin
  foreach t in array array['products','projects','hero_images','settings','testimonials']
  loop
    foreach p in array array['public_read','authenticated_insert','authenticated_update','authenticated_delete']
    loop
      execute format('drop policy if exists %I on public.%I', p, t);
    end loop;
  end loop;
end $$;


-- -----------------------------------------------------------------------------
-- PUBLIC READ
-- The catalogue is a public website. Anonymous visitors must be able to SELECT.
-- -----------------------------------------------------------------------------
create policy public_read on public.products
  for select to anon, authenticated using (true);

create policy public_read on public.projects
  for select to anon, authenticated using (true);

create policy public_read on public.hero_images
  for select to anon, authenticated using (true);

create policy public_read on public.settings
  for select to anon, authenticated using (true);

create policy public_read on public.testimonials
  for select to anon, authenticated using (true);


-- -----------------------------------------------------------------------------
-- AUTHENTICATED WRITE
-- `to authenticated` means the request must carry a valid Supabase Auth JWT.
-- The anon key alone is not enough. This is what actually protects the admin.
--
-- Note: we deliberately do NOT grant anything to the `anon` role here. Any
-- write attempted with just the public key will now fail with a 403.
-- -----------------------------------------------------------------------------
create policy authenticated_insert on public.products
  for insert to authenticated with check (true);
create policy authenticated_update on public.products
  for update to authenticated using (true) with check (true);
create policy authenticated_delete on public.products
  for delete to authenticated using (true);

create policy authenticated_insert on public.projects
  for insert to authenticated with check (true);
create policy authenticated_update on public.projects
  for update to authenticated using (true) with check (true);
create policy authenticated_delete on public.projects
  for delete to authenticated using (true);

create policy authenticated_insert on public.hero_images
  for insert to authenticated with check (true);
create policy authenticated_update on public.hero_images
  for update to authenticated using (true) with check (true);
create policy authenticated_delete on public.hero_images
  for delete to authenticated using (true);

create policy authenticated_insert on public.settings
  for insert to authenticated with check (true);
create policy authenticated_update on public.settings
  for update to authenticated using (true) with check (true);
create policy authenticated_delete on public.settings
  for delete to authenticated using (true);

create policy authenticated_insert on public.testimonials
  for insert to authenticated with check (true);
create policy authenticated_update on public.testimonials
  for update to authenticated using (true) with check (true);
create policy authenticated_delete on public.testimonials
  for delete to authenticated using (true);


-- -----------------------------------------------------------------------------
-- VERIFY
-- Run this afterwards. Every table should show rowsecurity = true and have
-- exactly 4 policies.
-- -----------------------------------------------------------------------------
-- select tablename, rowsecurity from pg_tables
--   where schemaname = 'public'
--     and tablename in ('products','projects','hero_images','settings','testimonials');
--
-- select tablename, policyname, cmd, roles from pg_policies
--   where schemaname = 'public' order by tablename, policyname;
