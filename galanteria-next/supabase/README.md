# Supabase setup runbook

Follow this once, in order. It takes about 15 minutes. Every SQL file is safe to
run more than once, so if you lose your place you can re-run the whole set.

> **The important thing to understand before you start.** The website talks to
> the database straight from the visitor's browser, using a key called the
> *anon key*. That key is public — anyone can read it out of the page source.
> That is normal and fine, **but only once Row Level Security is switched on**.
> Until you run step 3, anyone on the internet can delete every product on the
> site. The password box at `/admin` does not stop this, because an attacker
> never has to open that page.

---

## 1. Get your project credentials

Supabase Dashboard → your project → **Settings** → **API**.

Copy two values:

| Dashboard label | Goes into |
|---|---|
| Project URL | `VITE_SUPABASE_URL` |
| `anon` `public` key | `VITE_SUPABASE_ANON_KEY` |

**Never** copy the `service_role` key into this project. It bypasses all
security rules, and anything in a `VITE_`-prefixed variable is baked into the
public JavaScript bundle.

Locally, put them in `galanteria/.env` (copy `.env.example` as a starting
point). On Vercel: **Settings** → **Environment Variables** → add both → redeploy.

---

## 2. Create the admin user

Supabase Dashboard → **Authentication** → **Users** → **Add user** → **Create
new user**.

- Enter the client's email address and a strong password.
- Tick **Auto Confirm User** (otherwise they must click a confirmation email
  before they can log in).

Then close the door behind you: **Authentication** → **Providers** → **Email** →
turn **"Enable sign ups"** OFF, and **Save**. Without this, anyone can register
themselves an account — and the security rules in step 3 trust any signed-in
user.

Repeat the "Add user" step for each person who should have admin access. There
is no self-service signup and no password-reset flow in the panel; to reset a
password, use **Authentication → Users → ⋯ → Send password recovery**.

---

## 3. Run the SQL migrations

Supabase Dashboard → **SQL Editor** → **New query**. Paste the contents of each
file, press **Run**, confirm it says "Success", then move to the next one.

| Order | File | What it does |
|---|---|---|
| 1 | `migrations/001_rls.sql` | Turns on Row Level Security. Public can read the catalogue; only signed-in users can change it. |
| 2 | `migrations/002_storage.sql` | Same for the image bucket — public can view photos, only signed-in users can upload or delete. |
| 3 | `migrations/003_categories.sql` | Creates the `categories` table so categories can be managed in the panel instead of in code. Backfills every product. |
| 4 | `migrations/004_inquiries.sql` | Creates the `inquiries` table behind the new contact form. Visitors can submit; only you can read. |
| 5 | `migrations/005_media.sql` | Adds thumbnail and caption columns used by the faster image pipeline. |

### One manual check inside step 3

`003_categories.sql` maps every historical spelling of a category name onto a
stable slug. Before you finish, run this to see if anything was left behind:

```sql
select category, count(*) from public.products
  where category_slug is null group by category order by 2 desc;
```

- **No rows** → done, move on.
- **Some rows** → those are category names the mapping did not recognise,
  usually a typo. Either fix them at the source, or sweep them into "Others"
  with the commented-out `update` at the bottom of that file.

---

## 4. Verify the lock actually holds

This is the step people skip, and it is the only one that proves the site is
secure. Open the **live site** (not the admin panel), make sure you are **signed
out**, and open the browser console.

```js
// Reading the catalogue must still work — it is a public website.
await supabase.from('products').select('id').limit(1)
//  -> { data: [ {...} ], error: null }

// Writing must now fail.
await supabase.from('products').insert([{ name: 'should not work' }])
//  -> error: "new row violates row-level security policy"

await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
//  -> 0 rows affected

// Leads must not be readable by the public.
await supabase.from('inquiries').select('*')
//  -> { data: [], error: null }   <- empty, even if there are leads in the table
```

If any write **succeeds**, RLS is not applied correctly — go back to step 3.

Also confirm the old password is gone from the shipped code:

```sh
npm run build
grep -r "galanteria2024" dist/     # must print nothing
```

---

## 5. Clean up the old setup

Once you can log in with the new email + password:

- Delete the `VITE_ADMIN_PASSWORD` environment variable from Vercel. It is no
  longer read by anything, and leaving it there invites someone to "restore" the
  old insecure login later.

---

## Troubleshooting

**"Missing Supabase environment variables" on startup.**
`.env` is absent or the variable names are misspelled. They must be exactly
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and Vite only reads `.env`
files from the `galanteria/` folder. Restart the dev server after editing — Vite
does not hot-reload env changes.

**Login says "Invalid login credentials".**
The user does not exist, or was created without **Auto Confirm User** and has
not confirmed their email. Check **Authentication → Users**.

**The admin panel loads but saving fails with a row-level-security error.**
You are signed in to the site but the request is not carrying your session.
Sign out and back in. If it persists, confirm `001_rls.sql` created the
`authenticated_insert` / `authenticated_update` policies:

```sql
select tablename, policyname, cmd, roles from pg_policies
  where schemaname = 'public' order by tablename;
```

**Images 404 after upload.**
The `galanteria-images` bucket is not public. Re-run `002_storage.sql`, which
sets `public = true` on it.

**A category page is suddenly empty.**
Check that its products have the right `category_slug`:

```sql
select c.slug, count(p.id) from public.categories c
  left join public.products p on p.category_slug = c.slug
 group by c.slug order by 2;
```
