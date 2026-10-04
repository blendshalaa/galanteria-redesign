'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/actions';
import { Spinner } from '@/components/ui/states';
import { Toast } from '@/components/ui/Toast';
import { slugify, isValidSlug } from '@/utils/slugify';
import { uploadImages, removeByUrls, allImageUrls } from '@/utils/storage';
import { formatBytes } from '@/utils/imageProcessing';
import useAdminCategories from '../useAdminCategories';
import ImageUploader from '../ImageUploader';
import { Modal, Field } from '../Modal';
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from '../icons';
import { adminBtn, card, emptyState, field, iconBtn, iconBtnDanger, pageHeader, table } from '../ui';

const PAGE_SIZE = 25;
const THUMB_PLACEHOLDER = 'https://placehold.co/52x52/1a1815/555?text=?';

/**
 * Product CRUD.
 *
 * Carried over from the rewrite this replaces:
 *   - the category dropdown reads the `categories` table. It was a hardcoded
 *     ten-item array, so adding a category needed a code change and a deploy;
 *   - images upload on save, not on file-select — picking photos and then
 *     pressing "Anulo" used to leave them in the bucket forever, referenced by
 *     nothing;
 *   - upload errors are reported. Every one of them was swallowed by an
 *     `if (!error)` with no else branch;
 *   - an empty name shows a message. `handleSave` used to return silently, so
 *     the button appeared to do nothing at all;
 *   - slugs survive Albanian, and uniqueness is checked while you type: two
 *     products sharing a slug broke the public product page outright;
 *   - the list is paged. It was `select('*')` with no limit, on every visit.
 */
