# Galanteria Group

Trilingual (Albanian / English / German) furniture catalogue and content-managed
admin panel for Galanteria Group. React 18 + Vite, with Supabase for data,
authentication and image storage.

---

## Quick start

```sh
cd galanteria
npm install
cp .env.example .env      # then fill in the two Supabase values
npm run dev
```

The dev server refuses to start without `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`. That is deliberate: a missing configuration used to
build and deploy "successfully" and render a silently empty catalogue.

**First-time setup on a new Supabase project — follow
[`supabase/README.md`](supabase/README.md).** It covers creating the admin user
and running the SQL migrations, and it includes the security checks that prove
the database is actually locked down. Do not skip step 4.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint, zero-warnings |
| `npm run sitemap` | Regenerate `public/sitemap.xml` from the live catalogue |
| `npm run assets:audit` | Report unreferenced, duplicate and oversized images |
| `npm run assets:optimize` | Downscale and re-encode oversized images in place |

Run `npm run sitemap` before deploying whenever products have been added or
removed, so search engines see the new URLs.

---

## For the client — how to run the site

Everything below is done from **`https://your-site.com/admin`**, signed in with
the email and password you were given. There is no way to break the public site
from here that you cannot undo.

### Adding a product

1. **Produktet** → **Shto Produkt**.
2. Type the **name**. The URL (*slug*) fills itself in — leave it alone unless
   you have a reason to change it.
3. Pick a **category**. If the one you want is not listed, add it first under
   **Kategoritë**.
4. Write the description in **Albanian, English and German**. All three appear
   on the site, each to visitors browsing in that language. Leaving one blank
   means those visitors see one of the others instead.
5. Drag the photos in, or click to browse. Photos are shrunk automatically, so
   you can upload straight from a camera or a phone without resizing anything
   first.
6. **The first photo is the one shown in the grid.** Drag the photos to reorder
   them, or press ★ on any photo to promote it to the front.
7. **Ruaj**. The product is live immediately.

Nothing is uploaded until you press Ruaj — pressing **Anulo** discards
everything cleanly.

### Adding or renaming a category

**Kategoritë** → **Shto Kategori**. Give it a name in all three languages and a
cover photo. It appears straight away in the site menu, the homepage grid, the
footer and the product form.

Use the ↑ ↓ arrows to change the order they appear in. To take a category off
the site without losing its products, untick **Aktive** rather than deleting it.

> Changing a category's **slug** breaks any existing link to that category page —
> including ones already indexed by Google. Rename the *names* freely; leave the
> slug alone once it is live.

### Enquiries

**Kërkesat** is where messages from the contact form and "Request a quote"
buttons arrive. The number beside it is how many you have not read yet.

Open one to see the full message, the email and phone number, and — if it came
from a product page — which product the person was looking at. Reply by email or
phone straight from the buttons, then **Arkivo** it to clear it from the list.

### The homepage

- **Hero Slider** — the large photos at the top. Upload, reorder, delete.
  While this is empty the site falls back to its built-in photos.
- **Cilësimet** — the "Rreth Nesh" introduction text and the client quotes in
  the testimonials carousel.

---

## How the project is put together

```
src/
  Pages/          One folder per route. Admin panel lives in Pages/Admin/.
  Components/     Shared UI: NavBar, Footer, Lightbox, ContactForm, Search,
                  ProductCard, and ui/ for the small primitives.
  Hooks/          useLang, useSEO, useCategories, useSiteContent.
  i18n/ui.js      Interface strings in all three languages.
  lang.js         Marketing copy in all three languages.
  utils/          slugify, imageProcessing (browser-side compression), storage.
  config/         Contact details — one source of truth for phone and email.
  data/           Legacy pre-Supabase dataset. See "Remaining cleanup" below.
supabase/
  README.md       Setup runbook. Start here on a new project.
  migrations/     SQL to run in the Supabase SQL editor, in order.
scripts/          One-off maintenance tools (assets, sitemap).
```

### Security model

The browser talks to Supabase directly using the public *anon* key. That key is
readable by anyone, and it is meant to be. What decides what a visitor can *do*
with it is Row Level Security, defined in `supabase/migrations/001_rls.sql` and
`002_storage.sql`:

- anyone may **read** the catalogue and view images;
- only a signed-in Supabase Auth user may **write** anything;
- the `inquiries` table is asymmetric — the public may submit a form but may not
  read anyone's submissions.

The login screen at `/admin` decides what *renders*. It is not the security
boundary and cannot be. **If the SQL migrations have not been run, the site is
not protected**, regardless of what the login screen does.

### Languages

`src/i18n/ui.js` holds interface strings — loading, empty, error, buttons — and
is what every component uses through `useLang()`'s `t()`. `src/lang.js` holds
longer marketing copy. Product, project and category names come from the
database, which stores all three languages per row.

### Images

Photos uploaded through the admin panel are compressed in the browser before
they are sent: a 1600px WebP for detail views and a 600px WebP for grids
(`src/utils/imageProcessing.js`). An 8 MB camera JPEG typically becomes about
180 KB. This is why the client does not have to think about image sizes.

---

## Remaining cleanup

`src/data/products.js` is the pre-Supabase dataset. It is imported by exactly
one thing — the **Migrimi** tab, which does a one-time import into Supabase —
and it is what keeps roughly 40 MB of images in `src/assets/images/` alive.

**Once you have confirmed the catalogue is in Supabase** (the Migrimi tab shows
you the row counts), you can delete all of it:

```sh
rm src/data/products.js src/Pages/Admin/AdminMigrate.jsx
# then remove the 'migrate' entry from NAV in src/Pages/Admin/AdminDashboard.jsx
# and the src/data/products.js override at the bottom of .eslintrc.cjs
npm run assets:audit -- --delete    # removes the now-orphaned images
npm run build
```

That takes `dist/` from roughly 104 MB to under 70 MB, most of which is then the
three catalogue PDFs in `public/catalogues/`.

---

## Deployment

Vercel, with the SPA rewrite already configured in `vercel.json`. Set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the project's environment
variables.

`VITE_ADMIN_PASSWORD` is no longer read by anything and should be deleted if it
is still set — it belonged to the old client-side password check.
