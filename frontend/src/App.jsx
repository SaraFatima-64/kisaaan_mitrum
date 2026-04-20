import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Bot, CloudSun, ActivitySquare, ShoppingBag, Landmark, Tractor, LayoutDashboard, Eye, EyeOff } from 'lucide-react';
import React, { useState, useEffect, useContext } from 'react';
import './index.css';
import { Dashboard, Chatbot, Weather, Activity, Marketplace, Schemes, RoverBooking } from './pages';
import { useLanguage } from './LanguageContext';
import { UserContext } from './UserContext';

const LanguageModal = () => {
  const { language, setLanguage, t } = useLanguage();
  if (language) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="card glass-panel" style={{ width: '90%', maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{t('popup.welcome')} / स्वागत / സ്വാഗതം</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          {t('popup.choose_pref')}
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
  { path: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/chatbot', labelKey: 'nav.chatbot', icon: Bot },
  { path: '/weather', labelKey: 'nav.weather', icon: CloudSun },
  { path: '/activity', labelKey: 'nav.activity', icon: ActivitySquare },
  { path: '/marketplace', labelKey: 'nav.marketplace', icon: ShoppingBag },
  { path: '/schemes', labelKey: 'nav.schemes', icon: Landmark },
  { path: '/rover-booking', labelKey: 'nav.rover', icon: Tractor },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    // Phone Validation
    const phoneValid = /^\d{10}$/.test(phone);
    if (!phoneValid) {
      setError(t('auth.err_phone'));
      return;
    }

    // Validation
    const lengthValid = password.length >= 8;
    const hasAlphaNumber = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!(lengthValid && hasAlphaNumber && hasCapital && hasSpecial)) {
      setError(t('auth.err_pass'));
      return;
    }
    
    setError('');
    onLogin({ name: name || 'User', stateName });
    // Reset state for next open
    setName(''); setEmail(''); setPhone(''); setStateName(''); setPassword('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="card glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('auth.signin')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder={t('auth.name')} 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }}
          />
          <input 
            type="email" 
            placeholder={t('auth.email')} 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }}
          />
          <input 
            type="tel" 
            placeholder={t('auth.phone')} 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }}
          />
          <select 
            value={stateName} 
            onChange={e => setStateName(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }}
          >
            <option value="" disabled>{t('auth.state')}</option>
            {indianStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder={t('auth.password')} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('auth.rules_title')}</div>
            <ul style={{ margin: '0', paddingLeft: '1.2rem', lineHeight: '1.4' }}>
              <li>{t('auth.rule_length')}</li>
              <li>{t('auth.rule_alpha')}</li>
              <li>{t('auth.rule_capital')}</li>
              <li>{t('auth.rule_special')}</li>
            </ul>
          </div>
          {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem' }}>{error}</div>}
          <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={handleSave}>{t('auth.save')}</button>
          <button className="btn btn-secondary" onClick={onClose}>{t('auth.cancel')}</button>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentItem = navItems.find(item => item.path === location.pathname);
  const pageTitle = currentItem ? t(currentItem.labelKey) : "Kisan Mitrum Platform";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
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
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar-right">
          <h1 className="page-title show-on-mobile">{pageTitle}</h1>
          <div className="user-profile" style={{ cursor: user ? 'default' : 'pointer' }} onClick={() => !user && setIsLoginModalOpen(true)}>
            {user ? (
              <>
                <span style={{ color: 'var(--color-text-muted)' }} className="hide-on-mobile">{user.name}</span>
                <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              </>
            ) : (
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 'bold' }}>{t('auth.signin_login')}</span>
            )}
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />

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
                <span>{t(item.labelKey)}</span>
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
