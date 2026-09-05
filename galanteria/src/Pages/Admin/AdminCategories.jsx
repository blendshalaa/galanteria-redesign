import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { invalidateCategories } from '../../Hooks/useCategories';
import { Spinner, Toast } from '../../Components/ui';
import { slugify, isValidSlug } from '../../utils/slugify';
import { uploadImages, removeByUrls } from '../../utils/storage';
import { categoryImage } from '../../config/categoryImages';
import './AdminDashboard.scss';

/* Only reached by a category that has neither an uploaded cover nor a bundled
   fallback — i.e. one the client created themselves and has not given a photo. */
const CATEGORY_PLACEHOLDER = 'https://placehold.co/52x52/1a1815/555?text=%E2%80%94';

/**
 * Category management — a new tab.
 *
 * Categories were previously a hardcoded array in AdminProducts.jsx and ten
 * hardcoded routes in App.jsx, so the client could not add, rename, reorder or
 * hide one without a developer. They live in the `categories` table now, and
 * everything that renders a category — the navbar menu, the homepage grid, the
 * footer, the product form, the category pages — reads from here.
 */

const emptyForm = {
  slug: '',
  name_sq: '',
  name_en: '',
  name_de: '',
  image_url: '',
  sort_order: 0,
  is_active: true,
};

