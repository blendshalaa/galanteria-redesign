import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import useLang from '../../Hooks/useLang';
import { Spinner } from '../ui';
import './ContactForm.scss';

/**
 * The site's only lead-capture path.
 *
 * Before this, a visitor who wanted to buy furniture could click a phone
 * number, open their mail client, or tap a WhatsApp icon — and none of it was
 * recorded anywhere the client could see. Submissions land in the `inquiries`
 * table (see supabase/migrations/004_inquiries.sql) and appear in the admin
 * panel's Inbox tab.
 *
 * The `anon` role may INSERT into that table but may not SELECT from it, so a
 * public form cannot be turned into a way to download everyone else's leads.
 *
 * Spam handling is deliberately lightweight — no third-party captcha, which
 * would mean another render-blocking script and a consent problem in the EU:
 *   - a honeypot field that only a bot will fill in
 *   - a minimum time-on-form, since bots submit instantly
 *   - length and shape constraints enforced in the database itself
 */

const MIN_SECONDS_ON_FORM = 3;
const EMAIL_SHAPE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const ContactForm = ({ productSlug = null, productName = null, compact = false }) => {
  const { lang, t } = useLang();

  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [honeypot, setHoneypot] = useState('');
  const mountedAt = useRef(Date.now());

  const setField = (field) => (event) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    // Clear the error as soon as the user starts fixing it, rather than
    // leaving red text under a field they are actively correcting.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const validate = () => {
    const next = {};

    if (!values.name.trim()) next.name = t('formRequired');
    else if (values.name.trim().length > 120) next.name = t('formTooLong');

    if (!values.email.trim()) next.email = t('formRequired');
    else if (!EMAIL_SHAPE.test(values.email.trim())) next.email = t('formInvalidEmail');

    if (!values.message.trim()) next.message = t('formRequired');
    else if (values.message.trim().length > 4000) next.message = t('formTooLong');

    if (values.phone && values.phone.length > 40) next.phone = t('formTooLong');

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    // Bot filled the hidden field, or submitted faster than a human reads.
    // Show success either way: telling a bot why it failed helps it retry.
    const tooFast = (Date.now() - mountedAt.current) / 1000 < MIN_SECONDS_ON_FORM;
    if (honeypot || tooFast) {
      setStatus('sent');
      return;
    }

    if (!validate()) return;

    setStatus('sending');

    const { error } = await supabase.from('inquiries').insert([
      {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        message: values.message.trim(),
        product_slug: productSlug,
        product_name: productName,
        locale: lang,
      },
    ]);

    if (error) {
      console.error('[Galanteria] Inquiry submission failed', error);
      setStatus('error');
      return;
    }

    setStatus('sent');
    setValues({ name: '', email: '', phone: '', message: '' });
  };

  if (status === 'sent') {
    return (
      <div className={`contact-form contact-form--success ${compact ? 'is-compact' : ''}`} role="status">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
        <p>{t('formSuccess')}</p>
        <button type="button" className="cf-reset" onClick={() => { mountedAt.current = Date.now(); setStatus('idle'); }}>
          {t('contactFormTitle')}
        </button>
      </div>
    );
  }

  return (
    <form className={`contact-form ${compact ? 'is-compact' : ''}`} onSubmit={handleSubmit} noValidate>
      {!compact && (
        <header className="cf-header">
          <h2>{productSlug ? t('quoteTitle') : t('contactFormTitle')}</h2>
          <p>{productSlug ? t('quoteIntro') : t('contactFormIntro')}</p>
        </header>
      )}

      {productName && (
        <p className="cf-context">
          <span>{t('quoteAbout')}</span>
          <strong>{productName}</strong>
        </p>
      )}

      {/* Honeypot. Hidden from sight and from assistive tech, but present in
          the DOM for a naive bot to fill in. */}
      <div className="cf-hp" aria-hidden="true">
        <label htmlFor="cf-company">Company</label>
        <input
          id="cf-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-name">{t('fieldName')} *</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={setField('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'cf-name-error' : undefined}
          />
          {errors.name && <span className="cf-error" id="cf-name-error">{errors.name}</span>}
        </div>

        <div className="cf-field">
          <label htmlFor="cf-email">{t('fieldEmail')} *</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={setField('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'cf-email-error' : undefined}
          />
          {errors.email && <span className="cf-error" id="cf-email-error">{errors.email}</span>}
        </div>
      </div>

      <div className="cf-field">
        <label htmlFor="cf-phone">{t('fieldPhone')}</label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={setField('phone')}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <span className="cf-error">{errors.phone}</span>}
      </div>

      <div className="cf-field">
        <label htmlFor="cf-message">{t('fieldMessage')} *</label>
        <textarea
          id="cf-message"
          name="message"
          rows={compact ? 4 : 5}
          value={values.message}
          onChange={setField('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
        />
        {errors.message && <span className="cf-error" id="cf-message-error">{errors.message}</span>}
      </div>

      {status === 'error' && (
        <p className="cf-submit-error" role="alert">{t('formError')}</p>
      )}

      <button type="submit" className="cf-submit" disabled={status === 'sending'}>
        {status === 'sending' ? <Spinner size={15} /> : null}
        {status === 'sending' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
};

export default ContactForm;
