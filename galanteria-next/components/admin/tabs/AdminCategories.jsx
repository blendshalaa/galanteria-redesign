'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/actions';
import { Spinner } from '@/components/ui/states';
import { Toast } from '@/components/ui/Toast';
import { slugify, isValidSlug } from '@/utils/slugify';
import { uploadImages, removeByUrls } from '@/utils/storage';
import { categoryImage } from '@/config/categoryImages';
import { Modal, Field } from '../Modal';
import { EditIcon, PlusIcon, TrashIcon } from '../icons';
import { adminBtn, card, emptyState, field, iconBtn, iconBtnDanger, pageHeader, table } from '../ui';
import { cn } from '@/lib/cn';

/* Only reached by a category that has neither an uploaded cover nor a bundled
   fallback — one the client created and has not given a photo. */
const CATEGORY_PLACEHOLDER = 'https://placehold.co/52x52/1a1815/555?text=%E2%80%94';

/**
 * Category management.
 *
 * Categories used to be a hardcoded array in the products screen and ten
 * hardcoded routes in App.jsx, so the client could not add, rename, reorder or
 * hide one without a developer. Everything that renders a category — the navbar
 * menu, the homepage tiles, the footer, the product form, the category pages —
 * reads the table this screen writes.
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

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // 'new' | category | null
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
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async (category) => {
    const count = counts[category.slug] || 0;

    // Deleting a category with products in it would orphan them: they would
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
    await revalidateSite();
    fetchAll();
  };

  const move = async (index, direction) => {
    const next = [...categories];
    const swap = index + direction;
    if (swap < 0 || swap >= next.length) return;

    [next[index], next[swap]] = [next[swap], next[index]];
    setCategories(next);

    // One request rather than one per row.
    const { error } = await supabase
      .from('categories')
      .upsert(next.map((category, i) => ({ ...category, sort_order: i + 1 })));

    if (error) showToast('Renditja nuk u ruajt.', 'error');
    else await revalidateSite();
  };

  const handleSaved = async (type, message) => {
    setEditing(null);
    if (type === 'success') {
      showToast('Kategoria u ruajt!');
      await revalidateSite();
      fetchAll();
    } else {
      showToast(message || 'Gabim gjatë ruajtjes.', 'error');
    }
  };

  return (
    <div>
      <div className={pageHeader}>
        <p className="text-base text-ink-muted">{categories.length} kategori</p>
        <button type="button" onClick={() => setEditing('new')} className={adminBtn('primary')}>
          <PlusIcon />
          Shto Kategori
        </button>
      </div>

      <div className={card}>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-ink-muted">
            <Spinner /> Duke ngarkuar...
          </div>
        ) : categories.length === 0 ? (
          <div className={emptyState}>
            <h3 className="text-[1.05rem] font-semibold text-ink">Asnjë kategori</h3>
            <p>Shtoni kategorinë e parë për të filluar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={table.root}>
              <thead>
                <tr>
                  {['Renditja', 'Foto', 'Emri', 'Produkte', 'Statusi', 'Veprimet'].map((heading) => (
                    <th key={heading} className={table.head}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id} className={table.row}>
                    <td className={table.cell}>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Lëviz lart" className={iconBtn}>
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          disabled={index === categories.length - 1}
                          aria-label="Lëviz poshtë"
                          className={iconBtn}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className={table.cell}>
                      {/* Was `category.image_url || placehold.co/…?text=?`, and
                          every seeded row still has a null image_url — so the
                          panel showed ten question marks for categories that
                          render a real photograph on the public site. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={categoryImage(category) || CATEGORY_PLACEHOLDER} alt="" loading="lazy" className={table.thumb} />
                    </td>
                    <td className={table.cell}>
                      <div className={table.name}>{category.name_sq}</div>
                      <div className={table.sub}>
                        {category.name_en} · {category.name_de} · /{category.slug}
                      </div>
                    </td>
                    <td className={table.cell}>{counts[category.slug] || 0}</td>
                    <td className={table.cell}>
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em]',
                          category.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/6 text-ink-muted'
                        )}
                      >
                        {category.is_active ? 'Aktive' : 'Fshehur'}
                      </span>
                    </td>
                    <td className={table.cell}>
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => setEditing(category)} title="Edito" className={iconBtn}>
                          <EditIcon />
                        </button>
                        <button type="button" onClick={() => handleDelete(category)} title="Fshi" className={iconBtnDanger}>
                          <TrashIcon />
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

      {editing && (
        <CategoryModal
          category={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function CategoryModal({ category, onClose, onSaved }) {
  const [form, setForm] = useState(category ? { ...category } : emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const preview = categoryImage(form);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name_sq' && !category?.id) next.slug = slugify(value);
      return next;
    });
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const handleCover = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    const { uploaded, failed } = await uploadImages([file], 'categories');
    setUploading(false);

    if (failed.length) {
      setErrors((current) => ({ ...current, image_url: failed[0].message }));
      return;
    }

    // A category has one cover; replace rather than accumulate.
    if (form.image_url) await removeByUrls([form.image_url]);
    setForm((current) => ({ ...current, image_url: uploaded[0].url }));
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
      const message = error.code === '23505' ? 'Kjo adresë përdoret nga një kategori tjetër.' : error.message;
      onSaved('error', message);
      return;
    }

    onSaved('success');
  };

  return (
    <Modal
      title={category?.id ? 'Edito Kategorinë' : 'Shto Kategori'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} disabled={saving} className={adminBtn('ghost')}>
            Anulo
          </button>
          <button type="button" onClick={handleSave} disabled={saving || uploading} className={adminBtn('primary')}>
            {saving ? <Spinner size={14} /> : null}
            {saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </>
      }
    >
      <Field label="Emri (Shqip) *" htmlFor="c-sq" error={errors.name_sq}>
        <input id="c-sq" name="name_sq" value={form.name_sq} onChange={handleChange} placeholder="p.sh. Karrige Zyreje" className={field.control} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Emri (English) *" htmlFor="c-en" error={errors.name_en}>
          <input id="c-en" name="name_en" value={form.name_en} onChange={handleChange} placeholder="Office Chairs" className={field.control} />
        </Field>
        <Field label="Emri (Deutsch) *" htmlFor="c-de" error={errors.name_de}>
          <input id="c-de" name="name_de" value={form.name_de} onChange={handleChange} placeholder="Büro Stühle" className={field.control} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Adresa në faqe *"
          htmlFor="c-slug"
          error={errors.slug}
          hint={
            category?.id
              ? 'Kujdes: nëse e ndryshon, linqet e vjetra drejt kësaj kategorie nuk punojnë më.'
              : form.slug && `/category/${form.slug}`
          }
        >
          <input id="c-slug" name="slug" value={form.slug} onChange={handleChange} placeholder="office-chairs" className={field.control} />
        </Field>

        <Field label="Renditja" htmlFor="c-order" hint="Numri më i vogël shfaqet i pari.">
          <input id="c-order" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className={field.control} />
        </Field>
      </div>

      <Field
        label="Fotoja e kopertinës"
        error={errors.image_url}
        hint={
          form.image_url
            ? 'Përdoret në rrjetën e kategorive në ballinë.'
            : 'Nuk ka foto të ngarkuar — po shfaqet fotoja e parazgjedhur e kësaj kategorie.'
        }
      >
        <div className="flex items-center gap-4">
          {/* Shows the bundled fallback when nothing has been uploaded, so the
              preview matches what the homepage actually renders. */}
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="size-20 rounded-lg border border-line object-cover" />
          )}
          <label className={cn(adminBtn('ghost'), 'relative')}>
            {uploading ? <Spinner size={14} /> : null}
            {uploading ? 'Duke ngarkuar...' : form.image_url ? 'Ndrysho foton' : 'Ngarko foto'}
            <input type="file" accept="image/*" onChange={handleCover} hidden />
          </label>
        </div>
      </Field>

      <label className="flex cursor-pointer items-center gap-2.5 text-base text-ink-soft">
        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="size-4 accent-[#c8722a]" />
        <span>Aktive (e dukshme në faqe)</span>
      </label>
    </Modal>
  );
}
