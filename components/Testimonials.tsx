'use client';
import { useEffect, useRef, useState } from 'react';

const testimonials = [
  { initials: 'AR', text: 'Rivuletduo transformed our online presence. Beautiful, fast, and our conversions jumped 40% in the first month.', name: 'Arjun Rajan', role: 'Founder, Verdant Goods' },
  { initials: 'SM', text: 'A complex dashboard in two weeks, on budget, zero compromise on quality. Genuinely impressive duo.', name: 'Sofia Mercer', role: 'CTO, FlowMetrics' },
  { initials: 'DK', text: 'Felt like having an in-house team. Communication was clear, feedback welcomed, and the result exceeded expectations.', name: 'Devika Kumar', role: 'Creative Director, Celadon Studio' },
  { initials: 'JT', text: "I've worked with bigger agencies — Rivuletduo care more. It shows in every single detail of the final site.", name: 'James Tan', role: 'Founder, Heliostack' },
];

const DELAY = 4500;

function pad(n: number) { return String(n + 1).padStart(2, '0'); }

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [anim, setAnim] = useState<{ [key: number]: string }>({ 0: 'rvt__active' });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchXRef = useRef(0);
  const TOTAL = testimonials.length;

  function goTo(next: number, dir: 'left' | 'right') {
    if (next === current) return;
    const prev = current;
    setAnim(a => ({
      ...a,
      [prev]: dir === 'left' ? 'rvt__exit-left' : 'rvt__exit-right',
      [next]: dir === 'left' ? 'rvt__enter-right' : 'rvt__enter-left',
    }));
    setTimeout(() => {
      setAnim({ [next]: 'rvt__active' });
      setCurrent(next);
    }, 460);
    startAuto(next);
  }

  function nextSlide() { goTo((current + 1) % TOTAL, 'left'); }
  function prevSlide() { goTo((current - 1 + TOTAL) % TOTAL, 'right'); }

  function startAuto(cur = current) {
    if (timerRef.current) clearTimeout(timerRef.current);
    const prog = progRef.current;
    if (prog) {
      prog.classList.remove('rvt__running');
      void prog.offsetWidth;
      prog.style.setProperty('--rvt-dur', DELAY + 'ms');
      prog.classList.add('rvt__running');
    }
    timerRef.current = setTimeout(() => goTo((cur + 1) % TOTAL, 'left'), DELAY);
  }

  useEffect(() => {
    startAuto(0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEnter = () => { if (timerRef.current) clearTimeout(timerRef.current); };
  const handleMouseLeave = () => { timerRef.current = setTimeout(() => nextSlide(), DELAY); };

  return (
    <section id="testi">
      <div className="rvt__section">
        <div className="rvt__label">Testimonials</div>
        <h2 className="rvt__heading">Clients who <em>trust</em> us</h2>
        <div
          className="rvt__slider"
          ref={sliderRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={e => { touchXRef.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchXRef.current;
            if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`rvt__card ${anim[i] || ''}`}
            >
              <p className="rvt__text">{t.text}</p>
              <div className="rvt__author">
                <div className="rvt__avatar">{t.initials}</div>
                <div>
                  <div className="rvt__name">{t.name}</div>
                  <div className="rvt__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="rvt__progress rvt__running" ref={progRef} />
        </div>

        <div className="rvt__controls">
          <div className="rvt__dots">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`rvt__dot ${i === current ? 'rvt__dot-active' : ''}`}
                onClick={() => goTo(i, i > current ? 'left' : 'right')}
              />
            ))}
          </div>
          <div className="rvt__counter">
            <b>{pad(current)}</b> / <span>{String(TOTAL).padStart(2, '0')}</span>
          </div>
          <div className="rvt__arrows">
            <button className="rvt__arr" onClick={prevSlide}>
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button className="rvt__arr" onClick={nextSlide}>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
