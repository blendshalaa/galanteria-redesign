import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Spinner, Toast } from '../../Components/ui';
import './AdminDashboard.scss';

/**
 * Enquiry inbox — a new tab.
 *
 * The site had no contact form, so there was nothing to receive. Submissions
 * from the new form on the Contact page, and from "Request a quote" on product
 * pages, land in the `inquiries` table and appear here.
 *
 * Row Level Security only lets a signed-in user read this table; the public
 * anon key can insert but not select (supabase/migrations/004_inquiries.sql).
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

const AdminInbox = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('new');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchInquiries = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

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

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const setStatus = async (inquiry, status) => {
    setBusyId(inquiry.id);
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', inquiry.id);
    setBusyId(null);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    // Drop it from the list when it no longer matches the active filter,
    // rather than leaving a row that contradicts the tab it is under.
    if (filter !== 'all' && status !== filter) {
      setInquiries((prev) => prev.filter((item) => item.id !== inquiry.id));
    } else {
      setInquiries((prev) =>
        prev.map((item) => (item.id === inquiry.id ? { ...item, status } : item))
      );
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

    setInquiries((prev) => prev.filter((item) => item.id !== inquiry.id));
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
      <div className="admin-page-header">
        <div className="page-title">
          <p>{inquiries.length} mesazhe</p>
        </div>
      </div>

      <div className="admin-filters">
        <div className="filter-tabs" role="tablist">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={filter === item.id}
              className={`filter-tab ${filter === item.id ? 'active' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><Spinner />Duke ngarkuar...</div>
        ) : inquiries.length === 0 ? (
          <div className="admin-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <h3>Asnjë kërkesë</h3>
            <p>
              {filter === 'new'
                ? 'Nuk ka kërkesa të reja për momentin.'
                : 'Asnjë kërkesë në këtë kategori.'}
            </p>
          </div>
        ) : (
          <ul className="inbox-list">
            {inquiries.map((inquiry) => (
              <li
                key={inquiry.id}
                className={`inbox-item ${inquiry.status === 'new' ? 'is-unread' : ''} ${
                  expanded === inquiry.id ? 'is-open' : ''
                }`}
              >
                <button type="button" className="inbox-summary" onClick={() => toggle(inquiry)}>
                  <span className="inbox-avatar">{inquiry.name?.[0]?.toUpperCase()}</span>

                  <span className="inbox-main">
                    <span className="inbox-top">
                      <strong>{inquiry.name}</strong>
                      {inquiry.product_name && (
                        <span className="inbox-tag">{inquiry.product_name}</span>
                      )}
                      <span className="inbox-locale">{LOCALE_LABELS[inquiry.locale]}</span>
                    </span>
                    <span className="inbox-preview">{inquiry.message}</span>
                  </span>

                  <span className="inbox-date">{formatDate(inquiry.created_at)}</span>
                </button>

                {expanded === inquiry.id && (
                  <div className="inbox-detail">
                    <p className="inbox-message">{inquiry.message}</p>

                    <dl className="inbox-meta">
                      <div>
                        <dt>Email</dt>
                        <dd><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></dd>
                      </div>
                      {inquiry.phone && (
                        <div>
                          <dt>Telefon</dt>
                          <dd><a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a></dd>
                        </div>
                      )}
                      {inquiry.product_slug && (
                        <div>
                          <dt>Produkti</dt>
                          <dd>
                            <a
                              href={`/product/${inquiry.product_slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {inquiry.product_name || inquiry.product_slug}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="inbox-actions">
                      <a
                        className="admin-btn primary"
                        href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                          inquiry.product_name
                            ? `Galanteria Group — ${inquiry.product_name}`
                            : 'Galanteria Group'
                        )}`}
                      >
                        Përgjigju me email
                      </a>

                      {inquiry.phone && (
                        <a className="admin-btn secondary" href={`tel:${inquiry.phone}`}>
                          Telefono
                        </a>
                      )}

                      {inquiry.status !== 'archived' ? (
                        <button
                          className="admin-btn secondary"
                          onClick={() => setStatus(inquiry, 'archived')}
                          disabled={busyId === inquiry.id}
                        >
                          Arkivo
                        </button>
                      ) : (
                        <button
                          className="admin-btn secondary"
                          onClick={() => setStatus(inquiry, 'read')}
                          disabled={busyId === inquiry.id}
                        >
                          Kthe në të lexuara
                        </button>
                      )}

                      <button
                        className="admin-btn danger"
                        onClick={() => handleDelete(inquiry)}
                        disabled={busyId === inquiry.id}
                      >
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
};

export default AdminInbox;
