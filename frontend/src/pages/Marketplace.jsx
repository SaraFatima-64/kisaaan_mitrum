import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

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
