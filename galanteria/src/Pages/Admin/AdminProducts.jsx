import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import useCategories from '../../Hooks/useCategories';
import { Spinner, Toast } from '../../Components/ui';
import ImageUploader from './components/ImageUploader';
import { slugify, isValidSlug } from '../../utils/slugify';
import { uploadImages, removeByUrls, allImageUrls } from '../../utils/storage';
import { formatBytes } from '../../utils/imageProcessing';
import './AdminDashboard.scss';

const PAGE_SIZE = 25;

/**
 * Product CRUD.
 *
 * Fixed here:
 *   - the category dropdown was a hardcoded 10-item array, so adding a
 *     category needed a code change and a redeploy. It reads the `categories`
 *     table now;
 *   - images uploaded on file-select, before save, orphaning files in storage
 *     on cancel. They upload on save;
 *   - every upload error was swallowed by `if (!error)` with no else;
 *   - `handleSave` returned silently on an empty name, so the button appeared
 *     to do nothing. There is inline validation;
 *   - slug generation deleted Albanian diacritics ("Karrigë" -> "karrig") and
 *     nothing checked uniqueness, which breaks the product page;
 *   - `select('*')` with no limit on every visit.
 */

const ProductModal = ({ product, categories, onClose, onSaved }) => {
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
    (product?.images || []).map((url, i) => ({
      url,
      thumbUrl: product?.thumbnails?.[i] || url,
    }))
  );
  const [staged, setStaged] = useState([]);
  const [removed, setRemoved] = useState([]);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [slugTaken, setSlugTaken] = useState(false);

  const dirtyRef = useRef(false);

  const markDirty = () => { dirtyRef.current = true; };

  const handleChange = (event) => {
    const { name, value } = event.target;
    markDirty();

    setForm((f) => {
      const next = { ...f, [name]: value };
      // Only auto-derive the slug for new products, and only while the user
      // has not hand-edited it.
      if (name === 'name' && !product?.id) next.slug = slugify(value);
      return next;
    });

    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  /* Live uniqueness check. Two products sharing a slug made the public product
     page fail, because it looked the row up with `.single()`. */
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

    return () => { cancelled = true; clearTimeout(timer); };
  }, [form.slug, product?.id]);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Emri është i detyrueshëm.';
    if (!form.slug.trim()) next.slug = 'Adresa në faqe është e detyrueshme.';
    else if (!isValidSlug(form.slug.trim())) {
      next.slug = 'Lejohen vetëm shkronja të vogla, numra dhe vizë (-).';
    } else if (slugTaken) {
      next.slug = 'Ky slug është i zënë nga një produkt tjetër.';
    }
    if (!form.category_slug) next.category_slug = 'Zgjidhni një kategori.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = async () => {
    if (dirtyRef.current || staged.length) {
      const confirmed = window.confirm(
        'Keni ndryshime të paruajtura. Jeni i sigurt që doni t’i mbyllni?'
      );
      if (!confirmed) return;
    }
    // Anything the user removed in this session but did not save should stay
    // in storage — the record still points at it.
    onClose();
  };

  const handleSave = async () => {
    if (!validate() || saving) return;

    setSaving(true);

    let finalImages = images;

    // Upload the staged files now, not when they were picked.
    if (staged.length) {
      setUploading(true);
      const { uploaded, failed, savedBytes } = await uploadImages(
        staged,
        'products',
        setProgress
      );
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
      : await supabase
          .from('products')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);

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

    setRemoved((prev) => [...prev, ...dropped]);
    setImages(next);
  };

  const busy = saving || uploading;

  return (
    <div
      className="admin-modal-overlay"
      onClick={(event) => event.target === event.currentTarget && handleClose()}
    >
      <div className="admin-modal modal-lg" role="dialog" aria-modal="true" aria-label="Produkti">
        <div className="modal-header">
          <h3>{product?.id ? 'Edito Produktin' : 'Shto Produkt të Ri'}</h3>
          <button className="modal-close" onClick={handleClose} aria-label="Mbyll">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="p-name">Emri i Produktit *</label>
              <input
                id="p-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="p.sh. Light, Giulia..."
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="p-slug">Adresa në faqe *</label>
              <input
                id="p-slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="light"
                aria-invalid={Boolean(errors.slug) || slugTaken}
              />
              {errors.slug ? (
                <span className="field-error">{errors.slug}</span>
              ) : slugTaken ? (
                <span className="field-error">Kjo adresë përdoret nga një produkt tjetër.</span>
              ) : (
                form.slug && <span className="field-hint">/product/{form.slug}</span>
              )}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="p-category">Kategoria *</label>
            <select
              id="p-category"
              name="category_slug"
              value={form.category_slug}
              onChange={handleChange}
              aria-invalid={Boolean(errors.category_slug)}
            >
              <option value="">— Zgjidh —</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name_sq}
                </option>
              ))}
            </select>
            {errors.category_slug && <span className="field-error">{errors.category_slug}</span>}
            {categories.length === 0 && (
              <span className="field-hint">
                Asnjë kategori. Shtoni një te skeda “Kategoritë”.
              </span>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="p-desc-sq">Përshkrimi (Shqip)</label>
            <textarea
              id="p-desc-sq"
              name="description_sq"
              value={form.description_sq}
              onChange={handleChange}
              rows={3}
              placeholder="Shkruani përshkrimin shqip..."
            />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="p-desc-en">Përshkrimi (English)</label>
              <textarea
                id="p-desc-en"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="English description..."
              />
            </div>
            <div className="field-group">
              <label htmlFor="p-desc-de">Përshkrimi (Deutsch)</label>
              <textarea
                id="p-desc-de"
                name="description_de"
                value={form.description_de}
                onChange={handleChange}
                rows={3}
                placeholder="Deutsche Beschreibung..."
              />
            </div>
          </div>

          <ImageUploader
            existing={images}
            staged={staged}
            onChangeExisting={handleRemoveExisting}
            onChangeStaged={(next) => { markDirty(); setStaged(next); }}
            uploading={uploading}
            progress={progress}
          />
        </div>

        <div className="modal-footer">
          <button className="admin-btn secondary" onClick={handleClose} disabled={busy}>
            Anulo
          </button>
          <button className="admin-btn primary" onClick={handleSave} disabled={busy}>
            {busy ? <Spinner size={14} /> : null}
            {uploading ? 'Duke ngarkuar fotot...' : saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const { categories, loading: categoriesLoading } = useCategories({ activeOnly: false });

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const categoryNames = useMemo(() => {
    const map = {};
    categories.forEach((c) => { map[c.slug] = c.name_sq; });
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

  useEffect(() => { setPage(0); }, [search, filter]);

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
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setTotal((prev) => Math.max(0, prev - 1));
    showToast('Produkti u fshi me sukses!');
  };

  const handleSaved = (type, message) => {
    setModal(null);
    if (type === 'success') {
      showToast('Produkti u ruajt me sukses!');
      fetchProducts();
    } else {
      showToast(message || 'Gabim gjatë ruajtjes.', 'error');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <p>{total} produkte gjithsej</p>
        </div>
        <button
          className="admin-btn primary"
          onClick={() => setModal('new')}
          disabled={categoriesLoading}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Shto Produkt
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Kërko produkt..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Kërko produkt"
          />
        </div>
        <select
          className="admin-select"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filtro sipas kategorisë"
        >
          <option value="all">Të gjitha kategoritë</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name_sq}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><Spinner />Duke ngarkuar...</div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
            <h3>{search || filter !== 'all' ? 'Asnjë rezultat' : 'Asnjë produkt'}</h3>
            <p>
              {search || filter !== 'all'
                ? 'Provoni një kërkim tjetër.'
                : 'Shto produktin e parë duke klikuar "Shto Produkt"'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Emri</th>
                  <th>Kategoria</th>
                  <th>Fotot</th>
                  <th>Veprimet</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        className="table-thumb"
                        src={
                          product.thumbnails?.[0] ||
                          product.images?.[0] ||
                          'https://placehold.co/52x52/1a1815/555?text=?'
                        }
                        alt=""
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <div className="table-name">{product.name}</div>
                      <div className="table-sub">/{product.slug}</div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {categoryNames[product.category_slug] || product.category || '—'}
                      </span>
                    </td>
                    <td className="table-muted">{product.images?.length || 0} foto</td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => setModal(product)} title="Edito">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="icon-btn danger"
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id}
                          title="Fshi"
                        >
                          {deleting === product.id ? (
                            <Spinner size={14} />
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          )}
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
          <div className="admin-pagination">
            <button
              className="admin-btn secondary"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ← Para
            </button>
            <span>Faqja {page + 1} nga {totalPages}</span>
            <button
              className="admin-btn secondary"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Pas →
            </button>
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default AdminProducts;
