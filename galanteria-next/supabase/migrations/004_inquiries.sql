-- =============================================================================
-- 004_inquiries.sql — Lead capture
-- =============================================================================
--
-- WHY THIS EXISTS
-- ---------------
-- The site currently has no contact form of any kind. A visitor who wants to
-- buy furniture can only click a phone number, open their mail client, or tap
-- a WhatsApp icon. For a catalogue with no checkout, that is the whole funnel,
-- and none of it is measurable.
--
-- This table backs a real enquiry form on the Contact page and a "Request a
-- quote" button on every product page, with an Inbox tab in the admin panel.
--
-- THE SECURITY SHAPE HERE IS DIFFERENT FROM THE OTHER TABLES — read carefully:
--   * anonymous visitors may INSERT (that is the form) but may NOT SELECT.
--     Without that asymmetry, the public anon key would let anyone download
--     every lead, with names, emails and phone numbers. That is a data breach,
--     not a bug.
--   * only a signed-in admin may read, update or delete.
--
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- It is safe to run more than once.
-- =============================================================================


create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  message       text not null,

  -- Set when the enquiry came from a product page's "Request a quote" button,
  -- so the admin can see what the person was actually looking at.
  product_slug  text,
  product_name  text,

  -- Which language the visitor was browsing in — tells the client which
  -- language to reply in.
  locale        text not null default 'en',

  status        text not null default 'new',
  created_at    timestamptz not null default now(),

  constraint inquiries_status_check check (status in ('new', 'read', 'archived')),
  constraint inquiries_locale_check check (locale in ('sq', 'en', 'de')),

  -- Cheap server-side sanity limits. The form validates too, but the form is
  -- not the security boundary — anyone can POST directly to the REST endpoint.
  constraint inquiries_name_len    check (char_length(name)    between 1 and 120),
  constraint inquiries_email_len   check (char_length(email)   between 3 and 200),
  constraint inquiries_phone_len   check (phone is null or char_length(phone) <= 40),
  constraint inquiries_message_len check (char_length(message) between 1 and 4000),
  constraint inquiries_email_shape check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx  on public.inquiries (status);


-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.inquiries enable row level security;

drop policy if exists anon_can_submit        on public.inquiries;
drop policy if exists authenticated_read     on public.inquiries;
drop policy if exists authenticated_update   on public.inquiries;
drop policy if exists authenticated_delete   on public.inquiries;

-- The public form. INSERT only — note there is deliberately NO select policy
-- for `anon`, so a visitor can post a lead but cannot read anyone else's.
create policy anon_can_submit on public.inquiries
  for insert to anon, authenticated with check (true);

-- The admin Inbox.
create policy authenticated_read on public.inquiries
  for select to authenticated using (true);
create policy authenticated_update on public.inquiries
  for update to authenticated using (true) with check (true);
create policy authenticated_delete on public.inquiries
  for delete to authenticated using (true);


-- -----------------------------------------------------------------------------
-- VERIFY — this is worth actually doing, because getting it wrong leaks leads.
--
-- 1. Signed OUT, in the browser console on the live site:
--        await supabase.from('inquiries').insert([{name:'t',email:'t@t.co',message:'hi'}])
--      -> should SUCCEED
--        await supabase.from('inquiries').select('*')
--      -> should return an EMPTY array (not an error, not rows)
--
-- 2. Signed IN as the admin, the same select should return the rows.
-- -----------------------------------------------------------------------------
