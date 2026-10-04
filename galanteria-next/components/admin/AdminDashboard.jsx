'use client';

import { Fragment, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAdminAuth } from './AdminAuthProvider';
import AdminProducts from './tabs/AdminProducts';
import AdminCategories from './tabs/AdminCategories';
import AdminProjects from './tabs/AdminProjects';
import AdminInbox from './tabs/AdminInbox';
import AdminHero from './tabs/AdminHero';
import AdminSettings from './tabs/AdminSettings';
import { cn } from '@/lib/cn';

const icons = {
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
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
 * saying where on the live site this content actually shows up. The panel is
 * used by someone who does not know what a "hero slider" is, and every tab used
 * to drop them straight into a table with no explanation of what they were
 * editing or where it would appear.
 *
 * There is no "Migrimi" entry. It ran a one-time import of the old hardcoded
 * product file into Supabase, it is destructive if misused, and the catalogue
 * has already been imported — so it was a button labelled with a word the
 * client does not know, one click away, that could duplicate the entire
 * catalogue.
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

const TABS = {
  products: AdminProducts,
  categories: AdminCategories,
  projects: AdminProjects,
  inbox: AdminInbox,
  hero: AdminHero,
  settings: AdminSettings,
};

export default function AdminDashboard() {
  const { logout, user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // The unread count for the sidebar badge — the whole point of the Inbox is
  // that the client notices a new lead without going looking for it.
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

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [activeTab]);

  const active = NAV.find((item) => item.id === activeTab);
  const ActiveTab = TABS[activeTab] ?? AdminProducts;

  return (
    <div className="flex min-h-screen bg-sunken font-sans text-ink">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-100 flex w-65 flex-col border-r border-line bg-[#111009]',
          'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-6">
          <span className="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-accent-light text-[1.1rem] font-bold text-white">
            G
          </span>
          <span className="flex flex-col">
            <span className="text-[0.95rem] font-bold tracking-[-0.01em] text-ink">Galanteria</span>
            <span className="text-[0.72rem] uppercase tracking-[0.05em] text-ink-muted">Admin Panel</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {GROUPS.map((group) => (
            <Fragment key={group}>
              <p className="mb-2 mt-1 px-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ink-muted">
                {group}
              </p>
              {NAV.filter((item) => item.group === group).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-2.5',
                    'text-left text-[0.88rem] transition-all duration-150 [&_svg]:shrink-0',
                    activeTab === item.id
                      ? 'bg-accent-dim font-semibold text-accent'
                      : 'font-medium text-ink-muted hover:bg-white/5 hover:text-ink'
                  )}
                >
                  {item.icon}
                  {item.label}
                  {item.id === 'inbox' && unread > 0 && (
                    <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[0.7rem] font-bold text-[#16120c]">
                      {unread}
                    </span>
                  )}
                </button>
              ))}
            </Fragment>
          ))}
        </nav>

        <div className="flex flex-col gap-1.5 border-t border-line p-3">
          {user?.email && (
            <p title={user.email} className="truncate px-3 py-1 text-sm text-ink-muted">
              {user.email}
            </p>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[9px] border border-transparent px-3 py-2.5 text-base font-medium text-ink-muted transition-all duration-150 hover:border-line hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Shiko faqen
          </a>

          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-[9px] border border-transparent px-3 py-2.5 text-left text-base font-medium text-red-400/70 transition-all duration-150 hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Dil
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-99 bg-black/60 backdrop-blur-[4px] lg:hidden"
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:ml-65">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-line bg-sunken/90 px-6 backdrop-blur-[12px]">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Mbyll menynë' : 'Hap menynë'}
            aria-expanded={sidebarOpen}
            className="flex cursor-pointer items-center text-ink-soft hover:text-ink lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* The title used to be the tab name alone. The hint under it is what
              tells a non-technical editor what this screen controls and where
              the result shows up on the public site. */}
          <div className="min-w-0">
            <h1 className="truncate font-sans text-[1.05rem] font-semibold text-ink">{active?.label}</h1>
            {active?.hint && <p className="truncate text-sm text-ink-muted">{active.hint}</p>}
          </div>

          <span className="ml-auto shrink-0 rounded-full border border-line-hover bg-accent-dim px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-accent">
            Admin
          </span>
        </header>

        <div className="mx-auto w-full max-w-300 flex-1 px-6 py-8">
          <ActiveTab />
        </div>
      </div>
    </div>
  );
}
