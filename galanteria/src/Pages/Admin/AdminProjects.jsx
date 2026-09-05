import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Spinner, Toast } from '../../Components/ui';
import ImageUploader from './components/ImageUploader';
import { slugify, isValidSlug } from '../../utils/slugify';
import { uploadImages, removeByUrls, allImageUrls } from '../../utils/storage';
import './AdminDashboard.scss';

/**
 * Project CRUD. Same fixes as AdminProducts: staged uploads instead of
 * upload-on-select (which orphaned files on cancel), surfaced errors instead
 * of `if (!error)` with no else, real validation instead of a silent `return`,
 * and diacritic-safe slugs.
 */

const ProjectModal = ({ project, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    location: project?.location || '',
    year: project?.year || new Date().getFullYear().toString(),
  });

  const [images, setImages] = useState(() =>
    (project?.images || []).map((url, i) => ({
      url,
      thumbUrl: project?.thumbnails?.[i] || url,
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
      if (name === 'title' && !project?.id) next.slug = slugify(value);
      return next;
    });

    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
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

    return () => { cancelled = true; clearTimeout(timer); };
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

    setRemoved((prev) => [...prev, ...dropped]);
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
    <div
      className="admin-modal-overlay"
      onClick={(event) => event.target === event.currentTarget && handleClose()}
    >
      <div className="admin-modal modal-lg" role="dialog" aria-modal="true" aria-label="Projekti">
        <div className="modal-header">
          <h3>{project?.id ? 'Edito Projektin' : 'Shto Projekt të Ri'}</h3>
          <button className="modal-close" onClick={handleClose} aria-label="Mbyll">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="pr-title">Titulli i Projektit *</label>
              <input id="pr-title" name="title" value={form.title} onChange={handleChange} placeholder="p.sh. Klinika USMILE..." />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>
            <div className="field-group">
              <label htmlFor="pr-slug">Adresa në faqe *</label>
              <input id="pr-slug" name="slug" value={form.slug} onChange={handleChange} placeholder="klinika-usmile" />
              {errors.slug ? (
                <span className="field-error">{errors.slug}</span>
              ) : (
                form.slug && <span className="field-hint">/project/{form.slug}</span>
              )}
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="pr-location">Lokacioni</label>
              <input id="pr-location" name="location" value={form.location} onChange={handleChange} placeholder="p.sh. Prishtinë, Kosovë" />
            </div>
            <div className="field-group">
              <label htmlFor="pr-year">Viti</label>
              <input id="pr-year" name="year" value={form.year} onChange={handleChange} placeholder="2024" inputMode="numeric" />
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="pr-description">Përshkrimi</label>
            <textarea
              id="pr-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Përshkruani projektin..."
              rows={4}
            />
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
          <button className="admin-btn secondary" onClick={handleClose} disabled={busy}>Anulo</button>
          <button className="admin-btn primary" onClick={handleSave} disabled={busy}>
            {busy ? <Spinner size={14} /> : null}
            {uploading ? 'Duke ngarkuar fotot...' : saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchProjects = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

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
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    showToast('Projekti u fshi me sukses!');
  };

  const handleSaved = (type, message) => {
    setModal(null);
    if (type === 'success') {
      showToast('Projekti u ruajt me sukses!');
      fetchProjects();
    } else {
      showToast(message || 'Gabim gjatë ruajtjes.', 'error');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <p>{projects.length} projekte</p>
        </div>
        <button className="admin-btn primary" onClick={() => setModal('new')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Shto Projekt
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Kërko projekt..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Kërko projekt"
          />
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><Spinner />Duke ngarkuar...</div>
        ) : projects.length === 0 ? (
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            <h3>{search ? 'Asnjë rezultat' : 'Asnjë projekt'}</h3>
            <p>{search ? 'Provoni një kërkim tjetër.' : 'Shto projektin e parë.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Titulli</th>
                  <th>Lokacioni</th>
                  <th>Viti</th>
                  <th>Fotot</th>
                  <th>Veprimet</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <img
                        className="table-thumb"
                        src={
                          project.thumbnails?.[0] ||
                          project.images?.[0] ||
                          'https://placehold.co/52x52/1a1815/555?text=?'
                        }
                        alt=""
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <div className="table-name">{project.title}</div>
                      <div className="table-sub">/{project.slug}</div>
                    </td>
                    <td className="table-muted">{project.location || '—'}</td>
                    <td className="table-muted">{project.year || '—'}</td>
                    <td className="table-muted">{project.images?.length || 0} foto</td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => setModal(project)} title="Edito">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="icon-btn danger"
                          onClick={() => handleDelete(project)}
                          disabled={deleting === project.id}
                          title="Fshi"
                        >
                          {deleting === project.id ? (
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
      </div>

      {modal && (
        <ProjectModal
          project={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProjects;
