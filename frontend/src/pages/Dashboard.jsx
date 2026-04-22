import React from 'react';
import { useLanguage } from '../LanguageContext';

export const Dashboard = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="page-container animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', background: 'var(--color-primary-light)', padding: '10px 15px', borderRadius: 'var(--radius-md)', width: 'max-content', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '500', color: 'white' }}>{t('dash.language')}:</span>
                <select
                    value={language || 'en'}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'white', color: 'var(--color-bg)', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '500', minWidth: '150px' }}
                >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="ml">മലയാളം</option>
                </select>
            </div>

            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ color: 'var(--color-primary-light)' }}>{t('dash.soil_moisture')}</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '1rem' }}>42%</div>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t('dash.optimal_range')}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--color-primary-light)' }}>{t('dash.soil_ph')}</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '1rem' }}>6.5</div>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t('dash.slightly_acidic')}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--color-primary-light)' }}>{t('dash.last_scan')}</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '1rem' }}>{t('dash.2h_ago')}</div>
                    <p style={{ color: 'var(--color-success)' }}>{t('dash.no_pests')}</p>
                </div>
            </div>

            <div className="card glass-panel" style={{ marginTop: '2rem' }}>
                <h3>{t('dash.recent_images')}</h3>
                <div className="grid-4" style={{ marginTop: '1rem' }}>
                    <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
                    <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
                    <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
                    <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
                </div>
            </div>
        </div>
    );
};
