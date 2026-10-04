'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useLang } from '@/components/providers/LanguageProvider';
import { Spinner } from '@/components/ui/states';
import { cn } from '@/lib/cn';

/**
 * The site's only lead-capture path.
 *
 * Before this existed, a visitor who wanted to buy furniture could click a
 * phone number, open their mail client, or tap a WhatsApp icon — and none of it
 * was recorded anywhere the client could see. Submissions land in the
 * `inquiries` table and appear in the admin panel's Inbox tab. The `anon` role
 * may INSERT there but may not SELECT, so a public form cannot be turned into a
 * way to download everyone else's leads.
 *
 * Spam handling is deliberately lightweight — no third-party captcha, which
 * would mean another render-blocking script and a consent problem in the EU:
 * a honeypot field, a minimum time-on-form, and length constraints enforced in
 * the database itself.
 */

const MIN_SECONDS_ON_FORM = 3;
const EMAIL_SHAPE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const NAME_MIN_LENGTH = 3;
const MESSAGE_MIN_LENGTH = 10;
const PHONE_MIN_DIGITS = 9;
/* Letters (incl. Albanian/German diacritics), spaces, hyphens and
   apostrophes — the characters an actual name is made of. Keystrokes
   outside this set, digits included, are dropped rather than typed. */
const NAME_CHAR = /[\p{L}\s'-]/u;
/* Digits and the handful of symbols real phone numbers are formatted
   with. Letters are dropped rather than typed. */
const PHONE_CHAR = /[\d+()\s-]/;

export default function ContactForm({ productSlug = null, productName = null, compact = false }) {
  const { lang, t } = useLang();

  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [honeypot, setHoneypot] = useState('');
  /* Set on mount rather than during render: the minimum-time-on-form check
     needs the moment the visitor actually saw the form. */
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const setField = (field) => (event) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    // Clear the error as soon as the visitor starts fixing it, rather than
    // leaving red text under a field they are actively correcting.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  /* Name and phone filter their own keystrokes — a digit typed into the
     name field, or a letter typed into the phone field, never lands in the
     input at all, rather than being accepted and only complained about on
     submit. */
  const setFilteredField = (field, charPattern) => (event) => {
    const filtered = Array.from(event.target.value)
      .filter((char) => charPattern.test(char))
      .join('');
    setValues((v) => ({ ...v, [field]: filtered }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const validate = () => {
    const next = {};
    const name = values.name.trim();
    const phoneDigits = values.phone.replace(/\D/g, '');

    if (!name) next.name = t('formRequired');
    else if (name.length < NAME_MIN_LENGTH) next.name = t('formNameTooShort');
    else if (name.length > 120) next.name = t('formTooLong');

    if (!values.email.trim()) next.email = t('formRequired');
    else if (!EMAIL_SHAPE.test(values.email.trim())) next.email = t('formInvalidEmail');

    if (!values.message.trim()) next.message = t('formRequired');
    else if (values.message.trim().length < MESSAGE_MIN_LENGTH) next.message = t('formMessageTooShort');
    else if (values.message.trim().length > 4000) next.message = t('formTooLong');

    // Phone is optional — only validated once there's something in it.
    if (values.phone.trim()) {
      if (phoneDigits.length < PHONE_MIN_DIGITS) next.phone = t('formInvalidPhone');
      else if (values.phone.length > 40) next.phone = t('formTooLong');
    }

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
      <div role="status" className={cn(shellClasses, 'items-center gap-4 py-14 text-center text-ink-soft')}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="text-accent">
          <circle cx="12" cy="12" r="10" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
        <p className="max-w-[42ch] text-md leading-relaxed">{t('formSuccess')}</p>
        <button
          type="button"
          onClick={() => {
            mountedAt.current = Date.now();
            setStatus('idle');
          }}
          className="cursor-pointer rounded-full border border-line bg-white/5 px-5.5 py-2.5 text-base font-semibold text-ink transition-colors hover:border-accent/45 hover:bg-accent/14"
        >
          {t('contactFormTitle')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn(shellClasses, compact ? 'gap-4 p-5 sm:p-6' : 'gap-5')}>
      {!compact && (
        <header className="flex flex-col gap-2">
          <h2 className="font-display text-xl leading-tight text-ink">
            {productSlug ? t('quoteTitle') : t('contactFormTitle')}
          </h2>
          <p className="text-base text-ink-soft">
            {productSlug ? t('quoteIntro') : t('contactFormIntro')}
          </p>
        </header>
      )}

      {productName && (
        <p className="flex flex-wrap items-center gap-2 rounded-sm border border-line bg-white/2 px-3.5 py-2.5 text-base">
          <span className="text-xs uppercase tracking-eyebrow text-ink-muted">{t('quoteAbout')}</span>
          <strong className="font-semibold text-accent-light">{productName}</strong>
        </p>
      )}

      {/* Honeypot. Hidden from sight and from assistive tech, but present in
          the DOM for a naive bot to fill in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-company">Company</label>
        <input
          id="cf-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cf-name" label={`${t('fieldName')} *`} error={errors.name}>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={setFilteredField('name', NAME_CHAR)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'cf-name-error' : undefined}
            className={inputClasses(errors.name)}
          />
        </Field>

        <Field id="cf-email" label={`${t('fieldEmail')} *`} error={errors.email}>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={setField('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'cf-email-error' : undefined}
            className={inputClasses(errors.email)}
          />
        </Field>
      </div>

      <Field id="cf-phone" label={t('fieldPhone')} error={errors.phone}>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={setFilteredField('phone', PHONE_CHAR)}
          aria-invalid={Boolean(errors.phone)}
          className={inputClasses(errors.phone)}
        />
      </Field>

      <Field id="cf-message" label={`${t('fieldMessage')} *`} error={errors.message}>
        <textarea
          id="cf-message"
          name="message"
          rows={compact ? 4 : 5}
          value={values.message}
          onChange={setField('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
          className={cn(inputClasses(errors.message), 'resize-y')}
        />
      </Field>

      {status === 'error' && (
        <p role="alert" className="text-base text-red-300">
          {t('formError')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-[#16120c] transition-colors duration-200 hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? <Spinner size={15} /> : null}
        {status === 'sending' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}

const shellClasses =
  'relative flex w-full flex-col rounded-[1.75rem] border border-line bg-card p-6 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] sm:p-8';

function inputClasses(hasError) {
  return cn(
    'w-full rounded-sm border bg-page/60 px-3.5 py-3 font-sans text-base text-ink',
    'transition-colors duration-200 outline-none placeholder:text-ink/30',
    'focus:border-accent focus:ring-1 focus:ring-accent/40',
    hasError ? 'border-red-400/60' : 'border-line'
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className="text-sm text-red-300">
          {error}
        </span>
      )}
    </div>
  );
}
