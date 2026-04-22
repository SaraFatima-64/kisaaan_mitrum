import React, { useState, useRef, useEffect, useContext } from 'react';
import { CloudSun, ActivitySquare, ShoppingBag, Landmark, Tractor, LayoutDashboard, Send, Mic } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { UserContext } from './UserContext';

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

export const Marketplace = () => {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('fruits');
    const [cart, setCart] = useState([]);
    const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

    const categories = ['fruits', 'vegetables', 'seeds', 'pesticides'];

    const products = {
        fruits: [
            { id: 'f1', name: 'Alphonso Mango', price: 80, img: '/mango.png' },
            { id: 'f2', name: 'Cavendish Banana', price: 40, img: '/banana.png' },
            { id: 'f3', name: 'Nagpur Orange', price: 60, img: '/orange.png' },
        ],
        vegetables: [
            { id: 'v1', name: 'Onion (Nashik)', price: 30, img: '/onion.png' },
            { id: 'v2', name: 'Tomato', price: 25, img: '/tomato.png' },
            { id: 'v3', name: 'Potato', price: 20, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=300' },
        ],
        seeds: [
            { id: 's1', name: 'Organic Wheat Seeds', price: 450, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300' },
            { id: 's2', name: 'Hybrid Tomato Seeds', price: 150, img: 'https://images.unsplash.com/photo-1508595165502-3e2652e5a405?auto=format&fit=crop&q=80&w=300' },
            { id: 's3', name: 'Paddy Seeds IR64', price: 600, img: '/paddy_seed.jpg' },
        ],
        pesticides: [
            { id: 'p1', name: 'Neem Oil Extract', price: 250, img: '/neem_oil_extract.jpg' },
            { id: 'p2', name: 'Bio-Fungicide', price: 300, img: '/bio_fungicide.jpg' },
            { id: 'p3', name: 'Organic Insecticide', price: 180, img: '/organic_insecticide.jpg' },
        ]
    };

    const addToCart = (item, type) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id && i.type === type);
            if (existing) {
                return prev.map(i => i.id === item.id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, type, quantity: 1 }];
        });
    };

    const updateQuantity = (item, delta) => {
        setCart(prev => {
            return prev.map(i => {
                if (i.id === item.id && i.type === item.type) {
                    return { ...i, quantity: i.quantity + delta };
                }
                return i;
            }).filter(i => i.quantity > 0);
        });
    };

    const handleCheckout = () => {
        setShowCheckoutPopup(true);
        setCart([]);
    };

    const buyTotal = cart.filter(i => i.type === 'buy').reduce((sum, item) => sum + item.price * item.quantity, 0);
    const sellTotal = cart.filter(i => i.type === 'sell').reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="page-container animate-fade-in" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 60%' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveCategory(cat)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {t(`market.${cat}`)}
                        </button>
                    ))}
                </div>

                <div className="grid-3">
                    {products[activeCategory].map(item => (
                        <div key={item.id} className="card">
                            <div style={{ height: '150px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {item.img ? (
                                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ShoppingBag size={48} color="var(--color-text-muted)" opacity={0.3} />
                                )}
                            </div>
                            <h4 style={{ fontSize: '1.2rem' }}>{item.name}</h4>
                            <p style={{ color: 'var(--color-primary-light)', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '0.5rem' }}>₹{item.price}{t('market.unit')}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-primary" style={{ flex: 1, padding: '8px' }} onClick={() => addToCart(item, 'buy')}>{t('market.buy')}</button>
                                <button className="btn btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => addToCart(item, 'sell')}>{t('market.sell')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card glass-panel" style={{ flex: '1 1 300px', minWidth: '300px', height: 'fit-content', position: 'sticky', top: '2rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>{t('market.cart')}</h3>
                {cart.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>{t('market.empty')}</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500' }}>{item.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'capitalize', marginTop: '0.25rem' }}>
                                        {t(`market.${item.type}`)} • {t('market.qty')}:
                                        <button onClick={() => updateQuantity(item, -1)} style={{ padding: '0 5px', fontSize: '1rem', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                                        <span style={{ fontWeight: '600' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item, 1)} style={{ padding: '0 5px', fontSize: '1rem', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                                <div style={{ fontWeight: '600', color: item.type === 'buy' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                    {item.type === 'buy' ? '-' : '+'}₹{item.price * item.quantity}
                                </div>
                            </div>
                        ))}

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{t('market.buy_total')}</span>
                                <span style={{ color: 'var(--color-danger)', fontWeight: '600' }}>₹{buyTotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>{t('market.sell_total')}</span>
                                <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>₹{sellTotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span>{t('market.net')}</span>
                                <span style={{ color: sellTotal - buyTotal >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                    {sellTotal - buyTotal >= 0 ? '+' : ''}₹{sellTotal - buyTotal}
                                </span>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCheckout}>{t('market.checkout')}</button>
                    </div>
                )}
            </div>

            {showCheckoutPopup && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card glass-panel" style={{ textAlign: 'center', padding: '2rem', minWidth: '300px' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--color-success)' }}>Success</h2>
                        <p style={{ color: 'var(--color-text)', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '500' }}>Your order is placed, thank you.</p>
                        <button className="btn btn-primary" onClick={() => setShowCheckoutPopup(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const STATE_SCHEMES = {
    "Andhra Pradesh": { title: "YSR Rythu Bharosa", desc: "Financial assistance of ₹13,500 per farmer family per year to support agriculture." },
    "Arunachal Pradesh": { title: "Atma Nirbhar Krishi Yojana", desc: "Front-ended subsidies for agricultural infrastructure and farm mechanization." },
    "Assam": { title: "CM Samagra Gramya Unnayan Yojana", desc: "Promotes farm mechanization with up to 75% subsidy on tractors and equipment." },
    "Bihar": { title: "Bihar Krishi Input Subsidy", desc: "Grants given directly to farmers for the purchase of seeds, fertilizers, and irrigation." },
    "Chhattisgarh": { title: "Rajiv Gandhi Kisan Nyay Yojana", desc: "Direct benefit transfer to encourage crop production and diversification." },
    "Goa": { title: "Shetkari Aadhaar Nidhi", desc: "Compensation for crop losses due to natural calamities or wild animals." },
    "Gujarat": { title: "Mukhyamantri Kisan Sahay Yojana", desc: "Crop compensation scheme providing free drought, flood, and unseasonal rain insurance." },
    "Haryana": { title: "Bhavantar Bharpayee Yojana", desc: "Ensures risk mitigation by providing minimum floor prices for vegetable and fruit crops." },
    "Himachal Pradesh": { title: "MMKUSY", desc: "Subsidies for building greenhouses and anti-hail nets to protect specific crops." },
    "Jharkhand": { title: "Mukhya Mantri Krishi Ashirwad Yojana", desc: "Financial assistance to small and marginal farmers per acre of agricultural land." },
    "Karnataka": { title: "Krishi Bhagya", desc: "Focuses on rain-fed agriculture by providing subsidies for polythene-lined farm ponds." },
    "Kerala": { title: "Subhiksha Keralam", desc: "Comprehensive food security initiative promoting integrated farming and fallow land cultivation." },
    "Madhya Pradesh": { title: "Mukhyamantri Kisan Kalyan Yojana", desc: "Additional financial assistance of ₹4,000 annually to PM-KISAN beneficiaries." },
    "Maharashtra": { title: "Namo Shetkari Maha Sanman Nidhi", desc: "An additional ₹6,000 annually to state farmers alongside PM-KISAN." },
    "Manipur": { title: "MOVCDNER State Scheme", desc: "End-to-end support for organic farming, processing, and marketing." },
    "Meghalaya": { title: "FOCUS", desc: "Financial assistance to producer groups for upscaling production and value addition." },
    "Mizoram": { title: "SEDP Agriculture Policy", desc: "Grants for self-sufficiency in cash crops, food processing, and sustainable farming." },
    "Nagaland": { title: "Naga-Model Settled Farming", desc: "Promotes systematic terrace cultivation to replace shifting agriculture." },
    "Odisha": { title: "KALIA Scheme", desc: "Financial assistance for small farmers, landless agricultural households, and vulnerable groups." },
    "Punjab": { title: "Pani Bachao, Paise Kamao", desc: "Incentivizing farmers for reducing groundwater usage through efficient irrigation practices." },
    "Rajasthan": { title: "Mukhyamantri Kisan Mitra Urja Yojana", desc: "Subsidy of ₹1,000 per month on agricultural electricity bills for farmers." },
    "Sikkim": { title: "Mukhya Mantri Krishi Samman Yojana", desc: "Promoting certified 100% organic farming and supporting rural farmer incomes." },
    "Tamil Nadu": { title: "Kuruvai Cultivation Package", desc: "Provision of subsidized seeds, fertilizers, and farm machinery for the Kuruvai season." },
    "Telangana": { title: "Rythu Bandhu", desc: "Investment support scheme offering ₹5,000 per acre per season for crop inputs." },
    "Tripura": { title: "Chief Minister’s Rubber Mission", desc: "Providing financial and technical assistance to expand rubber plantations." },
    "Uttar Pradesh": { title: "Mukhyamantri Krishak Durghatna Yojana", desc: "Financial assistance to the families of farmers in the event of accidental death or disability." },
    "Uttarakhand": { title: "Mukhya Mantri Krishi Vikas Yojana", desc: "Providing high-yielding seeds, minor irrigation, and mechanization support." },
    "West Bengal": { title: "Krishak Bandhu", desc: "Assured financial assistance and a death benefit scheme for farmer families." }
};

export const Schemes = () => {
    const { t } = useLanguage();
    const { user } = useContext(UserContext);
    const displayState = user?.stateName ? user.stateName : 'Kerala';

    const [activeScheme, setActiveScheme] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showEligibility, setShowEligibility] = useState(false);

    const [formData, setFormData] = useState({ name: '', aadhaar: '', phone: '' });

    const stateScheme = STATE_SCHEMES[displayState] || {
        title: `Rashtriya Krishi Vikas Yojana (${displayState})`,
        desc: "State-implemented central scheme to ensure holistic development of agriculture and allied sectors."
    };

    const handleApplyClick = (schemeTitle) => {
        setActiveScheme(schemeTitle);
        setFormData({ name: '', aadhaar: '', phone: '' });
        setShowApplyForm(true);
    };

    const handleEligibilityClick = (schemeTitle) => {
        setActiveScheme(schemeTitle);
        setShowEligibility(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowApplyForm(false);
        setShowSuccess(true);
    };

    const closeAllPopups = () => {
        setShowApplyForm(false);
        setShowSuccess(false);
        setShowEligibility(false);
    };

    // Attempt to stringify a title translated key or fallback
    const pmfbyTitle = t('schemes.pmfby.title') || 'PMFBY';

    return (
        <div className="page-container animate-fade-in">
            <div className="grid-2">
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                    <h3>{pmfbyTitle}</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{t('schemes.pmfby.desc')}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => handleApplyClick(pmfbyTitle)}>Apply Now</button>
                        <button className="btn btn-secondary" onClick={() => handleEligibilityClick(pmfbyTitle)}>View Eligibility</button>
                    </div>
                </div>
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--color-accent)' }}>
                    <h3>{stateScheme.title}</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{stateScheme.desc}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => handleApplyClick(stateScheme.title)}>Apply Now</button>
                        <button className="btn btn-secondary" onClick={() => handleEligibilityClick(stateScheme.title)}>View Eligibility</button>
                    </div>
                </div>
            </div>

            {showApplyForm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card glass-panel" style={{ padding: '2rem', minWidth: '350px', maxWidth: '90vw' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Apply for Scheme</h2>
                        <p style={{ color: 'var(--color-primary-light)', marginBottom: '1rem', fontWeight: '500' }}>{activeScheme}</p>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Aadhaar Number</label>
                                <input required type="text" pattern="\d{12}" title="12 digit Aadhaar number" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                                <input required type="tel" pattern="\d{10}" title="10 digit phone number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={closeAllPopups}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Proceed</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card glass-panel" style={{ textAlign: 'center', padding: '2rem', minWidth: '300px' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--color-success)' }}>Success</h2>
                        <p style={{ color: 'var(--color-text)', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '500' }}>Your application has been submitted successfully.</p>
                        <button className="btn btn-primary" onClick={closeAllPopups}>OK</button>
                    </div>
                </div>
            )}

            {showEligibility && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card glass-panel" style={{ padding: '2rem', minWidth: '350px', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Eligibility Criteria</h2>
                        <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '1rem' }}>{activeScheme}</h3>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--color-text)', lineHeight: '1.6', marginBottom: '2rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Must be a practicing farmer with cultivable land.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Should possess a valid Aadhaar Card.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Must have an active bank account linked with Aadhaar.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Should not be an institutional landholder or filing income tax.</li>
                        </ul>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={closeAllPopups}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

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
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: `1px solid ${error ? 'var(--color-danger, red)' : 'var(--color-border)'}`, color: 'white', marginBottom: error ? '0.5rem' : '1.5rem', outline: 'none' }} 
                    />
                    {error && <p style={{ color: 'var(--color-danger, red)', fontSize: '0.9rem', marginBottom: '1rem', marginTop: '-0.25rem' }}>{error}</p>}

                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('rover.service')}</label>
                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', marginBottom: '2rem', outline: 'none' }}>
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
