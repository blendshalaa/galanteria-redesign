-- =============================================================================
-- 005_media.sql — Separate thumbnails from full-size images
-- =============================================================================
--
-- WHY THIS EXISTS
-- ---------------
-- Every grid on the site (category pages, the admin product table, related
-- products) renders `images[0]` — a full-resolution photo — inside a box a few
-- hundred pixels wide. On a category page with 20 products that is 20 full-size
-- downloads to paint a grid of thumbnails.
--
-- From now on the admin uploader writes two derivatives per photo: a 1600px
-- "full" for the detail view and lightbox, and a 600px "thumb" for grids. This
-- column holds the second set, index-aligned with `images`.
--
-- Existing rows are backfilled with the full-size URLs so nothing breaks; the
-- front-end reads `thumbnails?.[0] ?? images?.[0]`, so old products keep working
-- and simply get faster as they are re-saved.
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- It is safe to run more than once.
-- =============================================================================

alter table public.products add column if not exists thumbnails text[];
alter table public.projects add column if not exists thumbnails text[];

-- Backfill: point thumbnails at the existing full-size images for now.
update public.products set thumbnails = images where thumbnails is null;
update public.projects set thumbnails = images where thumbnails is null;


-- -----------------------------------------------------------------------------
-- While we are here: the original migration from src/data/products.js dropped
-- the `name2` field, which held the per-photo product codes ("CH001", "CH002")
-- that Product1.jsx renders as gallery captions. They have been invisible ever
-- since. This column gives them somewhere to live again.
-- -----------------------------------------------------------------------------
alter table public.products add column if not exists image_captions text[];


-- -----------------------------------------------------------------------------
-- VERIFY
--   select name,
--          coalesce(array_length(images,1),0)     as full_images,
--          coalesce(array_length(thumbnails,1),0) as thumbs
--     from public.products limit 20;
-- -----------------------------------------------------------------------------
