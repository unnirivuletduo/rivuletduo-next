'use client';
import { useEffect, useRef, useState } from 'react';

export default function Contact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !subject || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    
    const enquiryType = subject === 'Project inquiry' ? 'project' : 'general';
    const payload = enquiryType === 'project' 
      ? { enquiryType, firstName, lastName, email, projectDescription: message }
      : { enquiryType, name: `${firstName} ${lastName}`.trim(), email, message };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(typeof data?.message === 'string' ? data.message : 'Unable to submit right now.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let cleanupFn: (() => void) | null = null;

    async function init() {
      const THREE = await import('three');
      const canvas = canvasRef.current;
      const section = sectionRef.current;
      if (!canvas || !section) return;
      const sectionEl: HTMLElement = section;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
      camera.position.set(0, 0, 28);

      function resize() {
        const w = sectionEl.clientWidth;
        const h = sectionEl.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener('resize', resize);

      scene.add(new THREE.AmbientLight(0xffffff, 1));
      const dir = new THREE.DirectionalLight(0x22c55e, 1.6);
      dir.position.set(5, 10, 8);
      scene.add(dir);

      const GRID_W = 80, GRID_H = 50;
      const wGeo = new THREE.PlaneGeometry(55, 34, GRID_W, GRID_H);
      const wPos = wGeo.attributes.position;
      const origY = new Float32Array(wPos.count);
      for (let i = 0; i < wPos.count; i++) origY[i] = wPos.getY(i);

      const wMesh = new THREE.Mesh(wGeo, new THREE.MeshPhongMaterial({
        color: 0xbbf7d0, emissive: 0xd1fae5, wireframe: true, transparent: true, opacity: 0.35,
      }));
      wMesh.rotation.x = -Math.PI / 2.8;
      wMesh.position.y = -5;
      scene.add(wMesh);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(9, 0.04, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.25 })
      );
      ring.rotation.x = Math.PI / 2.5;
      ring.position.z = -6;
      scene.add(ring);

      let tM = { x: 0, y: 0 }, sM = { x: 0, y: 0 };
      const onMouseMove = (e: MouseEvent) => {
        tM.x = (e.clientX / window.innerWidth - 0.5) * 2;
        tM.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove);

      const clk = new THREE.Clock();
      let rafId: number;

      function animate() {
        rafId = requestAnimationFrame(animate);
        const t = clk.getElapsedTime();
        sM.x += (tM.x - sM.x) * 0.05;
        sM.y += (tM.y - sM.y) * 0.05;
        for (let i = 0; i < wPos.count; i++) {
          const x = wPos.getX(i), z = wPos.getZ(i);
          wPos.setY(i, origY[i] + Math.sin(x * 0.25 + t * 0.5) * 0.9 + Math.sin(z * 0.35 + t * 0.38) * 0.7);
        }
        wPos.needsUpdate = true;
        wGeo.computeVertexNormals();
        ring.rotation.z = t * 0.07;
        camera.position.x += sM.x * 2 - camera.position.x * 0.05;
        camera.position.y += sM.y * 1.5 - camera.position.y * 0.05;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
        renderer.dispose();
      };
    }

    init();
    return () => { cleanupFn?.(); };
  }, []);

  return (
    <section id="contact" ref={sectionRef}>
      <canvas id="contact-canvas" ref={canvasRef} />
      <div className="content-inner">
        <div className="contact-left">
          <p className="eyebrow">Let&apos;s Connect</p>
          <h2>Get in <em>touch</em><br />with us</h2>
          <p className="subtitle">We&apos;d love to hear from you. Tell us about your project and let&apos;s build something worth feeling.</p>
          <div className="contact-details">
            <div className="contact-detail">
              <div className="icon">
                <svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><polyline points="4,4 12,13 20,4" /></svg>
              </div>
              hello@rivuletduo.com
            </div>
            <div className="contact-detail">
              <div className="icon">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              </div>
              +1 (555) 000-0000
            </div>
            <div className="contact-detail">
              <div className="icon">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              San Francisco, CA
            </div>
          </div>
        </div>

        <div className="form-card">
          {success ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ background: '#dcfce7', color: '#16a34a', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Message sent!</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>We&apos;ve received your message and will get back to you shortly.</p>
            </div>
          ) : (
            <>
              <div className="form-row">
                <div className="field">
                  <label>First name</label>
                  <input type="text" placeholder="Alex" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="field">
                  <label>Last name</label>
                  <input type="text" placeholder="Morgan" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Email address</label>
                <input type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="" disabled>Choose a topic</option>
                  <option>Project inquiry</option>
                  <option>Partnership</option>
                  <option>General question</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea placeholder="Tell us about your project…" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              {error && <p style={{ color: '#b91c1c', fontSize: '.76rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>{error}</p>}
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
