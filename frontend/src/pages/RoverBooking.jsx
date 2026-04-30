import React, { useState } from 'react';
import { Tractor } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const RoverBooking = () => {
    const { t } = useLanguage();
    const [showBookingPopup, setShowBookingPopup] = useState(false);
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!date) {
            setError('Please select date');
            return;
        }
        setError('');
        setShowBookingPopup(true);
    };

    return (
        <div className="page-container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', padding: '0.75rem 1.5rem' }}>
                    Control Rover
                </button>
            </div>
            <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                <Tractor size={64} color="var(--color-primary-light)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h2>{t('rover.title')}</h2>
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                    {t('rover.desc')}
                </p>

                <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('rover.date')}</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            if (e.target.value) setError('');
                        }}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: `1px solid ${error ? 'var(--color-danger, red)' : 'var(--color-border)'}`, color: 'var(--color-text)', marginBottom: error ? '0.5rem' : '1.5rem', outline: 'none' }} 
                    />
                    {error && <p style={{ color: 'var(--color-danger, red)', fontSize: '0.9rem', marginBottom: '1rem', marginTop: '-0.25rem' }}>{error}</p>}

                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('rover.service')}</label>
                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', marginBottom: '2rem', outline: 'none' }}>
                        <option>{t('rover.opt_full')}</option>
                        <option>{t('rover.opt_soil')}</option>
                        <option>{t('rover.opt_pest')}</option>
                    </select>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleConfirm}>{t('rover.confirm')}</button>
                </div>
            </div>

            {showBookingPopup && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card glass-panel" style={{ textAlign: 'center', padding: '2rem', minWidth: '300px' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--color-success)' }}>Success</h2>
                        <p style={{ color: 'var(--color-text)', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '500' }}>Your order is placed.</p>
                        <button className="btn btn-primary" onClick={() => setShowBookingPopup(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};
