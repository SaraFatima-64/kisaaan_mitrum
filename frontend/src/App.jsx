import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Bot, CloudSun, ActivitySquare, ShoppingBag, Landmark, Tractor, LayoutDashboard } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import './index.css';
import { Dashboard, Chatbot, Weather, Activity, Marketplace, Schemes, RoverBooking } from './pages';

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
