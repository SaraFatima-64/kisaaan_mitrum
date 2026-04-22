import React, { useContext } from 'react';
import { CloudSun } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { UserContext } from '../UserContext';

export const Weather = () => {
    const { t } = useLanguage();
    const { user } = useContext(UserContext);
    const displayState = user?.stateName ? user.stateName : 'Kerala';

    const getMockWeather = (state) => {
        let hash = 0;
        for (let i = 0; i < state.length; i++) {
            hash = state.charCodeAt(i) + ((hash << 5) - hash);
        }
        return {
            temp: 20 + Math.abs(hash % 20),
            humidity: 40 + Math.abs(hash % 50),
            precip: Math.abs(hash % 40),
            wind: 5 + Math.abs(hash % 25)
        };
    };

    const weatherData = getMockWeather(displayState);

    return (
        <div className="page-container animate-fade-in">
            <div className="card glass-panel text-center" style={{ padding: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
                <CloudSun size={64} color="var(--color-accent)" style={{ margin: '0 auto 1rem auto' }} />
                <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>{weatherData.temp}°C</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>{t('weather.partly_cloudy').replace('Kerala', displayState).replace('केरल', displayState).replace('കേരളം', displayState)}</p>
            </div>
            <div className="grid-3">
                <div className="card"><h4 style={{ color: 'var(--color-text-muted)' }}>{t('weather.humidity')}</h4><h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{weatherData.humidity}%</h3></div>
                <div className="card"><h4 style={{ color: 'var(--color-text-muted)' }}>{t('weather.precipitation')}</h4><h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{weatherData.precip}% {t('weather.chance')}</h3></div>
                <div className="card"><h4 style={{ color: 'var(--color-text-muted)' }}>{t('weather.wind')}</h4><h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{weatherData.wind} km/h</h3></div>
            </div>
        </div>
    );
};
