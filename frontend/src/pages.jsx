import React, { useState, useRef, useEffect } from 'react';
import { CloudSun, ActivitySquare, ShoppingBag, Landmark, Tractor, LayoutDashboard, Send, Mic } from 'lucide-react';
import { useLanguage } from './LanguageContext';

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
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am your AI personal farming assistant. How can I help you today?', id: 1 }
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
        setMessages(prev => [...prev, { sender: 'bot', text: 'Thinking...', id: thinkingId, isThinking: true }]);

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
            setMessages(prev => prev.map(m => m.id === thinkingId ? { sender: 'bot', text: 'Sorry, I am having trouble connecting to the network right now.', id: thinkingId } : m));
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
                        placeholder="Type your message..." 
                        style={{ flex: 1, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 1rem', color: 'var(--color-text)' }} 
                    />
                    <button onClick={handleSend} className="btn btn-primary"><Send size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export const Weather = () => (
    <div className="page-container animate-fade-in">
        <div className="card glass-panel text-center" style={{ padding: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
            <CloudSun size={64} color="var(--color-accent)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>32°C</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Partly Cloudy • Kerala</p>
        </div>
        <div className="grid-3">
            <div className="card"><h4 style={{ color: 'var(--color-text-muted)' }}>Humidity</h4><h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>78%</h3></div>
            <div className="card"><h4 style={{ color: 'var(--color-text-muted)' }}>Precipitation</h4><h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>10% chance</h3></div>
            <div className="card"><h4 style={{ color: 'var(--color-text-muted)' }}>Wind</h4><h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>12 km/h</h3></div>
        </div>
    </div>
);

export const Activity = () => (
    <div className="page-container animate-fade-in">
        <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Recent Activities</h3>
                <button className="btn btn-primary">+ New Log</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <strong>Harvested 50kg of Paddy</strong> - 2 days ago
                </div>
                <div style={{ padding: '1rem', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <strong>Applied Organic Fertilizer</strong> - 5 days ago
                </div>
            </div>
        </div>
    </div>
);

export const Marketplace = () => {
    const [activeCategory, setActiveCategory] = useState('seeds');
    const [cart, setCart] = useState([]);

    const categories = ['fruits', 'vegetables', 'seeds', 'pesticides'];
    
    const products = {
        fruits: [
            { id: 'f1', name: 'Alphonso Mango', price: 80 },
            { id: 'f2', name: 'Cavendish Banana', price: 40 },
            { id: 'f3', name: 'Nagpur Orange', price: 60 },
        ],
        vegetables: [
            { id: 'v1', name: 'Onion (Nashik)', price: 30 },
            { id: 'v2', name: 'Tomato', price: 25 },
            { id: 'v3', name: 'Potato', price: 20 },
        ],
        seeds: [
            { id: 's1', name: 'Organic Wheat Seeds', price: 450 },
            { id: 's2', name: 'Hybrid Tomato Seeds', price: 150 },
            { id: 's3', name: 'Paddy Seeds IR64', price: 600 },
        ],
        pesticides: [
            { id: 'p1', name: 'Neem Oil Extract', price: 250 },
            { id: 'p2', name: 'Bio-Fungicide', price: 300 },
            { id: 'p3', name: 'Organic Insecticide', price: 180 },
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
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid-3">
                    {products[activeCategory].map(item => (
                        <div key={item.id} className="card">
                            <div style={{ height: '150px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShoppingBag size={48} color="var(--color-text-muted)" opacity={0.3} />
                            </div>
                            <h4 style={{ fontSize: '1.2rem'}}>{item.name}</h4>
                            <p style={{ color: 'var(--color-primary-light)', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '0.5rem' }}>₹{item.price}/unit</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-primary" style={{ flex: 1, padding: '8px' }} onClick={() => addToCart(item, 'buy')}>Buy</button>
                                <button className="btn btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => addToCart(item, 'sell')}>Sell</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card glass-panel" style={{ flex: '1 1 300px', minWidth: '300px', height: 'fit-content', position: 'sticky', top: '2rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Your Cart</h3>
                {cart.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>Cart is empty</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: '500' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                                        {item.type} • Qty: {item.quantity}
                                    </div>
                                </div>
                                <div style={{ fontWeight: '600', color: item.type === 'buy' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                    {item.type === 'buy' ? '-' : '+'}₹{item.price * item.quantity}
                                </div>
                            </div>
                        ))}
                        
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Buy Total:</span>
                                <span style={{ color: 'var(--color-danger)', fontWeight: '600' }}>₹{buyTotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Sell Total:</span>
                                <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>₹{sellTotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span>Net:</span>
                                <span style={{ color: sellTotal - buyTotal >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                    {sellTotal - buyTotal >= 0 ? '+' : ''}₹{sellTotal - buyTotal}
                                </span>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Checkout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Schemes = () => (
    <div className="page-container animate-fade-in">
        <div className="grid-2">
            <div className="card glass-panel" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3>Pradhan Mantri Fasal Bima Yojana</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>Crop insurance scheme providing financial support to farmers.</p>
                <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Apply Now</button>
            </div>
            <div className="card glass-panel" style={{ borderLeft: '4px solid var(--color-accent)' }}>
                <h3>Kerala Agriculture Subsidy 2025</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>Subsidies on seeds and fertilizers for small-scale farmers.</p>
                <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>View Eligibility</button>
            </div>
        </div>
    </div>
);

export const RoverBooking = () => (
    <div className="page-container animate-fade-in">
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <Tractor size={64} color="var(--color-primary-light)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h2>Book Kisan Sakhi Rover</h2>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                Schedule the hardware rover to visit your field and perform automated soil testing and pest detection.
            </p>

            <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Date:</label>
                <input type="date" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', marginBottom: '1.5rem', outline: 'none' }} />

                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Service Needed:</label>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'white', marginBottom: '2rem', outline: 'none' }}>
                    <option>Full Report (Soil + Vision)</option>
                    <option>Soil Test Only</option>
                    <option>Pest Detection Only</option>
                </select>

                <button className="btn btn-primary" style={{ width: '100%' }}>Confirm Booking</button>
            </div>
        </div>
    </div>
);
