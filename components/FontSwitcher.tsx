'use client';

import { useEffect, useRef, useState } from 'react';

type FontOption = {
  id: string;
  label: string;
  stack: string;
};

type FontSettings = {
  titleFontId: string;
  bodyFontId: string;
  titleWeight: number;
  bodyWeight: number;
};

const STORAGE_KEY = 'rivulet-site-typography';

const FONT_OPTIONS: FontOption[] = [
  { id: 'instrument', label: 'Instrument Sans', stack: "'Instrument Sans', sans-serif" },
  { id: 'fraunces', label: 'Fraunces', stack: "'Fraunces', serif" },
  { id: 'bebas', label: 'Bebas Neue', stack: "'Bebas Neue', sans-serif" },
  { id: 'space', label: 'Space Mono', stack: "'Space Mono', monospace" },
  { id: 'cormorant', label: 'Cormorant Garamond', stack: "'Cormorant Garamond', serif" },
  { id: 'inter', label: 'Inter', stack: "'Inter', sans-serif" },
  { id: 'poppins', label: 'Poppins', stack: "'Poppins', sans-serif" },
  { id: 'manrope', label: 'Manrope', stack: "'Manrope', sans-serif" },
  { id: 'dmsans', label: 'DM Sans', stack: "'DM Sans', sans-serif" },
  { id: 'worksans', label: 'Work Sans', stack: "'Work Sans', sans-serif" },
  { id: 'playfair', label: 'Playfair Display', stack: "'Playfair Display', serif" },
  { id: 'lora', label: 'Lora', stack: "'Lora', serif" },
  { id: 'merriweather', label: 'Merriweather', stack: "'Merriweather', serif" },
  { id: 'montserrat', label: 'Montserrat', stack: "'Montserrat', sans-serif" },
  { id: 'oswald', label: 'Oswald', stack: "'Oswald', sans-serif" },
];

const DEFAULT_SETTINGS: FontSettings = {
  titleFontId: 'fraunces',
  bodyFontId: 'instrument',
  titleWeight: 300,
  bodyWeight: 400,
};

function applyTypography(settings: FontSettings) {
  const titleFont = FONT_OPTIONS.find((font) => font.id === settings.titleFontId) || FONT_OPTIONS[1];
  const bodyFont = FONT_OPTIONS.find((font) => font.id === settings.bodyFontId) || FONT_OPTIONS[0];
  document.documentElement.style.setProperty('--title-font', titleFont.stack);
  document.documentElement.style.setProperty('--body-font', bodyFont.stack);
  document.documentElement.style.setProperty('--title-weight', String(settings.titleWeight));
  document.documentElement.style.setProperty('--body-weight', String(settings.bodyWeight));
}

export default function FontSwitcher() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<FontSettings>(DEFAULT_SETTINGS);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedRaw = localStorage.getItem(STORAGE_KEY);
    if (!savedRaw) {
      applyTypography(DEFAULT_SETTINGS);
      return;
    }
    try {
      const saved = JSON.parse(savedRaw) as Partial<FontSettings>;
      const nextSettings: FontSettings = {
        titleFontId: typeof saved.titleFontId === 'string' ? saved.titleFontId : 'fraunces',
        bodyFontId: typeof saved.bodyFontId === 'string' ? saved.bodyFontId : 'instrument',
        titleWeight: typeof saved.titleWeight === 'number' ? saved.titleWeight : 300,
        bodyWeight: typeof saved.bodyWeight === 'number' ? saved.bodyWeight : 400,
      };
      setSettings(nextSettings);
      applyTypography(nextSettings);
    } catch {
      applyTypography(DEFAULT_SETTINGS);
    }
  }, []);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!open || !panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const setAndPersist = (nextSettings: FontSettings) => {
    setSettings(nextSettings);
    applyTypography(nextSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
  };

  const onFontSelect = (target: 'titleFontId' | 'bodyFontId', fontId: string) => {
    const nextSettings = { ...settings, [target]: fontId };
    setAndPersist(nextSettings);
  };

  const onWeightChange = (target: 'titleWeight' | 'bodyWeight', value: string) => {
    const weight = Math.min(700, Math.max(100, Number(value)));
    const nextSettings = { ...settings, [target]: weight };
    setAndPersist(nextSettings);
  };

  return (
    <div className="font-switcher" ref={panelRef}>
      {open && (
        <div id="font-popup" className="font-popup" role="dialog" aria-label="Typography selector">
          <div className="font-popup-head">Typography Studio</div>
          <div className="font-group">
            <div className="font-group-title">Title font</div>
            <div className="font-popup-list">
              {FONT_OPTIONS.map((font) => (
                <button
                  type="button"
                  key={`title-${font.id}`}
                  className={`font-option${settings.titleFontId === font.id ? ' active' : ''}`}
                  style={{ '--sample-font': font.stack } as React.CSSProperties}
                  onClick={() => onFontSelect('titleFontId', font.id)}
                >
                  <span className="font-option-name">{font.label}</span>
                  <span className="font-option-preview">Headlines and section titles</span>
                </button>
              ))}
            </div>
            <div className="font-weight-wrap">
              <label htmlFor="title-weight">Title weight: {settings.titleWeight}</label>
              <input
                id="title-weight"
                type="range"
                min="100"
                max="700"
                step="100"
                value={settings.titleWeight}
                onChange={(event) => onWeightChange('titleWeight', event.target.value)}
              />
            </div>
          </div>
          <div className="font-group">
            <div className="font-group-title">Paragraph font</div>
            <div className="font-popup-list">
              {FONT_OPTIONS.map((font) => (
                <button
                  type="button"
                  key={`body-${font.id}`}
                  className={`font-option${settings.bodyFontId === font.id ? ' active' : ''}`}
                  style={{ '--sample-font': font.stack } as React.CSSProperties}
                  onClick={() => onFontSelect('bodyFontId', font.id)}
                >
                  <span className="font-option-name">{font.label}</span>
                  <span className="font-option-preview">Paragraphs, labels, and body text</span>
                </button>
              ))}
            </div>
            <div className="font-weight-wrap">
              <label htmlFor="body-weight">Paragraph weight: {settings.bodyWeight}</label>
              <input
                id="body-weight"
                type="range"
                min="100"
                max="700"
                step="100"
                value={settings.bodyWeight}
                onChange={(event) => onWeightChange('bodyWeight', event.target.value)}
              />
            </div>
          </div>
          <div className="font-live-preview">
            <h4>Live preview title</h4>
            <p>This is how your paragraph text will look across the website.</p>
          </div>
        </div>
      )}
      <button
        type="button"
        className="font-fab"
        aria-expanded={open}
        aria-controls="font-popup"
        onClick={() => setOpen((value) => !value)}
      >
        Type
      </button>
    </div>
  );
}
