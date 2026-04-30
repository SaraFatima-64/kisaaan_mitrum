import React, { useState, useRef, useContext } from 'react';
import { useLanguage } from '../LanguageContext';
import { UserContext } from '../UserContext';
import { VirtualKeyboard } from '../VirtualKeyboard';


export const Activity = () => {
    const { t, language } = useLanguage();
    const { activityLogs, setActivityLogs, activityDraft, setActivityDraft, isActivityPopupOpen, setIsActivityPopupOpen } = useContext(UserContext);

    const defaultLogs = [
        { id: 1, title: t('activity.log1'), time: t('activity.log1_time') },
        { id: 2, title: t('activity.log2'), time: t('activity.log2_time') }
    ];

    const logs = activityLogs || defaultLogs;
    const setLogs = (newLogs) => setActivityLogs(newLogs);
    const showNewLogPopup = isActivityPopupOpen;
    const setShowNewLogPopup = setIsActivityPopupOpen;
    const newLogActivity = activityDraft;
    const setNewLogActivity = setActivityDraft;
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
                                padding: '1rem', color: 'var(--color-text)', marginBottom: '1rem', resize: 'none',
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
