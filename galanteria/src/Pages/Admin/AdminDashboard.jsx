import React, { useState } from 'react';
import { useAdminAuth } from '../../Components/AdminAuth/AdminAuth';
import AdminLogin from './AdminLogin';
import AdminProducts from './AdminProducts';
import AdminProjects from './AdminProjects';
import AdminHero from './AdminHero';
import AdminSettings from './AdminSettings';
import AdminMigrate from './AdminMigrate';
import './AdminDashboard.scss';

const NAV = [
  {
    id: 'products', label: 'Produktet', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    )
  },
  {
    id: 'projects', label: 'Projektet', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  {
    id: 'hero', label: 'Hero Slider', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    )
  },
  {
    id: 'settings', label: 'Cilësimet', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93l-1.42 1.42M4.93 4.93l1.42 1.42M19.07 19.07l-1.42-1.42M4.93 19.07l1.42-1.42M21 12h-2M5 12H3M12 21v-2M12 5V3"/>
      </svg>
    )
  },
  {
    id: 'migrate', label: 'Migrimi', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    )
  },
];

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <AdminLogin />;

  const renderContent = () => {
    switch (activeTab) {
      case 'products': return <AdminProducts />;
      case 'projects': return <AdminProjects />;
      case 'hero': return <AdminHero />;
      case 'settings': return <AdminSettings />;
      case 'migrate': return <AdminMigrate />;
      default: return <AdminProducts />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">G</div>
          <div className="logo-text">
            <span className="logo-name">Galanteria</span>
            <span className="logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Menaxhimi</p>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="view-site-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Shiko faqen
          </a>
          <button onClick={logout} className="logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Dil
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="topbar-title">
            <h2>{NAV.find(n => n.id === activeTab)?.label}</h2>
          </div>
          <div className="topbar-actions">
            <div className="admin-badge">Admin</div>
          </div>
        </header>

        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