export default function AdminProducts() {
  const { categories, loading: categoriesLoading } = useAdminCategories();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const categoryNames = useMemo(() => {
    const map = {};
    categories.forEach((category) => {
      map[category.slug] = category.name_sq;
    });
    return map;
  }, [categories]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (search.trim()) {
      const escaped = search.trim().replace(/[%_\\]/g, (ch) => `\\${ch}`);
      query = query.ilike('name', `%${escaped}%`);
    }
    if (filter !== 'all') query = query.eq('category_slug', filter);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Galanteria] Failed to load products', error);
      showToast('Nuk u ngarkuan produktet.', 'error');
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => {
    // Debounced so typing in the search box does not fire a query per keypress.
    const timer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    setPage(0);
  }, [search, filter]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Jeni i sigurt që doni të fshini "${product.name}"?`)) return;

    setDeleting(product.id);

    const { error } = await supabase.from('products').delete().eq('id', product.id);

    if (error) {
      setDeleting(null);
      showToast(`Gabim gjatë fshirjes: ${error.message}`, 'error');
      return;
    }

    // Delete the row first, then its files — the other order can leave a
    // product pointing at images that no longer exist.
    await removeByUrls(allImageUrls(product));

    setDeleting(null);
    setProducts((previous) => previous.filter((entry) => entry.id !== product.id));
    setTotal((previous) => Math.max(0, previous - 1));
    showToast('Produkti u fshi me sukses!');
    await revalidateSite();
  };

  const handleSaved = async (type, message) => {
    setEditing(null);
    if (type === 'success') {
      showToast('Produkti u ruajt me sukses!');
      await revalidateSite();
      fetchProducts();
    } else {
      showToast(message || 'Gabim gjatë ruajtjes.', 'error');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className={pageHeader}>
        <p className="text-base text-ink-muted">{total} produkte gjithsej</p>
        <button type="button" onClick={() => setEditing('new')} disabled={categoriesLoading} className={adminBtn('primary')}>
          <PlusIcon />
          Shto Produkt
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            <SearchIcon />
          </span>
          <input
            placeholder="Kërko produkt..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Kërko produkt"
            className={`${field.control} pl-10`}
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filtro sipas kategorisë"
          className={`${field.control} w-auto cursor-pointer`}
        >
          <option value="all">Të gjitha kategoritë</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name_sq}
            </option>
          ))}
        </select>
      </div>

      <div className={card}>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-ink-muted">
            <Spinner /> Duke ngarkuar...
          </div>
        ) : products.length === 0 ? (
          <div className={emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="text-ink/18">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
            <h3 className="text-[1.05rem] font-semibold text-ink">
              {search || filter !== 'all' ? 'Asnjë rezultat' : 'Asnjë produkt'}
            </h3>
            <p>
              {search || filter !== 'all'
                ? 'Provoni një kërkim tjetër.'
                : 'Shto produktin e parë duke klikuar "Shto Produkt"'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={table.root}>
              <thead>
                <tr>
                  {['Foto', 'Emri', 'Kategoria', 'Fotot', 'Veprimet'].map((heading) => (
                    <th key={heading} className={table.head}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className={table.row}>
                    <td className={table.cell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.thumbnails?.[0] || product.images?.[0] || THUMB_PLACEHOLDER}
                        alt=""
                        loading="lazy"
                        className={table.thumb}
                      />
                    </td>
                    <td className={table.cell}>
                      <div className={table.name}>{product.name}</div>
                      <div className={table.sub}>/{product.slug}</div>
                    </td>
                    <td className={table.cell}>
                      <span className="rounded-full bg-white/6 px-2.5 py-1 text-sm text-ink-soft">
                        {categoryNames[product.category_slug] || product.category || '—'}
                      </span>
                    </td>
                    <td className={table.cell}>{product.images?.length || 0} foto</td>
                    <td className={table.cell}>
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => setEditing(product)} title="Edito" className={iconBtn}>
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id}
                          title="Fshi"
                          className={iconBtnDanger}
                        >
                          {deleting === product.id ? <Spinner size={14} /> : <TrashIcon />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 text-base text-ink-muted">
            <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className={adminBtn('ghost')}>
              ← Para
            </button>
            <span>
              Faqja {page + 1} nga {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={adminBtn('ghost')}
            >
              Pas →
            </button>
          </div>
        )}
      </div>

      {editing && (
        <ProductModal
          product={editing === 'new' ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function ProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_slug: product?.category_slug || categories[0]?.slug || '',
    description: product?.description || '',
    description_sq: product?.description_sq || '',
    description_de: product?.description_de || '',
  });

  // Existing images are stored as two parallel arrays in the database; pair
  // them up so a photo and its thumbnail move and delete together.
  const [images, setImages] = useState(() =>
    (product?.images || []).map((url, i) => ({ url, thumbUrl: product?.thumbnails?.[i] || url }))
  );
  const [staged, setStaged] = useState([]);
  const [removed, setRemoved] = useState([]);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [slugTaken, setSlugTaken] = useState(false);

  const dirtyRef = useRef(false);
  const markDirty = () => {
    dirtyRef.current = true;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    markDirty();

    setForm((current) => {
      const next = { ...current, [name]: value };
      // Only derive the slug for new products, so an existing URL is never
      // silently rewritten by an edit to the name.
      if (name === 'name' && !product?.id) next.slug = slugify(value);
      return next;
    });

    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  /* Live uniqueness check. Two products sharing a slug made the public product
     page fail outright, because it looked the row up with `.single()`. */
  useEffect(() => {
    const candidate = form.slug.trim();
    if (!candidate || !isValidSlug(candidate)) {
      setSlugTaken(false);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      let query = supabase.from('products').select('id').eq('slug', candidate).limit(1);
      if (product?.id) query = query.neq('id', product.id);

      const { data } = await query;
      if (!cancelled) setSlugTaken(Boolean(data?.length));
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.slug, product?.id]);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Emri është i detyrueshëm.';
    if (!form.slug.trim()) next.slug = 'Adresa në faqe është e detyrueshme.';
    else if (!isValidSlug(form.slug.trim())) next.slug = 'Lejohen vetëm shkronja të vogla, numra dhe vizë (-).';
    else if (slugTaken) next.slug = 'Ky slug është i zënë nga një produkt tjetër.';
    if (!form.category_slug) next.category_slug = 'Zgjidhni një kategori.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    if (dirtyRef.current || staged.length) {
      const confirmed = window.confirm('Keni ndryshime të paruajtura. Jeni i sigurt që doni t’i mbyllni?');
      if (!confirmed) return;
    }
    // Anything removed in this session but not saved stays in storage — the
    // record still points at it.
    onClose();
  };

  const handleSave = async () => {
    if (!validate() || saving) return;

    setSaving(true);

    let finalImages = images;

    // Upload the staged files now, not when they were picked.
    if (staged.length) {
      setUploading(true);
      const { uploaded, failed, savedBytes } = await uploadImages(staged, 'products', setProgress);
      setUploading(false);
      setProgress(null);

      if (failed.length) {
        setSaving(false);
        onSaved('error', `${failed.length} foto nuk u ngarkuan: ${failed[0].message}`);
        return;
      }

      finalImages = [...images, ...uploaded];
      if (savedBytes > 0) {
        console.info(`[Galanteria] Image compression saved ${formatBytes(savedBytes)}`);
      }
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim(),
      images: finalImages.map((image) => image.url),
      thumbnails: finalImages.map((image) => image.thumbUrl || image.url),
      updated_at: new Date().toISOString(),
    };

    const { error } = product?.id
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert([{ ...payload, created_at: new Date().toISOString() }]);

    setSaving(false);

    if (error) {
      onSaved('error', error.message);
      return;
    }

    // Only now is it safe to delete the files the user removed.
    if (removed.length) await removeByUrls(removed);

    onSaved('success');
  };

  const handleRemoveExisting = (next) => {
    markDirty();
    const stillPresent = new Set(next.map((image) => image.url));
    const dropped = images
      .filter((image) => !stillPresent.has(image.url))
      .flatMap((image) => [image.url, image.thumbUrl].filter(Boolean));

    setRemoved((previous) => [...previous, ...dropped]);
    setImages(next);
  };

  const busy = saving || uploading;

  return (
    <Modal
      title={product?.id ? 'Edito Produktin' : 'Shto Produkt të Ri'}
      onClose={handleClose}
      footer={
        <>
          <button type="button" onClick={handleClose} disabled={busy} className={adminBtn('ghost')}>
            Anulo
          </button>
          <button type="button" onClick={handleSave} disabled={busy} className={adminBtn('primary')}>
            {busy ? <Spinner size={14} /> : null}
            {uploading ? 'Duke ngarkuar fotot...' : saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Emri i Produktit *" htmlFor="p-name" error={errors.name}>
          <input
            id="p-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="p.sh. Light, Giulia..."
            aria-invalid={Boolean(errors.name)}
            className={field.control}
          />
        </Field>

        <Field
          label="Adresa në faqe *"
          htmlFor="p-slug"
          error={errors.slug || (slugTaken ? 'Kjo adresë përdoret nga një produkt tjetër.' : null)}
          hint={form.slug && `/product/${form.slug}`}
        >
          <input
            id="p-slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="light"
            aria-invalid={Boolean(errors.slug) || slugTaken}
            className={field.control}
          />
        </Field>
      </div>

      <Field
        label="Kategoria *"
        htmlFor="p-category"
        error={errors.category_slug}
        hint={categories.length === 0 ? 'Asnjë kategori. Shtoni një te skeda “Kategoritë”.' : null}
      >
        <select
          id="p-category"
          name="category_slug"
          value={form.category_slug}
          onChange={handleChange}
          aria-invalid={Boolean(errors.category_slug)}
          className={`${field.control} cursor-pointer`}
        >
          <option value="">— Zgjidh —</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name_sq}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Përshkrimi (Shqip)" htmlFor="p-desc-sq">
        <textarea
          id="p-desc-sq"
          name="description_sq"
          value={form.description_sq}
          onChange={handleChange}
          rows={3}
          placeholder="Shkruani përshkrimin shqip..."
          className={`${field.control} resize-y`}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Përshkrimi (English)" htmlFor="p-desc-en">
          <textarea
            id="p-desc-en"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="English description..."
            className={`${field.control} resize-y`}
          />
        </Field>
        <Field label="Përshkrimi (Deutsch)" htmlFor="p-desc-de">
          <textarea
            id="p-desc-de"
            name="description_de"
            value={form.description_de}
            onChange={handleChange}
            rows={3}
            placeholder="Deutsche Beschreibung..."
            className={`${field.control} resize-y`}
          />
        </Field>
      </div>

      <ImageUploader
        existing={images}
        staged={staged}
        onChangeExisting={handleRemoveExisting}
        onChangeStaged={(next) => {
          markDirty();
          setStaged(next);
        }}
        uploading={uploading}
        progress={progress}
      />
    </Modal>
  );
}
