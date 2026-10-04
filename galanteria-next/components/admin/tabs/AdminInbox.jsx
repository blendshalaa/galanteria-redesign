'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Spinner } from '@/components/ui/states';
import { Toast } from '@/components/ui/Toast';
import { adminBtn, card, emptyState, pageHeader } from '../ui';
import { cn } from '@/lib/cn';

/**
 * The enquiry inbox.
 *
 * The site had no contact form, so there was nothing to receive. Submissions
 * from the contact page and from "Request a quote" on a product page land in
 * the `inquiries` table and appear here. Row Level Security only lets a
 * signed-in user read that table; the public anon key can insert but not
 * select, so the form cannot be turned into a way to download other people's
 * leads.
 */

const FILTERS = [
  { id: 'new', label: 'Të reja' },
  { id: 'read', label: 'Të lexuara' },
  { id: 'archived', label: 'Arkivuara' },
  { id: 'all', label: 'Të gjitha' },
];

const LOCALE_LABELS = { sq: 'Shqip', en: 'English', de: 'Deutsch' };

const formatDate = (value) =>
  new Date(value).toLocaleString('sq-AL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function AdminInbox() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('new');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchInquiries = useCallback(async () => {
    setLoading(true);

    let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(200);
    if (filter !== 'all') query = query.eq('status', filter);

    const { data, error } = await query;

    if (error) {
      console.error('[Galanteria] Failed to load inquiries', error);
      showToast('Nuk u ngarkuan kërkesat.', 'error');
      setLoading(false);
      return;
    }

    setInquiries(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const setStatus = async (inquiry, status) => {
    setBusyId(inquiry.id);
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', inquiry.id);
    setBusyId(null);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    // Drop it from the list when it no longer matches the active filter, rather
    // than leaving a row that contradicts the tab it is under.
    if (filter !== 'all' && status !== filter) {
      setInquiries((previous) => previous.filter((item) => item.id !== inquiry.id));
    } else {
      setInquiries((previous) => previous.map((item) => (item.id === inquiry.id ? { ...item, status } : item)));
    }
  };

  const handleDelete = async (inquiry) => {
    if (!window.confirm(`Fshini kërkesën nga "${inquiry.name}"? Kjo nuk kthehet mbrapa.`)) return;

    setBusyId(inquiry.id);
    const { error } = await supabase.from('inquiries').delete().eq('id', inquiry.id);
    setBusyId(null);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    setInquiries((previous) => previous.filter((item) => item.id !== inquiry.id));
    showToast('Kërkesa u fshi.');
  };

  const toggle = (inquiry) => {
    const opening = expanded !== inquiry.id;
    setExpanded(opening ? inquiry.id : null);
    // Opening an unread enquiry marks it read, the way an email client does.
    if (opening && inquiry.status === 'new') setStatus(inquiry, 'read');
  };

  return (
    <div>
      <div className={pageHeader}>
        <p className="text-base text-ink-muted">{inquiries.length} mesazhe</p>
      </div>

      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              'cursor-pointer rounded-full border px-4 py-2 text-base font-medium transition-colors duration-150',
              filter === item.id
                ? 'border-line-hover bg-accent-dim text-accent'
                : 'border-line text-ink-muted hover:text-ink'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={card}>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-ink-muted">
            <Spinner /> Duke ngarkuar...
          </div>
        ) : inquiries.length === 0 ? (
          <div className={emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="text-ink/18">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <h3 className="text-[1.05rem] font-semibold text-ink">Asnjë kërkesë</h3>
            <p>{filter === 'new' ? 'Nuk ka kërkesa të reja për momentin.' : 'Asnjë kërkesë në këtë kategori.'}</p>
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--color-line)]">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id} className={cn(inquiry.status === 'new' && 'bg-accent/4')}>
                <button
                  type="button"
                  onClick={() => toggle(inquiry)}
                  className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/2"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-dim text-base font-bold text-accent">
                    {inquiry.name?.[0]?.toUpperCase()}
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-base font-semibold text-ink">{inquiry.name}</strong>
                      {inquiry.product_name && (
                        <span className="rounded-full bg-white/6 px-2 py-0.5 text-sm text-ink-soft">{inquiry.product_name}</span>
                      )}
                      <span className="text-sm uppercase tracking-[0.08em] text-ink-muted">
                        {LOCALE_LABELS[inquiry.locale]}
                      </span>
                    </span>
                    <span className="truncate text-base text-ink-muted">{inquiry.message}</span>
                  </span>

                  <span className="hidden shrink-0 text-sm text-ink-muted sm:block">{formatDate(inquiry.created_at)}</span>
                </button>

                {expanded === inquiry.id && (
                  <div className="flex flex-col gap-5 border-t border-line px-5 py-5">
                    <p className="whitespace-pre-line text-base leading-relaxed text-ink-soft">{inquiry.message}</p>

                    <dl className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-xs uppercase tracking-eyebrow text-ink-muted">Email</dt>
                        <dd className="mt-1 text-base">
                          <a href={`mailto:${inquiry.email}`} className="text-accent hover:underline">
                            {inquiry.email}
                          </a>
                        </dd>
                      </div>
                      {inquiry.phone && (
                        <div>
                          <dt className="text-xs uppercase tracking-eyebrow text-ink-muted">Telefon</dt>
                          <dd className="mt-1 text-base">
                            <a href={`tel:${inquiry.phone}`} className="text-accent hover:underline">
                              {inquiry.phone}
                            </a>
                          </dd>
                        </div>
                      )}
                      {inquiry.product_slug && (
                        <div>
                          <dt className="text-xs uppercase tracking-eyebrow text-ink-muted">Produkti</dt>
                          <dd className="mt-1 text-base">
                            <a
                              href={`/product/${inquiry.product_slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline"
                            >
                              {inquiry.product_name || inquiry.product_slug}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                          inquiry.product_name ? `Galanteria Group — ${inquiry.product_name}` : 'Galanteria Group'
                        )}`}
                        className={adminBtn('primary')}
                      >
                        Përgjigju me email
                      </a>

                      {inquiry.phone && (
                        <a href={`tel:${inquiry.phone}`} className={adminBtn('ghost')}>
                          Telefono
                        </a>
                      )}

                      {inquiry.status !== 'archived' ? (
                        <button type="button" onClick={() => setStatus(inquiry, 'archived')} disabled={busyId === inquiry.id} className={adminBtn('ghost')}>
                          Arkivo
                        </button>
                      ) : (
                        <button type="button" onClick={() => setStatus(inquiry, 'read')} disabled={busyId === inquiry.id} className={adminBtn('ghost')}>
                          Kthe në të lexuara
                        </button>
                      )}

                      <button type="button" onClick={() => handleDelete(inquiry)} disabled={busyId === inquiry.id} className={adminBtn('danger')}>
                        Fshi
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
