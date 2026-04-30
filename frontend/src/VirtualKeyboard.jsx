import React from 'react';

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

export const VirtualKeyboard = ({ lang, onKeyPress }) => {
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
