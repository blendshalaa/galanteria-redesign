import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Spinner, Toast } from '../../Components/ui';
import './AdminDashboard.scss';

/**
 * Site text and testimonials.
 *
 * Like the Hero tab, this one used to be write-only: `about_text` was saved to
 * the `settings` table but Aboutus.jsx read src/lang.js, and the testimonials
 * table was saved to but HomePage.jsx built its carousel from a hardcoded local
 * array. Both public pages now read this data.
 *
 * Also fixed: `addTestimonial` returned silently when a field was empty, so the
 * button appeared to do nothing, and errors were swallowed.
 */
const AdminSettings = () => {
  const [aboutText, setAboutText] = useState({ sq: '', en: '', de: '' });
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', company: '', text: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);

      const [aboutRes, testimonialRes] = await Promise.all([
        supabase.from('settings').select('value').eq('key', 'about_text').maybeSingle(),
        supabase.from('testimonials').select('*').order('created_at'),
      ]);

      if (aboutRes.data?.value) {
        setAboutText({ sq: '', en: '', de: '', ...aboutRes.data.value });
      }
      if (testimonialRes.error) {
        showToast('Nuk u ngarkuan testimonialët.', 'error');
      } else {
        setTestimonials(testimonialRes.data || []);
      }

      setLoading(false);
    };

    fetchSettings();
  }, []);

  const saveAboutText = async () => {
    setSaving(true);
    const { error } = await supabase.from('settings').upsert(
      { key: 'about_text', value: aboutText, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    setSaving(false);
    showToast(error ? `Gabim: ${error.message}` : 'Tekstet u ruajtën!', error ? 'error' : 'success');
  };

  const addTestimonial = async () => {
    const next = {};
    if (!newTestimonial.name.trim()) next.name = 'Emri është i detyrueshëm.';
    if (!newTestimonial.text.trim()) next.text = 'Citati është i detyrueshëm.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setAdding(true);
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        name: newTestimonial.name.trim(),
        company: newTestimonial.company.trim() || null,
        text: newTestimonial.text.trim(),
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
    setAdding(false);

    if (error) {
      showToast(`Gabim: ${error.message}`, 'error');
      return;
    }

    setTestimonials((prev) => [...prev, data]);
    setNewTestimonial({ name: '', company: '', text: '' });
    showToast('Testimoniali u shtua!');
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Fshini këtë testimonial?')) return;

    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) {
      showToast(`Gabim: ${error.message}`, 'error');
      return;
    }

    setTestimonials((prev) => prev.filter((item) => item.id !== id));
    showToast('Testimoniali u fshi!');
  };

  if (loading) return <div className="admin-loading"><Spinner />Duke ngarkuar...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div className="page-title" />
      </div>

      <div className="admin-card settings-card">
        <div className="settings-card-header">
          <div>
            <h3>Teksti i Faqes “Rreth Nesh”</h3>
            <p>Shfaqet si paragrafi hyrës në faqen Rreth Nesh.</p>
          </div>
          <button className="admin-btn primary" onClick={saveAboutText} disabled={saving}>
            {saving ? <Spinner size={14} /> : null}
            {saving ? 'Duke ruajtur...' : 'Ruaj'}
          </button>
        </div>

        <div className="settings-card-body">
          <div className="field-group">
            <label htmlFor="about-sq">Hyrja (Shqip)</label>
            <textarea
              id="about-sq"
              value={aboutText.sq}
              onChange={(e) => setAboutText((a) => ({ ...a, sq: e.target.value }))}
              rows={4}
              placeholder="Teksti shqip..."
            />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="about-en">Hyrja (English)</label>
              <textarea
                id="about-en"
                value={aboutText.en}
                onChange={(e) => setAboutText((a) => ({ ...a, en: e.target.value }))}
                rows={4}
                placeholder="English text..."
              />
            </div>
            <div className="field-group">
              <label htmlFor="about-de">Hyrja (Deutsch)</label>
              <textarea
                id="about-de"
                value={aboutText.de}
                onChange={(e) => setAboutText((a) => ({ ...a, de: e.target.value }))}
                rows={4}
                placeholder="Deutscher Text..."
              />
            </div>
          </div>

          <p className="field-hint">
            Nëse një gjuhë lihet bosh, faqja përdor tekstin e paracaktuar.
          </p>
        </div>
      </div>

      <div className="admin-card settings-card">
        <div className="settings-card-header">
          <div>
            <h3>Testimonialët</h3>
            <p>Shfaqen në karusellin e klientëve në ballinë.</p>
          </div>
        </div>

        <div className="settings-card-body">
          <div className="testimonial-form">
            <p className="testimonial-form-label">Shto Testimonial të Ri</p>

            <div className="field-row">
              <div className="field-group">
                <label htmlFor="t-name">Emri *</label>
                <input
                  id="t-name"
                  value={newTestimonial.name}
                  onChange={(e) => { setNewTestimonial((t) => ({ ...t, name: e.target.value })); setErrors((x) => ({ ...x, name: undefined })); }}
                  placeholder="Emri i klientit"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="field-group">
                <label htmlFor="t-company">Kompania</label>
                <input
                  id="t-company"
                  value={newTestimonial.company}
                  onChange={(e) => setNewTestimonial((t) => ({ ...t, company: e.target.value }))}
                  placeholder="Emri i kompanisë"
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="t-text">Citati *</label>
              <textarea
                id="t-text"
                value={newTestimonial.text}
                onChange={(e) => { setNewTestimonial((t) => ({ ...t, text: e.target.value })); setErrors((x) => ({ ...x, text: undefined })); }}
                rows={3}
                placeholder="Çfarë tha klienti..."
              />
              {errors.text && <span className="field-error">{errors.text}</span>}
            </div>

            <button className="admin-btn primary" onClick={addTestimonial} disabled={adding}>
              {adding ? <Spinner size={14} /> : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
              Shto
            </button>
          </div>

          {testimonials.length === 0 ? (
            <p className="settings-empty">
              Asnjë testimonial ende — ballina përdor tekstet e paracaktuara.
            </p>
          ) : (
            <div className="testimonial-list">
              {testimonials.map((item) => (
                <div key={item.id} className="testimonial-row">
                  <div className="testimonial-row-main">
                    <div className="testimonial-row-head">
                      <span className="testimonial-avatar">{item.name?.[0]?.toUpperCase()}</span>
                      <div>
                        <div className="testimonial-row-name">{item.name}</div>
                        {item.company && <div className="testimonial-row-company">{item.company}</div>}
                      </div>
                    </div>
                    <p className="testimonial-row-text">“{item.text}”</p>
                  </div>
                  <button
                    className="icon-btn danger"
                    onClick={() => deleteTestimonial(item.id)}
                    aria-label={`Fshi testimonialin nga ${item.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminSettings;
