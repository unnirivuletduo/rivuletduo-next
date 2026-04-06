'use client';
import { useEffect } from 'react';
import type { HomeProcessStep } from '@/lib/cms';

const steps = [
  {
    n: '01', title: 'Discovery',
    desc: 'We listen before we build. Deep dives into goals, audience, and constraints — mapping every variable before a pixel is placed.',
    tags: ['Research', 'Interviews', 'Brief'],
    icon: (
      <svg viewBox="0 0 72 72">
        <circle className="ic" cx="36" cy="36" r="32" />
        <path className="ip" strokeDasharray="200" strokeDashoffset="200" d="M18 38 C18 26 26 18 36 18 C46 18 54 26 54 38" />
        <rect className="ip" strokeDasharray="60" strokeDashoffset="60" x="14" y="36" width="8" height="13" rx="4" />
        <rect className="ip" strokeDasharray="60" strokeDashoffset="60" x="50" y="36" width="8" height="13" rx="4" />
        <circle className="ip" strokeDasharray="20" strokeDashoffset="20" cx="36" cy="38" r="2.5" />
      </svg>
    ),
    arc: 'M-50 60 Q 225 -30 450 60 Q 675 150 950 60',
  },
  {
    n: '02', title: 'Design',
    desc: 'Wireframes to pixel-perfect mockups. Rapid iteration with you in the loop at every step — nothing moves forward without your sign-off.',
    tags: ['Wireframes', 'Prototypes', 'UI/UX'],
    icon: (
      <svg viewBox="0 0 72 72">
        <circle className="ic" cx="36" cy="36" r="32" />
        <rect className="ip" strokeDasharray="120" strokeDashoffset="120" x="16" y="16" width="40" height="30" rx="2" />
        <line className="ip" strokeDasharray="42" strokeDashoffset="42" x1="16" y1="26" x2="56" y2="26" />
        <path className="ip" strokeDasharray="80" strokeDashoffset="80" d="M38 34 L38 52 L42 47 L47 55 L50 53 L45 45 L51 45 Z" />
      </svg>
    ),
    arc: 'M-50 30 Q 150 110 350 40 Q 550 -30 750 60 Q 850 90 950 50',
  },
  {
    n: '03', title: 'Build',
    desc: "Production-grade code, rigorously tested across every device and edge case. We don't ship half-finished work — quality is non-negotiable.",
    tags: ['Engineering', 'QA', 'Performance'],
    icon: (
      <svg viewBox="0 0 72 72">
        <circle className="ic" cx="36" cy="36" r="32" />
        <path className="ip" strokeDasharray="80" strokeDashoffset="80" d="M28 24 L16 36 L28 48" />
        <path className="ip" strokeDasharray="80" strokeDashoffset="80" d="M44 24 L56 36 L44 48" />
        <line className="ip" strokeDasharray="30" strokeDashoffset="30" x1="33" y1="20" x2="39" y2="52" />
        <circle className="ip" strokeDasharray="16" strokeDashoffset="16" cx="36" cy="36" r="2.5" />
      </svg>
    ),
    arc: 'M-50 60 L 80 20 L 200 80 L 320 15 L 440 70 L 560 25 L 680 65 L 800 30 L 950 60',
  },
  {
    n: '04', title: 'Launch & Support',
    desc: 'Smooth handoff, comprehensive training, and ongoing support baked into every engagement. We stay long after go-live — for good.',
    tags: ['Deploy', 'Training', 'Support'],
    icon: (
      <svg viewBox="0 0 72 72">
        <circle className="ic" cx="36" cy="36" r="32" />
        <path className="ip" strokeDasharray="300" strokeDashoffset="300" d="M36 52 L28 44 C28 44 26 34 30 26 C32 20 36 16 36 16 C36 16 40 20 42 26 C46 34 44 44 44 44 Z" />
        <path className="ip" strokeDasharray="80" strokeDashoffset="80" d="M28 44 L22 50 L26 50 L30 46" />
        <path className="ip" strokeDasharray="80" strokeDashoffset="80" d="M44 44 L50 50 L46 50 L42 46" />
        <circle className="ip" strokeDasharray="50" strokeDashoffset="50" cx="36" cy="30" r="4" />
        <path className="ip" strokeDasharray="60" strokeDashoffset="60" d="M31 50 Q29 56 32 60 Q36 54 40 60 Q43 56 41 50" />
      </svg>
    ),
    arc: 'M-50 60 Q 225 10 450 60 Q 675 110 950 60',
  },
];

