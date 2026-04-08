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

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-container">
          <img src="/kisan_mitrum_logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">Kisan</span>
        </div>
        <nav className="nav-menu">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <item.icon className="nav-icon" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">{pageTitle}</h1>
          <div className="user-profile">
            <span style={{ color: 'var(--color-text-muted)' }}>Farmer_01</span>
            <div className="avatar">F</div>
          </div>
        </header>
        {children}
      </main>
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
