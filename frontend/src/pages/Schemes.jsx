import React, { useState, useContext } from 'react';
import { useLanguage } from '../LanguageContext';
import { UserContext } from '../UserContext';

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