type ProcessProps = {
  stepsData?: HomeProcessStep[];
};

export default function Process({ stepsData }: ProcessProps = {}) {
  const displaySteps = stepsData && stepsData.length > 0
    ? stepsData.map((step, idx) => ({
      ...steps[Math.min(idx, steps.length - 1)],
      n: step.n,
      title: step.title,
      desc: step.desc,
      tags: step.tags,
    }))
    : steps;

  useEffect(() => {
    const stepEls = Array.from(document.querySelectorAll('.step'));
    const wrap = document.getElementById('ps');
    const ph = document.getElementById('ph');
    const counter = document.getElementById('counter');
    const cnum = document.getElementById('cnum');
    const cin = document.getElementById('cin');
    const cinNum = document.getElementById('cin-num');
    let revealedCount = 0;

    const ioH = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ph?.classList.add('on');
          wrap?.classList.add('spine');
          counter?.classList.add('on');
          ioH.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (ph) ioH.observe(ph);

    function fireStep(st: Element, idx: number) {
      if (cinNum) cinNum.textContent = '0' + (idx + 1);
      if (cin) { cin.classList.remove('flash'); void (cin as HTMLElement).offsetWidth; cin.classList.add('flash'); }
      st.classList.add('glitch-in');
      setTimeout(() => st.classList.remove('glitch-in'), 400);
      setTimeout(() => {
        st.classList.add('on');
        st.querySelectorAll('.ip').forEach((p: any, i) => {
          const l = parseFloat(p.getAttribute('stroke-dasharray')) || 200;
          p.style.strokeDasharray = l;
          p.style.strokeDashoffset = l;
          p.style.transition = `stroke-dashoffset 0.75s cubic-bezier(0.16,1,0.3,1) ${0.45 + i * 0.12}s`;
          void p.offsetWidth;
          p.style.strokeDashoffset = '0';
        });
        revealedCount++;
        if (cnum) cnum.textContent = '0' + revealedCount;
        const dot = st.querySelector('.sdot');
        if (dot) {
          const dr = dot.getBoundingClientRect();
          (window as any).burst?.(dr.left + dr.width / 2, dr.top + dr.height / 2, 35, false);
        }
        setTimeout(() => {
          const ic = st.querySelector('.sicon');
          if (ic) {
            const ir = ic.getBoundingClientRect();
            (window as any).burst?.(ir.left + ir.width / 2, ir.top + ir.height / 2, 90, true);
            for (let a = 0; a < 360; a += 20) {
              const rad = a * Math.PI / 180;
              (window as any).burst?.(
                ir.left + ir.width / 2 + Math.cos(rad) * 38,
                ir.top + ir.height / 2 + Math.sin(rad) * 38,
                4, false
              );
            }
          }
        }, 1500);
        if (revealedCount >= stepEls.length) {
          setTimeout(() => { if (counter) counter.style.opacity = '0'; }, 1800);
        }
      }, 80);
    }

    stepEls.forEach((st, idx) => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !st.classList.contains('on')) {
            fireStep(st, idx);
            io.disconnect();
          }
        });
      }, { threshold: 0.35 });
      io.observe(st);
    });
  }, []);

  return (
    <div id="about-wrap">
      <section id="about">
        <div className="ph" id="ph">
          <div className="ph-eyebrow">Our Process</div>
          <h2>How we <em>work</em></h2>
        </div>
        <div className="ps" id="ps">
          {displaySteps.map((s, i) => (
            <div className="step" data-i={i} key={s.n}>
              <div className="sn">{s.n}</div>
              <div className="sdot" />
              <div className="sbg">{s.n}</div>
              <div className="sicon">{s.icon}</div>
              <div className="scontent">
                <h4>{s.title}</h4>
                <p className="sdesc">{s.desc}</p>
                <div className="stags">
                  {s.tags.map(t => <span className="stag" key={t}>{t}</span>)}
                </div>
              </div>
              <svg className="sarc" viewBox="0 0 900 120" preserveAspectRatio="none">
                <path d={s.arc} />
              </svg>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
