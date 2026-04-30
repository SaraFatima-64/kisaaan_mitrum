import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, Mic } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { UserContext } from '../UserContext';
import { VirtualKeyboard } from '../VirtualKeyboard';

export const Chatbot = () => {
    const { t, language } = useLanguage();
    const { chatMessages, setChatMessages, chatbotInput, setChatbotInput, user } = useContext(UserContext);

    const defaultMessages = [
        { sender: 'bot', text: t('chat.placeholder') === 'Type your message...' ? 'Hello! I am your AI personal farming assistant. How can I help you today?' : 'नमस्ते! मैं आपका एआई व्यक्तिगत कृषि सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं? / നമസ്കാരം! ഞാൻ നിങ്ങളുടെ എഐ വ്യക്തിഗത കാർഷിക സഹായിയാണ്. എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?', id: 1 }
    ];

    const messages = chatMessages || defaultMessages;

    const setMessages = (action) => {
        setChatMessages(prev => {
            const currentMessages = prev || defaultMessages;
            return typeof action === 'function' ? action(currentMessages) : action;
        });
    };
    const inputText = chatbotInput;
    const setInputText = setChatbotInput;
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const handleKeyboardPress = (key) => {
        const input = inputRef.current;
        const start = input ? input.selectionStart : inputText.length;
        const end = input ? input.selectionEnd : inputText.length;
        
        let newText = inputText;
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

        setInputText(newText);
        
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = { sender: 'user', text: inputText, id: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Add thinking message
        const thinkingId = Date.now() + 1;
        setMessages(prev => [...prev, { sender: 'bot', text: t('chat.thinking'), id: thinkingId, isThinking: true }]);

        const stateName = user?.stateName || 'Kerala';
        const weather = user ? getMockWeather(stateName) : null;
        const dashboard = user ? { moisture: "42%", ph: 6.5, pests: "none" } : null;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMsg.text,
                    stateName,
                    weather,
                    dashboard,
                    language
                }),
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
        if (language === 'hi') {
            recognition.lang = 'hi-IN';
        } else if (language === 'ml') {
            recognition.lang = 'ml-IN';
        } else {
            recognition.lang = 'en-US';
        }
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
                <div style={{ borderTop: '1px solid var(--color-border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={toggleMic} className={`btn ${isRecording ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '10px', background: isRecording ? 'red' : '', borderColor: isRecording ? 'red' : '' }}>
                            <Mic size={20} />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('chat.placeholder')}
                            style={{ flex: 1, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 1rem', color: 'var(--color-text)' }}
                        />
                        <button onClick={handleSend} className="btn btn-primary"><Send size={20} /></button>
                    </div>
                    {(language === 'hi' || language === 'ml') && (
                        <div style={{ overflowY: 'auto', overflowX: 'auto', minHeight: 0 }}>
                            <VirtualKeyboard lang={language} onKeyPress={handleKeyboardPress} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
