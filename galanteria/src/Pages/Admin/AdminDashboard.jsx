import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../Components/AdminAuth/adminAuthContext';
import { supabase } from '../../lib/supabase';
import AdminProducts from './AdminProducts';
import AdminProjects from './AdminProjects';
import AdminCategories from './AdminCategories';
import AdminInbox from './AdminInbox';
import AdminHero from './AdminHero';
import AdminSettings from './AdminSettings';
import './AdminDashboard.scss';

const icons = {
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  categories: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  projects: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  inbox: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  hero: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  migrate: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.42 1.42M4.93 4.93l1.42 1.42M19.07 19.07l-1.42-1.42M4.93 19.07l1.42-1.42M21 12h-2M5 12H3M12 21v-2M12 5V3" />
    </svg>
  ),
};

/**
 * Sidebar entries.
 *
 * `label` is what the client reads; `hint` is the one line under the page title
 * that says where on the live site this content actually shows up. The panel is
 * used by someone who does not know what a "hero slider" or a "migration" is,
 * and previously every tab dropped them straight into a table with no
 * explanation of what they were editing or where it would appear.
 *
 * The "Migrimi" entry was removed from this list. It ran a one-time import of
 * the old hardcoded product file into Supabase, it is destructive if misused,
 * and the catalogue has already been imported — so it was a button labelled
 * with a word the client does not know, sitting one click away, that could
 * duplicate the entire catalogue. AdminMigrate.jsx is still in the repository
 * for a developer who needs it.
 */
const NAV = [
  {
    id: 'products',
    label: 'Produktet',
    icon: icons.products,
    group: 'Katalogu',
    hint: 'Mobiljet që shohin vizitorët. Secila shfaqet te faqja e kategorisë së vet.',
  },
  {
    id: 'categories',
    label: 'Kategoritë',
    icon: icons.categories,
    group: 'Katalogu',
    hint: 'Ndarjet e katalogut — dalin në meny, në ballinë dhe në fund të faqes.',
  },
  {
    id: 'projects',
    label: 'Projektet',
    icon: icons.projects,
    group: 'Katalogu',
    hint: 'Punët e realizuara. Shfaqen te faqja “Projektet”.',
  },
  {
    id: 'inbox',
    label: 'Mesazhet',
    icon: icons.inbox,
    group: 'Klientët',
    hint: 'Çdo mesazh dhe kërkesë për ofertë që vjen nga faqja.',
  },
  {
    id: 'hero',
    // Was "Hero Slider" — two English technical words in an Albanian panel.
    label: 'Fotot e ballinës',
    icon: icons.hero,
    group: 'Faqja',
    hint: 'Fotot e mëdha që ndërrohen në krye të ballinës.',
  },
  {
    id: 'settings',
    label: 'Tekstet e faqes',
    icon: icons.settings,
    group: 'Faqja',
    hint: 'Teksti te “Rreth nesh” dhe vlerësimet e klientëve në ballinë.',
  },
];

const GROUPS = ['Katalogu', 'Klientët', 'Faqja'];

const AdminDashboard = () => {
  const { logout, user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // Unread enquiry count for the sidebar badge — the whole point of the Inbox
  // is that the client notices a new lead without going looking for it.
  useEffect(() => {
    let active = true;

    const fetchUnread = async () => {
      const { count, error } = await supabase
        .from('inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new');

      if (active && !error) setUnread(count || 0);
    };

    fetchUnread();
    const timer = setInterval(fetchUnread, 60000);

    return () => { active = false; clearInterval(timer); };
  }, [activeTab]);

  const active = NAV.find((item) => item.id === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'products':   return <AdminProducts />;
      case 'categories': return <AdminCategories />;
      case 'projects':   return <AdminProjects />;
      case 'inbox':      return <AdminInbox />;
      case 'hero':       return <AdminHero />;
      case 'settings':   return <AdminSettings />;
      default:           return <AdminProducts />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">G</div>
          <div className="logo-text">
            <span className="logo-name">Galanteria</span>
            <span className="logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {GROUPS.map((group) => (
            <React.Fragment key={group}>
              <p className="nav-section-label">{group}</p>
              {NAV.filter((item) => item.group === group).map((item) => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                  {item.id === 'inbox' && unread > 0 && (
                    <span className="nav-badge">{unread}</span>
                  )}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user?.email && <p className="sidebar-user" title={user.email}>{user.email}</p>}

          <a href="/" target="_blank" rel="noopener noreferrer" className="view-site-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Shiko faqen
          </a>

          <button onClick={logout} className="logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Dil
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Mbyll menynë' : 'Hap menynë'}
            aria-expanded={sidebarOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* The title used to be the tab name alone. The hint under it is what
              tells a non-technical editor what this screen controls and where
              the result shows up on the public site. */}
          <div className="topbar-title">
            <h2>{active?.label}</h2>
            {active?.hint && <p className="topbar-hint">{active.hint}</p>}
          </div>

          <div className="topbar-actions">
            <div className="admin-badge">Admin</div>
          </div>
        </header>

        <div className="admin-content">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
