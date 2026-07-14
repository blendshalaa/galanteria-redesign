import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminDashboard.scss';

const AdminSettings = () => {
  const [aboutText, setAboutText] = useState({ sq: '', en: '', de: '' });
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', company: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const [aboutRes, testimonialRes] = await Promise.all([
        supabase.from('settings').select('*').eq('key', 'about_text').single(),
        supabase.from('testimonials').select('*').order('created_at'),
      ]);
      if (aboutRes.data?.value) setAboutText(aboutRes.data.value);
      if (!testimonialRes.error) setTestimonials(testimonialRes.data || []);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const saveAboutText = async () => {
    setSaving(true);
    const { error } = await supabase.from('settings').upsert({
      key: 'about_text',
      value: aboutText,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    setSaving(false);
    showToast(error ? 'Gabim gjatë ruajtjes.' : 'Tekstet u ruajtën!', error ? 'error' : 'success');
  };

  const addTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) return;
    const { data, error } = await supabase.from('testimonials').insert([{
      ...newTestimonial, created_at: new Date().toISOString()
    }]).select().single();
    if (!error) {
      setTestimonials(prev => [...prev, data]);
      setNewTestimonial({ name: '', company: '', text: '' });
      showToast('Testimoniali u shtua!');
    }
  };

  const deleteTestimonial = async (id) => {
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials(prev => prev.filter(t => t.id !== id));
    showToast('Testimoniali u fshi!');
  };

  if (loading) return <div className="admin-loading"><span className="spinner" />Duke ngarkuar...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title">
          <h2>Cilësimet</h2>
          <p>Menaxho tekstet dhe testimonialët</p>
        </div>
      </div>

      {/* About Page Texts */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 2 }}>Teksti i Faqes "Rreth Nesh"</h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(240,237,232,0.5)' }}>Introdhuksioni dhe përshkrimi i kompanisë</p>
          </div>
          <button className="admin-btn primary" onClick={saveAboutText} disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            {saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="field-group">
            <label>Introdhuksioni (Shqip)</label>
            <textarea value={aboutText.sq} onChange={(e) => setAboutText(a => ({ ...a, sq: e.target.value }))} rows={4} placeholder="Teksti shqip..." />
          </div>
          <div className="field-row">
            <div className="field-group">
              <label>Introdhuksioni (English)</label>
              <textarea value={aboutText.en} onChange={(e) => setAboutText(a => ({ ...a, en: e.target.value }))} rows={4} placeholder="English text..." />
            </div>
            <div className="field-group">
              <label>Introdhuksioni (Deutsch)</label>
              <textarea value={aboutText.de} onChange={(e) => setAboutText(a => ({ ...a, de: e.target.value }))} rows={4} placeholder="Deutscher Text..." />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="admin-card">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 2 }}>Testimonialët (Klientët)</h3>
          <p style={{ fontSize: '0.82rem', color: 'rgba(240,237,232,0.5)' }}>Menaxho citat e klientëve</p>
        </div>
        <div style={{ padding: 24 }}>
          {/* Add new */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.5)', marginBottom: 16 }}>Shto Testimonial të Ri</p>
            <div className="field-row">
              <div className="field-group" style={{ marginBottom: 12 }}>
                <label>Emri</label>
                <input value={newTestimonial.name} onChange={(e) => setNewTestimonial(t => ({ ...t, name: e.target.value }))} placeholder="Emri i klientit" />
              </div>
              <div className="field-group" style={{ marginBottom: 12 }}>
                <label>Kompania</label>
                <input value={newTestimonial.company} onChange={(e) => setNewTestimonial(t => ({ ...t, company: e.target.value }))} placeholder="Emri i kompanisë" />
              </div>
            </div>
            <div className="field-group" style={{ marginBottom: 16 }}>
              <label>Citati</label>
              <textarea value={newTestimonial.text} onChange={(e) => setNewTestimonial(t => ({ ...t, text: e.target.value }))} rows={3} placeholder="Çfarë tha klienti..." />
            </div>
            <button className="admin-btn primary" onClick={addTestimonial}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Shto
            </button>
          </div>

          {/* List */}
          {testimonials.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(240,237,232,0.4)', fontSize: '0.88rem', padding: '40px 0' }}>Asnjë testimonial ende.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {testimonials.map(t => (
                <div key={t.id} style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, background: 'rgba(200,114,42,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#C8722A', fontSize: '0.9rem' }}>
                        {t.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(240,237,232,0.5)' }}>{t.company}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(240,237,232,0.7)', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
                  </div>
                  <button className="icon-btn danger" onClick={() => deleteTestimonial(t.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

export default AdminSettings;
