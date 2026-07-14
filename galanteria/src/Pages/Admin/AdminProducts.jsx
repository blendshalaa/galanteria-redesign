import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminDashboard.scss';

const CATEGORIES = [
  'Karrigë Zyreje',
  'Karrigë takimesh',
  'Karrigë Pritjeje',
  'Tavolina Pune',
  'Tavolina Takimi',
  'Workstation',
  'Dollapë',
  'Sirtar',
  'Banjë',
  'Tjera',
];

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`admin-toast ${type}`}>
      {type === 'success' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )}
      {message}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || CATEGORIES[0],
    description: product?.description || '',
    description_sq: product?.description_sq || '',
    description_de: product?.description_de || '',
  });
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'name' && !product) {
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
      const { data, error } = await supabase.storage
        .from('galanteria-images')
        .upload(`products/${fileName}`, file, { cacheControl: '3600', upsert: false });
      if (!error) {
        const { data: urlData } = supabase.storage.from('galanteria-images').getPublicUrl(`products/${fileName}`);
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

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { ...form, images, updated_at: new Date().toISOString() };
    let error;
    if (product?.id) {
      ({ error } = await supabase.from('products').update(payload).eq('id', product.id));
    } else {
      ({ error } = await supabase.from('products').insert([{ ...payload, created_at: new Date().toISOString() }]));
    }
    setSaving(false);
    if (!error) onSaved('success');
    else onSaved('error', error.message);
  };

  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal modal-lg">
        <div className="modal-header">
          <h3>{product?.id ? 'Edito Produktin' : 'Shto Produkt të Ri'}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="field-row">
            <div className="field-group">
              <label>Emri i Produktit</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="p.sh. Light, Giulia..." />
            </div>
            <div className="field-group">
              <label>Slug (URL)</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="light" />
            </div>
          </div>
          <div className="field-group">
            <label>Kategoria</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label>Përshkrimi (Shqip)</label>
            <textarea name="description_sq" value={form.description_sq} onChange={handleChange} placeholder="Shkruani përshkrimin shqip..." rows={3} />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label>Përshkrimi (English)</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="English description..." rows={3} />
            </div>
            <div className="field-group">
              <label>Përshkrimi (Deutsch)</label>
              <textarea name="description_de" value={form.description_de} onChange={handleChange} placeholder="Deutsche Beschreibung..." rows={3} />
            </div>
          </div>

          {/* Image Upload */}
          <div className="field-group">
            <label>Fotot ({images.length} të ngarkuara)</label>
            <div
              className={`upload-zone ${uploading ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={(e) => handleFiles(Array.from(e.target.files))} />
              {uploading ? (
                <><span className="spinner" style={{ width: 24, height: 24, borderWidth: 2, borderColor: 'rgba(200,114,42,0.2)', borderTopColor: '#C8722A', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite', marginBottom: 12 }} /><p>Duke ngarkuar...</p></>
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p><span>Kliko për të ngarkuar</span> ose tërhiq foton këtu<br /><small style={{ color: 'rgba(240,237,232,0.3)', fontSize: '0.78rem' }}>PNG, JPG, WEBP — max 10MB secila</small></p>
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

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'new' | product object
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Jeni i sigurt që doni të fshini "${product.name}"?`)) return;
    setDeleting(product.id);
    // Delete images from storage
    if (product.images?.length) {
      const paths = product.images.map(url => url.split('/galanteria-images/')[1]).filter(Boolean);
      if (paths.length) await supabase.storage.from('galanteria-images').remove(paths);
    }
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    setDeleting(null);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast('Produkti u fshi me sukses!');
    } else {
      showToast('Gabim gjatë fshirjes.', 'error');
    }
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

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <h2>Produktet</h2>
          <p>{products.length} produkte gjithsej</p>
        </div>
        <button className="admin-btn primary" onClick={() => setModal('new')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Shto Produkt
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Kërko produkt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#F0EDE8', fontFamily: 'Inter', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Të gjitha</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><span className="spinner" />Duke ngarkuar...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
            <h3>Asnjë produkt</h3>
            <p>Shto produktin e parë duke klikuar "Shto Produkt"</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Emri</th>
                  <th>Kategoria</th>
                  <th>Foto</th>
                  <th>Veprimet</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        className="table-thumb"
                        src={p.images?.[0] || 'https://placehold.co/52x52/1a1815/555?text=?'}
                        alt={p.name}
                      />
                    </td>
                    <td>
                      <div className="table-name">{p.name}</div>
                      <div className="table-sub">/{p.slug}</div>
                    </td>
                    <td><span className="category-badge">{p.category}</span></td>
                    <td style={{ color: 'rgba(240,237,232,0.5)', fontSize: '0.85rem' }}>{p.images?.length || 0} foto</td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => setModal(p)} title="Edito">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="icon-btn danger" onClick={() => handleDelete(p)} disabled={deleting === p.id} title="Fshi">
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

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProducts;