const CategoryModal = ({ category, onClose, onSaved }) => {
  const [form, setForm] = useState(category ? { ...category } : emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const preview = categoryImage(form);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((f) => {
      const next = { ...f, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name_sq' && !category?.id) next.slug = slugify(value);
      return next;
    });
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const handleCover = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    const { uploaded, failed } = await uploadImages([file], 'categories');
    setUploading(false);

    if (failed.length) {
      setErrors((e) => ({ ...e, image_url: failed[0].message }));
      return;
    }

    // A category has one cover; replace rather than accumulate.
    if (form.image_url) await removeByUrls([form.image_url]);
    setForm((f) => ({ ...f, image_url: uploaded[0].url }));
  };

  const validate = () => {
    const next = {};
    if (!form.name_sq.trim()) next.name_sq = 'Emri shqip është i detyrueshëm.';
    if (!form.name_en.trim()) next.name_en = 'Emri anglisht është i detyrueshëm.';
    if (!form.name_de.trim()) next.name_de = 'Emri gjermanisht është i detyrueshëm.';
    if (!form.slug.trim()) next.slug = 'Adresa në faqe është e detyrueshme.';
    else if (!isValidSlug(form.slug.trim())) next.slug = 'Vetëm shkronja të vogla, numra dhe vizë (-).';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || saving) return;
    setSaving(true);

    const payload = {
      slug: form.slug.trim(),
      name_sq: form.name_sq.trim(),
      name_en: form.name_en.trim(),
      name_de: form.name_de.trim(),
      image_url: form.image_url || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } = category?.id
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert([payload]);

    setSaving(false);

    if (error) {
      // The slug column is unique, so a duplicate arrives as 23505.
      const message =
        error.code === '23505'
          ? 'Kjo adresë përdoret nga një kategori tjetër.'
          : error.message;
      onSaved('error', message);
      return;
    }

    onSaved('success');
  };

  return (
    <div
      className="admin-modal-overlay"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Kategoria">
        <div className="modal-header">
          <h3>{category?.id ? 'Edito Kategorinë' : 'Shto Kategori'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Mbyll">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="field-group">
            <label htmlFor="c-sq">Emri (Shqip) *</label>
            <input id="c-sq" name="name_sq" value={form.name_sq} onChange={handleChange} placeholder="p.sh. Karrige Zyreje" />
            {errors.name_sq && <span className="field-error">{errors.name_sq}</span>}
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="c-en">Emri (English) *</label>
              <input id="c-en" name="name_en" value={form.name_en} onChange={handleChange} placeholder="Office Chairs" />
              {errors.name_en && <span className="field-error">{errors.name_en}</span>}
            </div>
            <div className="field-group">
              <label htmlFor="c-de">Emri (Deutsch) *</label>
              <input id="c-de" name="name_de" value={form.name_de} onChange={handleChange} placeholder="Büro Stühle" />
              {errors.name_de && <span className="field-error">{errors.name_de}</span>}
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="c-slug">Adresa në faqe *</label>
              <input id="c-slug" name="slug" value={form.slug} onChange={handleChange} placeholder="office-chairs" />
              {errors.slug ? (
                <span className="field-error">{errors.slug}</span>
              ) : (
                form.slug && <span className="field-hint">/category/{form.slug}</span>
              )}
              {category?.id && (
                <span className="field-hint">
                  Kujdes: nëse e ndryshon, linqet e vjetra drejt kësaj kategorie nuk punojnë më.
                </span>
              )}
            </div>
            <div className="field-group">
              <label htmlFor="c-order">Renditja</label>
              <input id="c-order" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} />
              <span className="field-hint">Numri më i vogël shfaqet i pari.</span>
            </div>
          </div>

          <div className="field-group">
            <label>Fotoja e kopertinës</label>
            <div className="category-cover-row">
              {/* Shows the bundled fallback when nothing has been uploaded, so
                  the preview matches what the homepage actually renders
                  instead of being blank. */}
              {preview && <img src={preview} alt="" className="category-cover-preview" />}
              <label className="admin-btn secondary file-btn">
                {uploading ? <Spinner size={14} /> : null}
                {uploading ? 'Duke ngarkuar...' : form.image_url ? 'Ndrysho foton' : 'Ngarko foto'}
                <input type="file" accept="image/*" onChange={handleCover} hidden />
              </label>
            </div>
            {errors.image_url && <span className="field-error">{errors.image_url}</span>}
            <span className="field-hint">
              {form.image_url
                ? 'Përdoret në rrjetën e kategorive në ballinë.'
                : 'Nuk ka foto të ngarkuar — po shfaqet fotoja e parazgjedhur e kësaj kategorie.'}
            </span>
          </div>

          <div className="field-group">
            <label className="checkbox-row">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
              <span>Aktive (e dukshme në faqe)</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="admin-btn secondary" onClick={onClose} disabled={saving}>Anulo</button>
          <button className="admin-btn primary" onClick={handleSave} disabled={saving || uploading}>
            {saving ? <Spinner size={14} /> : null}
            {saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchAll = useCallback(async () => {
    setLoading(true);

    const [categoryRes, productRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select('category_slug'),
    ]);

    if (categoryRes.error) {
      console.error('[Galanteria] Failed to load categories', categoryRes.error);
      showToast('Nuk u ngarkuan kategoritë.', 'error');
      setLoading(false);
      return;
    }

    const tally = {};
    (productRes.data || []).forEach((row) => {
      if (row.category_slug) tally[row.category_slug] = (tally[row.category_slug] || 0) + 1;
    });

    setCategories(categoryRes.data || []);
    setCounts(tally);
    setLoading(false);
    invalidateCategories();
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (category) => {
    const count = counts[category.slug] || 0;

    // Deleting a category with products in it would orphan them — they would
    // vanish from the site with no way to find them again in the panel.
    if (count > 0) {
      window.alert(
        `"${category.name_sq}" ka ${count} produkte. Zhvendosini ose fshini ato së pari, ` +
        'ose çaktivizoni kategorinë në vend që ta fshini.'
      );
      return;
    }

    if (!window.confirm(`Fshini kategorinë "${category.name_sq}"?`)) return;

    const { error } = await supabase.from('categories').delete().eq('id', category.id);
    if (error) {
      showToast(error.message, 'error');
      return;
    }

    if (category.image_url) await removeByUrls([category.image_url]);
    showToast('Kategoria u fshi.');
    fetchAll();
  };

  const move = async (index, direction) => {
    const next = [...categories];
    const swap = index + direction;
    if (swap < 0 || swap >= next.length) return;

    [next[index], next[swap]] = [next[swap], next[index]];
    setCategories(next);

    // One request rather than one per row.
    const { error } = await supabase.from('categories').upsert(
      next.map((category, i) => ({ ...category, sort_order: i + 1 }))
    );

    if (error) showToast('Renditja nuk u ruajt.', 'error');
    else invalidateCategories();
  };

  const handleSaved = (type, message) => {
    setModal(null);
    if (type === 'success') {
      showToast('Kategoria u ruajt!');
      fetchAll();
    } else {
      showToast(message || 'Gabim gjatë ruajtjes.', 'error');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <p>{categories.length} kategori</p>
        </div>
        <button className="admin-btn primary" onClick={() => setModal('new')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Shto Kategori
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><Spinner />Duke ngarkuar...</div>
        ) : categories.length === 0 ? (
          <div className="admin-empty">
            <h3>Asnjë kategori</h3>
            <p>Shtoni kategorinë e parë për të filluar.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Renditja</th>
                  <th>Foto</th>
                  <th>Emri</th>
                  <th>Produkte</th>
                  <th>Statusi</th>
                  <th>Veprimet</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>
                      <div className="order-controls">
                        <button
                          className="icon-btn"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          aria-label="Lëviz lart"
                        >↑</button>
                        <button
                          className="icon-btn"
                          onClick={() => move(index, 1)}
                          disabled={index === categories.length - 1}
                          aria-label="Lëviz poshtë"
                        >↓</button>
                      </div>
                    </td>
                    <td>
                      {/* Was `category.image_url || placehold.co/…?text=?`, and
                          every seeded row still has a null image_url — so the
                          panel showed ten question marks for categories that
                          render a real photograph on the public site. */}
                      <img
                        className="table-thumb"
                        src={categoryImage(category) || CATEGORY_PLACEHOLDER}
                        alt=""
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <div className="table-name">{category.name_sq}</div>
                      <div className="table-sub">
                        {category.name_en} · {category.name_de} · /{category.slug}
                      </div>
                    </td>
                    <td className="table-muted">{counts[category.slug] || 0}</td>
                    <td>
                      <span className={`status-badge ${category.is_active ? 'ok' : 'muted'}`}>
                        {category.is_active ? 'Aktive' : 'Fshehur'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => setModal(category)} title="Edito">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="icon-btn danger" onClick={() => handleDelete(category)} title="Fshi">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <CategoryModal
          category={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminCategories;
