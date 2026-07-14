import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminDashboard.scss';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast ${type}`}>
      {type === 'success'
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
      {message}
    </div>
  );
};

const ProjectModal = ({ project, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    location: project?.location || '',
    year: project?.year || new Date().getFullYear().toString(),
  });
  const [images, setImages] = useState(project?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'title' && !project) {
      setForm(f => ({ ...f, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    }
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('galanteria-images').upload(`projects/${fileName}`, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from('galanteria-images').getPublicUrl(`projects/${fileName}`);
        newUrls.push(urlData.publicUrl);
      }
    }
    setImages(prev => [...prev, ...newUrls]);
    setUploading(false);
  };

  const removeImage = async (url, index) => {
    const path = url.split('/galanteria-images/')[1];
    if (path) await supabase.storage.from('galanteria-images').remove([path]);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { ...form, images, updated_at: new Date().toISOString() };
    let error;
    if (project?.id) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', project.id));
    } else {
      ({ error } = await supabase.from('projects').insert([{ ...payload, created_at: new Date().toISOString() }]));
    }
    setSaving(false);
    if (!error) onSaved('success');
    else onSaved('error', error.message);
  };

  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal modal-lg">
        <div className="modal-header">
          <h3>{project?.id ? 'Edito Projektin' : 'Shto Projekt të Ri'}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="field-row">
            <div className="field-group">
              <label>Titulli i Projektit</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="p.sh. Klinika USMILE..." />
            </div>
            <div className="field-group">
              <label>Slug (URL)</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="klinika-usmile" />
            </div>
          </div>
          <div className="field-row">
            <div className="field-group">
              <label>Lokacioni</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="p.sh. Prishtinë, Kosovë" />
            </div>
            <div className="field-group">
              <label>Viti</label>
              <input name="year" value={form.year} onChange={handleChange} placeholder="2024" />
            </div>
          </div>
          <div className="field-group">
            <label>Përshkrimi</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Përshkruani projektin..." rows={4} />
          </div>

          <div className="field-group">
            <label>Fotot ({images.length} të ngarkuara)</label>
            <div
              className="upload-zone"
              onDrop={(e) => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={(e) => handleFiles(Array.from(e.target.files))} />
              {uploading ? (
                <p>Duke ngarkuar...</p>
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p><span>Kliko për të ngarkuar</span> ose tërhiq foton këtu</p>
                </>
              )}
            </div>
            {images.length > 0 && (
              <div className="upload-previews">
                {images.map((url, i) => (
                  <div key={i} className="upload-preview-item">
                    <img src={url} alt="" />
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeImage(url, i); }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="admin-btn secondary" onClick={onClose}>Anulo</button>
          <button className="admin-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            {saving ? 'Duke ruajtur...' : 'Ruaj'}
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

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error) setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (project) => {
    if (!window.confirm(`Jeni i sigurt që doni të fshini "${project.title}"?`)) return;
    setDeleting(project.id);
    if (project.images?.length) {
      const paths = project.images.map(url => url.split('/galanteria-images/')[1]).filter(Boolean);
      if (paths.length) await supabase.storage.from('galanteria-images').remove(paths);
    }
    const { error } = await supabase.from('projects').delete().eq('id', project.id);
    setDeleting(null);
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== project.id));
      showToast('Projekti u fshi!');
    } else {
      showToast('Gabim gjatë fshirjes.', 'error');
    }
  };

  const handleSaved = (type, message) => {
    setModal(null);
    if (type === 'success') { showToast('Projekti u ruajt!'); fetchProjects(); }
    else showToast(message || 'Gabim.', 'error');
  };

  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <h2>Projektet</h2>
          <p>{projects.length} projekte gjithsej</p>
        </div>
        <button className="admin-btn primary" onClick={() => setModal('new')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Shto Projekt
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Kërko projekt..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><span className="spinner" />Duke ngarkuar...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            <h3>Asnjë projekt</h3>
            <p>Shto projektin e parë duke klikuar "Shto Projekt"</p>
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
                  <th>Veprimet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img className="table-thumb" src={p.images?.[0] || 'https://placehold.co/52x52/1a1815/555?text=?'} alt={p.title} />
                    </td>
                    <td>
                      <div className="table-name">{p.title}</div>
                      <div className="table-sub">{p.images?.length || 0} foto</div>
                    </td>
                    <td style={{ color: 'rgba(240,237,232,0.6)', fontSize: '0.85rem' }}>{p.location || '—'}</td>
                    <td style={{ color: 'rgba(240,237,232,0.6)', fontSize: '0.85rem' }}>{p.year || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => setModal(p)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="icon-btn danger" onClick={() => handleDelete(p)} disabled={deleting === p.id}>
                          {deleting === p.id ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
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

      {modal && <ProjectModal project={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={handleSaved} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProjects;
