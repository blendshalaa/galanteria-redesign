import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminDashboard.scss';

const AdminHero = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchHeroImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('hero_images').select('*').order('sort_order');
    if (!error) setImages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchHeroImages(); }, []);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: storageError } = await supabase.storage
        .from('galanteria-images')
        .upload(`hero/${fileName}`, file);
      if (!storageError) {
        const { data: urlData } = supabase.storage.from('galanteria-images').getPublicUrl(`hero/${fileName}`);
        await supabase.from('hero_images').insert([{
          url: urlData.publicUrl,
          sort_order: images.length + 1,
          created_at: new Date().toISOString(),
        }]);
      }
    }
    setUploading(false);
    showToast('Fotot u ngarkuan me sukses!');
    fetchHeroImages();
  };

  const handleDelete = async (image) => {
    if (!window.confirm('Fshini këtë foto nga slideri?')) return;
    const path = image.url.split('/galanteria-images/')[1];
    if (path) await supabase.storage.from('galanteria-images').remove([path]);
    await supabase.from('hero_images').delete().eq('id', image.id);
    setImages(prev => prev.filter(i => i.id !== image.id));
    showToast('Foto u fshi!');
  };

  const moveImage = async (index, direction) => {
    const newImages = [...images];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    // Update sort_order in DB
    for (let i = 0; i < newImages.length; i++) {
      await supabase.from('hero_images').update({ sort_order: i + 1 }).eq('id', newImages[i].id);
    }
    setImages(newImages);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <h2>Hero Slider</h2>
          <p>Menaxho fotot e sliderit kryesor të faqes</p>
        </div>
        <button className="admin-btn primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
            onChange={(e) => handleUpload(Array.from(e.target.files))} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          {uploading ? 'Duke ngarkuar...' : 'Ngarko Foto'}
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><span className="spinner" />Duke ngarkuar...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {images.length === 0 && (
            <div className="admin-card" style={{ gridColumn: '1/-1', padding: 60, textAlign: 'center' }}>
              <p style={{ color: 'rgba(240,237,232,0.5)' }}>Asnjë foto në slider. Ngarko fotot e para!</p>
            </div>
          )}
          {images.map((img, index) => (
            <div key={img.id} className="admin-card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 200, position: 'relative' }}>
                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                  display: 'flex', alignItems: 'flex-end', padding: 12, gap: 6
                }}>
                  <span style={{ flex: 1, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>#{index + 1}</span>
                  <button
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}
                  >↑</button>
                  <button
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}
                  >↓</button>
                  <button
                    onClick={() => handleDelete(img)}
                    style={{ padding: '4px 8px', background: 'rgba(220,38,38,0.7)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}
                  >✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            : null}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminHero;
