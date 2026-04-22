import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Chatbot = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([
        { sender: 'bot', text: t('chat.placeholder') === 'Type your message...' ? 'Hello! I am your AI personal farming assistant. How can I help you today?' : 'नमस्ते! मैं आपका एआई व्यक्तिगत कृषि सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं? / നമസ്കാരം! ഞാൻ നിങ്ങളുടെ എഐ വ്യക്തിഗത കാർഷിക സഹായിയാണ്. എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?', id: 1 }
    ]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = { sender: 'user', text: inputText, id: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Add thinking message
        const thinkingId = Date.now() + 1;
        setMessages(prev => [...prev, { sender: 'bot', text: t('chat.thinking'), id: thinkingId, isThinking: true }]);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text }),
            });
            const data = await res.json();

            // Replaces "Thinking..." with actual reply
            setMessages(prev => prev.map(m => m.id === thinkingId ? { sender: 'bot', text: data.response, id: thinkingId } : m));
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => prev.map(m => m.id === thinkingId ? { sender: 'bot', text: t('chat.error'), id: thinkingId } : m));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const toggleMic = () => {
        if (isRecording) {
            setIsRecording(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Speech Recognition.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
        };

        recognition.start();
    };

    return (
        <div className="page-container animate-fade-in" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: '1rem 2rem' }}>
            <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            background: msg.sender === 'user' ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                            color: msg.sender === 'user' ? 'white' : 'var(--color-text)',
                            padding: '1rem',
                            borderRadius: msg.sender === 'user' ? 'var(--radius-md) var(--radius-md) 0 var(--radius-md)' : 'var(--radius-md) var(--radius-md) var(--radius-md) 0',
                            maxWidth: '80%',
                            marginLeft: msg.sender === 'user' ? 'auto' : '0',
                            marginBottom: '1rem',
                            opacity: msg.isThinking ? 0.7 : 1
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', padding: '1rem', display: 'flex', gap: '1rem' }}>
                    <button onClick={toggleMic} className={`btn ${isRecording ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px', background: isRecording ? 'red' : '', borderColor: isRecording ? 'red' : '' }}>
                        <Mic size={20} />
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('chat.placeholder')}
                        style={{ flex: 1, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 1rem', color: 'var(--color-text)' }}
                    />
                    <button onClick={handleSend} className="btn btn-primary"><Send size={20} /></button>
                </div>
            </div>
        </div>
    );
};
