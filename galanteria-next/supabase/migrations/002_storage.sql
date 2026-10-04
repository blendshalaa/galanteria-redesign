-- =============================================================================
-- 002_storage.sql — Lock down the image bucket
-- =============================================================================
--
-- WHY THIS EXISTS
-- ---------------
-- The admin panel uploads product photos to the `galanteria-images` bucket and
-- deletes them again with `storage.remove()`. Both calls go straight from the
-- browser with the public anon key.
--
-- Without the policies below, anyone holding that key (i.e. anyone who has
-- viewed the site's source) can delete every product photo in the bucket.
--
-- After this file is applied:
--   * anyone may VIEW images (they are on a public website)
--   * only a signed-in Supabase Auth user may upload, overwrite or delete
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- It is safe to run more than once.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Make sure the bucket exists and is marked public (public = readable by URL).
-- "Public" here only affects READS. Writes are still governed by the policies
-- below — this is the part that is commonly misunderstood.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('galanteria-images', 'galanteria-images', true)
on conflict (id) do update set public = true;


-- -----------------------------------------------------------------------------
-- Re-runnable: clear any previous version of these policies.
-- -----------------------------------------------------------------------------
drop policy if exists galanteria_images_public_read   on storage.objects;
drop policy if exists galanteria_images_auth_insert   on storage.objects;
drop policy if exists galanteria_images_auth_update   on storage.objects;
drop policy if exists galanteria_images_auth_delete   on storage.objects;


-- -----------------------------------------------------------------------------
-- PUBLIC READ — product photos must load for every visitor.
-- -----------------------------------------------------------------------------
create policy galanteria_images_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'galanteria-images');


-- -----------------------------------------------------------------------------
-- AUTHENTICATED WRITE — upload / replace / delete requires a real login.
-- -----------------------------------------------------------------------------
create policy galanteria_images_auth_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'galanteria-images');

create policy galanteria_images_auth_update on storage.objects
  for update to authenticated
  using (bucket_id = 'galanteria-images')
  with check (bucket_id = 'galanteria-images');

create policy galanteria_images_auth_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'galanteria-images');


-- -----------------------------------------------------------------------------
-- VERIFY
-- -----------------------------------------------------------------------------
-- select policyname, cmd, roles from pg_policies
--   where schemaname = 'storage' and tablename = 'objects'
--     and policyname like 'galanteria_images%';
