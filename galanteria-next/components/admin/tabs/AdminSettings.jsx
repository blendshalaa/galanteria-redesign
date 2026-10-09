'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { revalidateSite } from '@/lib/actions';
import { Spinner } from '@/components/ui/states';
import { Toast } from '@/components/ui/Toast';
import { Field } from '../Modal';
import { PlusIcon, TrashIcon } from '../icons';
import { adminBtn, card, field, iconBtnDanger } from '../ui';

/**
 * Testimonials.
 *
 * Used to also manage the About page's intro text (`about_text` in the
 * `settings` table), alongside testimonials. That editor is gone — the
 * client asked for page copy to no longer be admin-editable, testimonials
 * only. The testimonials half used to be write-only itself: saved to a
 * table the homepage never looked at, since it built its carousel from a
 * hardcoded local array. The public page reads this data now.
 *
 * Also fixed: adding a testimonial returned silently when a field was empty, so
 * the button appeared to do nothing at all.
 */
export default function AdminSettings() {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', company: '', text: '' });
  const [errors, setErrors] = useState({});
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);

      const { data, error } = await supabase.from('testimonials').select('*').order('created_at');

      if (error) showToast('Nuk u ngarkuan testimonialët.', 'error');
      else setTestimonials(data || []);

      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  const addTestimonial = async () => {
    const next = {};
    if (!newTestimonial.name.trim()) next.name = 'Emri është i detyrueshëm.';
    if (!newTestimonial.text.trim()) next.text = 'Citati është i detyrueshëm.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setAdding(true);
    const { data, error } = await supabase
      .from('testimonials')
      .insert([
        {
          name: newTestimonial.name.trim(),
          company: newTestimonial.company.trim() || null,
          text: newTestimonial.text.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    setAdding(false);

    if (error) {
      showToast(`Gabim: ${error.message}`, 'error');
      return;
    }

    setTestimonials((previous) => [...previous, data]);
    setNewTestimonial({ name: '', company: '', text: '' });
    await revalidateSite();
    showToast('Testimoniali u shtua!');
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Fshini këtë testimonial?')) return;

    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) {
      showToast(`Gabim: ${error.message}`, 'error');
      return;
    }

    setTestimonials((previous) => previous.filter((item) => item.id !== id));
    await revalidateSite();
    showToast('Testimoniali u fshi!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-ink-muted">
        <Spinner /> Duke ngarkuar...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className={card}>
        <header className="border-b border-line px-6 py-5">
          <h2 className="font-sans text-[1.02rem] font-semibold text-ink">Testimonialët</h2>
          <p className="mt-1 text-base text-ink-muted">Shfaqen në karusellin e klientëve në ballinë.</p>
        </header>

        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col gap-5 rounded-xl border border-line bg-page/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-accent">Shto Testimonial të Ri</p>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Emri *" htmlFor="t-name" error={errors.name}>
                <input
                  id="t-name"
                  value={newTestimonial.name}
                  onChange={(event) => {
                    setNewTestimonial((current) => ({ ...current, name: event.target.value }));
                    setErrors((current) => ({ ...current, name: undefined }));
                  }}
                  placeholder="Emri i klientit"
                  className={field.control}
                />
              </Field>

              <Field label="Kompania" htmlFor="t-company">
                <input
                  id="t-company"
                  value={newTestimonial.company}
                  onChange={(event) => setNewTestimonial((current) => ({ ...current, company: event.target.value }))}
                  placeholder="Emri i kompanisë"
                  className={field.control}
                />
              </Field>
            </div>

            <Field label="Citati *" htmlFor="t-text" error={errors.text}>
              <textarea
                id="t-text"
                value={newTestimonial.text}
                onChange={(event) => {
                  setNewTestimonial((current) => ({ ...current, text: event.target.value }));
                  setErrors((current) => ({ ...current, text: undefined }));
                }}
                rows={3}
                placeholder="Çfarë tha klienti..."
                className={`${field.control} resize-y`}
              />
            </Field>

            <button type="button" onClick={addTestimonial} disabled={adding} className={`${adminBtn('primary')} self-start`}>
              {adding ? <Spinner size={14} /> : <PlusIcon />}
              Shto
            </button>
          </div>

          {testimonials.length === 0 ? (
            <p className="py-6 text-center text-base text-ink-muted">
              Asnjë testimonial ende — ballina përdor tekstet e paracaktuara.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {testimonials.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-xl border border-line bg-page/40 p-4">
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-dim text-base font-bold text-accent">
                        {item.name?.[0]?.toUpperCase()}
                      </span>
                      <div>
                        <div className="text-base font-semibold text-ink">{item.name}</div>
                        {item.company && <div className="text-sm text-ink-muted">{item.company}</div>}
                      </div>
                    </div>
                    <p className="font-display text-md italic leading-relaxed text-ink-soft">“{item.text}”</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTestimonial(item.id)}
                    aria-label={`Fshi testimonialin nga ${item.name}`}
                    className={iconBtnDanger}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
