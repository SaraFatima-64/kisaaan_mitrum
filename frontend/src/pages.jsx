import React, { useState, useRef, useEffect } from 'react';
import { CloudSun, ActivitySquare, ShoppingBag, Landmark, Tractor, LayoutDashboard, Send, Mic } from 'lucide-react';

export const Dashboard = () => (
    <div className="page-container animate-fade-in">
        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
                <h3 style={{ color: 'var(--color-primary-light)' }}>Soil Moisture</h3>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '1rem' }}>42%</div>
                <p style={{ color: 'var(--color-text-muted)' }}>Optimal range</p>
            </div>
            <div className="card">
                <h3 style={{ color: 'var(--color-primary-light)' }}>Soil pH</h3>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '1rem' }}>6.5</div>
                <p style={{ color: 'var(--color-text-muted)' }}>Slightly acidic</p>
            </div>
            <div className="card">
                <h3 style={{ color: 'var(--color-primary-light)' }}>Last Scan</h3>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '1rem' }}>2h ago</div>
                <p style={{ color: 'var(--color-success)' }}>No pests detected</p>
            </div>
        </div>

        <div className="card glass-panel" style={{ marginTop: '2rem' }}>
            <h3>Recent Rover Images (Kisan Sakhi)</h3>
            <div className="grid-4" style={{ marginTop: '1rem' }}>
                <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
                <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
                <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
                <div style={{ height: '120px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}></div>
            </div>
        </div>
    </div>
);

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

export const Marketplace = () => (
    <div className="page-container animate-fade-in">
        <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card">
                    <div style={{ height: '150px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }} />
                    <h4>Organic Seeds Pack {i}</h4>
                    <p style={{ color: 'var(--color-primary-light)', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '0.5rem' }}>₹450</p>
                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Add to Cart</button>
                </div>
            ))}
        </div>
    </div>
);

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
