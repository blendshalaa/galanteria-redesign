'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/actions';
import { Spinner } from '@/components/ui/states';
import { Toast } from '@/components/ui/Toast';
import { slugify, isValidSlug } from '@/utils/slugify';
import { uploadImages, removeByUrls, allImageUrls } from '@/utils/storage';
import ImageUploader from '../ImageUploader';
import { Modal, Field } from '../Modal';
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from '../icons';
import { adminBtn, card, emptyState, field, iconBtn, iconBtnDanger, pageHeader, table } from '../ui';

const THUMB_PLACEHOLDER = 'https://placehold.co/52x52/1a1815/555?text=?';

/**
 * Project CRUD. The same corrections as the products screen: staged uploads
 * rather than upload-on-select (which orphaned files in storage on cancel),
 * surfaced errors rather than `if (!error)` with no else, real validation
 * rather than a silent `return`, and diacritic-safe slugs.
 */
export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchProjects = useCallback(async () => {
    setLoading(true);

    let query = supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(100);

    if (search.trim()) {
      const escaped = search.trim().replace(/[%_\\]/g, (ch) => `\\${ch}`);
      query = query.ilike('title', `%${escaped}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Galanteria] Failed to load projects', error);
      showToast('Nuk u ngarkuan projektet.', 'error');
      setLoading(false);
      return;
    }

    setProjects(data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 250);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  const handleDelete = async (project) => {
    if (!window.confirm(`Jeni i sigurt që doni të fshini "${project.title}"?`)) return;

    setDeleting(project.id);
    const { error } = await supabase.from('projects').delete().eq('id', project.id);

    if (error) {
      setDeleting(null);
      showToast(`Gabim gjatë fshirjes: ${error.message}`, 'error');
      return;
    }

    await removeByUrls(allImageUrls(project));
    setDeleting(null);
    setProjects((previous) => previous.filter((entry) => entry.id !== project.id));
    showToast('Projekti u fshi me sukses!');
    await revalidateSite();
  };

  const handleSaved = async (type, message) => {
    setEditing(null);
    if (type === 'success') {
      showToast('Projekti u ruajt me sukses!');
      await revalidateSite();
      fetchProjects();
    } else {
      showToast(message || 'Gabim gjatë ruajtjes.', 'error');
    }
  };

  return (
    <div>
      <div className={pageHeader}>
        <p className="text-base text-ink-muted">{projects.length} projekte</p>
        <button type="button" onClick={() => setEditing('new')} className={adminBtn('primary')}>
          <PlusIcon />
          Shto Projekt
        </button>
      </div>

      <div className="relative mb-5 max-w-md">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
          <SearchIcon />
        </span>
        <input
          placeholder="Kërko projekt..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Kërko projekt"
          className={`${field.control} pl-10`}
        />
      </div>

      <div className={card}>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-ink-muted">
            <Spinner /> Duke ngarkuar...
          </div>
        ) : projects.length === 0 ? (
          <div className={emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="text-ink/18">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            <h3 className="text-[1.05rem] font-semibold text-ink">{search ? 'Asnjë rezultat' : 'Asnjë projekt'}</h3>
            <p>{search ? 'Provoni një kërkim tjetër.' : 'Shto projektin e parë.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={table.root}>
              <thead>
                <tr>
                  {['Foto', 'Titulli', 'Lokacioni', 'Viti', 'Fotot', 'Veprimet'].map((heading) => (
                    <th key={heading} className={table.head}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className={table.row}>
                    <td className={table.cell}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.thumbnails?.[0] || project.images?.[0] || THUMB_PLACEHOLDER}
                        alt=""
                        loading="lazy"
                        className={table.thumb}
                      />
                    </td>
                    <td className={table.cell}>
                      <div className={table.name}>{project.title}</div>
                      <div className={table.sub}>/{project.slug}</div>
                    </td>
                    <td className={table.cell}>{project.location || '—'}</td>
                    <td className={table.cell}>{project.year || '—'}</td>
                    <td className={table.cell}>{project.images?.length || 0} foto</td>
                    <td className={table.cell}>
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => setEditing(project)} title="Edito" className={iconBtn}>
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(project)}
                          disabled={deleting === project.id}
                          title="Fshi"
                          className={iconBtnDanger}
                        >
                          {deleting === project.id ? <Spinner size={14} /> : <TrashIcon />}
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
        <ProjectModal
          project={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function ProjectModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    location: project?.location || '',
    year: project?.year || new Date().getFullYear().toString(),
  });

  const [images, setImages] = useState(() =>
    (project?.images || []).map((url, i) => ({ url, thumbUrl: project?.thumbnails?.[i] || url }))
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
      if (name === 'title' && !project?.id) next.slug = slugify(value);
      return next;
    });

    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  useEffect(() => {
    const candidate = form.slug.trim();
    if (!candidate || !isValidSlug(candidate)) {
      setSlugTaken(false);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      let query = supabase.from('projects').select('id').eq('slug', candidate).limit(1);
      if (project?.id) query = query.neq('id', project.id);
      const { data } = await query;
      if (!cancelled) setSlugTaken(Boolean(data?.length));
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.slug, project?.id]);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Titulli është i detyrueshëm.';
    if (!form.slug.trim()) next.slug = 'Adresa në faqe është e detyrueshme.';
    else if (!isValidSlug(form.slug.trim())) next.slug = 'Vetëm shkronja të vogla, numra dhe vizë (-).';
    else if (slugTaken) next.slug = 'Ky slug është i zënë nga një projekt tjetër.';
    if (form.year && !/^\d{4}$/.test(String(form.year).trim())) next.year = 'Viti duhet të jetë 4 shifra.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    if (dirtyRef.current || staged.length) {
      if (!window.confirm('Keni ndryshime të paruajtura. Jeni i sigurt që doni t’i mbyllni?')) return;
    }
    onClose();
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

  const handleSave = async () => {
    if (!validate() || saving) return;
    setSaving(true);

    let finalImages = images;

    if (staged.length) {
      setUploading(true);
      const { uploaded, failed } = await uploadImages(staged, 'projects', setProgress);
      setUploading(false);
      setProgress(null);

      if (failed.length) {
        setSaving(false);
        onSaved('error', `${failed.length} foto nuk u ngarkuan: ${failed[0].message}`);
        return;
      }

      finalImages = [...images, ...uploaded];
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      images: finalImages.map((image) => image.url),
      thumbnails: finalImages.map((image) => image.thumbUrl || image.url),
      updated_at: new Date().toISOString(),
    };

    const { error } = project?.id
      ? await supabase.from('projects').update(payload).eq('id', project.id)
      : await supabase.from('projects').insert([{ ...payload, created_at: new Date().toISOString() }]);

    setSaving(false);

    if (error) {
      onSaved('error', error.message);
      return;
    }

    if (removed.length) await removeByUrls(removed);
    onSaved('success');
  };

  const busy = saving || uploading;

  return (
    <Modal
      title={project?.id ? 'Edito Projektin' : 'Shto Projekt të Ri'}
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
        <Field label="Titulli i Projektit *" htmlFor="pr-title" error={errors.title}>
          <input id="pr-title" name="title" value={form.title} onChange={handleChange} placeholder="p.sh. Klinika USMILE..." className={field.control} />
        </Field>

        <Field label="Adresa në faqe *" htmlFor="pr-slug" error={errors.slug} hint={form.slug && `/project/${form.slug}`}>
          <input id="pr-slug" name="slug" value={form.slug} onChange={handleChange} placeholder="klinika-usmile" className={field.control} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Lokacioni" htmlFor="pr-location">
          <input id="pr-location" name="location" value={form.location} onChange={handleChange} placeholder="p.sh. Prishtinë, Kosovë" className={field.control} />
        </Field>

        <Field label="Viti" htmlFor="pr-year" error={errors.year}>
          <input id="pr-year" name="year" value={form.year} onChange={handleChange} placeholder="2024" inputMode="numeric" className={field.control} />
        </Field>
      </div>

      <Field label="Përshkrimi" htmlFor="pr-description">
        <textarea
          id="pr-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Përshkruani projektin..."
          rows={4}
          className={`${field.control} resize-y`}
        />
      </Field>

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
