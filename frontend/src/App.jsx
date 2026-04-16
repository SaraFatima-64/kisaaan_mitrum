import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Bot, CloudSun, ActivitySquare, ShoppingBag, Landmark, Tractor, LayoutDashboard } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './index.css';
import { Dashboard, Chatbot, Weather, Activity, Marketplace, Schemes, RoverBooking } from './pages';
import { useLanguage } from './LanguageContext';

const LanguageModal = () => {
  const { language, setLanguage } = useLanguage();
  if (language) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="card glass-panel" style={{ width: '90%', maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Welcome / स्वागत / സ്വാഗതം</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Please select your preferred language.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setLanguage('en')}>English</button>
          <button className="btn btn-secondary" onClick={() => setLanguage('hi')}>हिंदी (Hindi)</button>
          <button className="btn btn-secondary" onClick={() => setLanguage('ml')}>മലയാളം (Malayalam)</button>
        </div>
      </div>
    </div>
  );
};

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/chatbot', name: 'AI Chatbot', icon: Bot },
  { path: '/weather', name: 'Weather Alerts', icon: CloudSun },
  { path: '/activity', name: 'Activity Log', icon: ActivitySquare },
  { path: '/marketplace', name: 'Marketplace', icon: ShoppingBag },
  { path: '/schemes', name: 'Govt Schemes', icon: Landmark },
  { path: '/rover-booking', name: 'Rover Booking', icon: Tractor },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const currentItem = navItems.find(item => item.path === location.pathname);
  const pageTitle = currentItem ? currentItem.name : "Kisan Mitrum Platform";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="topbar">
        <div className="logo-container topbar-logo" onClick={toggleSidebar} title="Toggle Menu">
          <img src="/kisan_mitrum_logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">Kisan</span>
        </div>

        <nav className="topbar-nav hide-on-mobile">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? "top-nav-item active" : "top-nav-item"}
            >
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar-right">
          <h1 className="page-title show-on-mobile">{pageTitle}</h1>
          <div className="user-profile">
            <span style={{ color: 'var(--color-text-muted)' }} className="hide-on-mobile">Farmer_01</span>
            <div className="avatar">F</div>
          </div>
        </div>
      </header>

      <div className="main-wrapper">
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <nav className="nav-menu">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="nav-icon" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageModal />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/rover-booking" element={<RoverBooking />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
