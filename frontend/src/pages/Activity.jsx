import React, { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';

const VIRTUAL_LAYOUTS = {
    en: [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        ['SPACE', 'BACKSPACE']
    ],
    hi: [
        ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'],
        ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ'],
        ['ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब'],
        ['भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
        ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ं'],
        ['SPACE', 'BACKSPACE']
    ],
    ml: [
        ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'],
        ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ'],
        ['ട', 'ഠ', 'ഡ', 'ഢ', 'ണ', 'ത', 'ഥ', 'ദ', 'ധ', 'ന'],
        ['പ', 'ഫ', 'ബ', 'ഭ', 'മ', 'യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'],
        ['ാ', 'ി', 'ീ', 'ു', 'ൂ', 'െ', 'േ', 'ൈ', 'ൊ', 'ോ', 'ൗ'],
        ['SPACE', 'BACKSPACE']
    ]
};

const VirtualKeyboard = ({ lang, onKeyPress }) => {
    const layout = VIRTUAL_LAYOUTS[lang];
    if (!layout) return null;

    return (
        <div style={{ background: 'var(--color-surface-elevated)', padding: '10px', borderRadius: 'var(--radius-md)', marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {layout.map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '5px' }}>
                    {row.map(key => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onKeyPress(key)}
                            style={{
                                padding: key.length > 1 ? '8px 16px' : '8px 12px',
                                background: 'var(--color-bg)',
                                color: 'var(--color-text)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                flex: key === 'SPACE' ? 2 : 1
                            }}
                        >
                            {key === 'SPACE' ? '␣' : key === 'BACKSPACE' ? '⌫' : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export const Activity = () => {
    const { t, language } = useLanguage();
    const [logs, setLogs] = useState([
        { id: 1, title: t('activity.log1'), time: t('activity.log1_time') },
        { id: 2, title: t('activity.log2'), time: t('activity.log2_time') }
    ]);
    const [showNewLogPopup, setShowNewLogPopup] = useState(false);
    const [newLogActivity, setNewLogActivity] = useState('');
    const textareaRef = useRef(null);

    const handleSaveLog = () => {
        if (!newLogActivity.trim()) return;
        const newLog = {
            id: Date.now(),
            title: newLogActivity,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setLogs([newLog, ...logs]);
        setNewLogActivity('');
        setShowNewLogPopup(false);
    };

    const handleKeyboardPress = (key) => {
        const textarea = textareaRef.current;
        const start = textarea ? textarea.selectionStart : newLogActivity.length;
        const end = textarea ? textarea.selectionEnd : newLogActivity.length;
        
        let newText = newLogActivity;
        let newCursorPos = start;

        if (key === 'BACKSPACE') {
            if (start > 0 && start === end) {
                newText = newText.slice(0, start - 1) + newText.slice(end);
                newCursorPos = start - 1;
            } else if (start !== end) {
                newText = newText.slice(0, start) + newText.slice(end);
                newCursorPos = start;
            }
        } else {
            const char = key === 'SPACE' ? ' ' : key;
            newText = newText.slice(0, start) + char + newText.slice(end);
            newCursorPos = start + char.length;
        }

        setNewLogActivity(newText);
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{t('activity.recent')}</h3>
                    <button className="btn btn-primary" onClick={() => setShowNewLogPopup(true)}>{t('activity.new_log')}</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                    {logs.map(log => (
                        <div key={log.id} style={{ padding: '1rem', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                            <strong>{log.title}</strong> - {log.time}
                        </div>
                    ))}
                </div>
            </div>

            {showNewLogPopup && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card glass-panel" style={{ padding: '2rem', minWidth: '400px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ marginBottom: '1rem', flexShrink: 0 }}>{t('activity.new_log')}</h2>
                        <textarea
                            ref={textareaRef}
                            value={newLogActivity}
                            onChange={(e) => setNewLogActivity(e.target.value)}
                            placeholder="Enter activity details..."
                            style={{
                                width: '100%', minHeight: '80px', flexShrink: 0, background: 'var(--color-surface-elevated)',
                                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                                padding: '1rem', color: 'white', marginBottom: '1rem', resize: 'none',
                                outline: 'none', fontSize: '1.1rem'
                            }}
                        />
                        
                        <div style={{ overflowY: 'auto', overflowX: 'auto', flex: 1, minHeight: 0, paddingBottom: '10px' }}>
                            {(language === 'hi' || language === 'ml' || language === 'en') && (
                                <VirtualKeyboard lang={language} onKeyPress={handleKeyboardPress} />
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexShrink: 0 }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowNewLogPopup(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveLog}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
