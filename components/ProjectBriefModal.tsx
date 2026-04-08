'use client';

import { useState, useEffect } from 'react';
import './ProjectBriefModal.css';

export default function ProjectBriefModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [desc, setDesc] = useState('');
  const [projectFirstName, setProjectFirstName] = useState('');
  const [projectLastName, setProjectLastName] = useState('');
  const [projectEmail, setProjectEmail] = useState('');
  const [projectPhone, setProjectPhone] = useState('');
  const [projectDone, setProjectDone] = useState(false);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectError, setProjectError] = useState('');

  useEffect(() => {
    const handleOpen = () => { setIsOpen(true); document.body.style.overflow = 'hidden'; };
    const handleClose = () => { setIsOpen(false); document.body.style.overflow = ''; };
    
    window.addEventListener('open-project-modal', handleOpen);
    window.addEventListener('close-project-modal', handleClose);
    
    return () => {
      window.removeEventListener('open-project-modal', handleOpen);
      window.removeEventListener('close-project-modal', handleClose);
    };
  }, []);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validateStepOne = () => {
    return !!projectFirstName.trim() && !!projectLastName.trim() && validateEmail(projectEmail);
  };

  const submitProjectBrief = async () => {
    if (!validateStepOne() || !desc.trim()) {
      setProjectError('Please complete all required fields before submitting.');
      return;
    }

    setProjectError('');
    setProjectSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: 'project',
          firstName: projectFirstName.trim(),
          lastName: projectLastName.trim(),
          email: projectEmail.trim(),
          phone: projectPhone.trim(),
          services: selectedServices,
          budget,
          projectDescription: desc.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setProjectError(typeof data?.message === 'string' ? data.message : 'Unable to submit right now.');
        return;
      }

      setProjectDone(true);
    } catch {
      setProjectError('Network error. Please try again in a moment.');
    } finally {
      setProjectSubmitting(false);
    }
  };

  const toggleService = (s: string) => {
    setSelectedServices((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));
  };

  if (!isOpen) return null;

  return (
    <div className="pj-modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget) {
        setIsOpen(false);
        document.body.style.overflow = '';
      }
    }}>
      <div className="pj-modal-container">
        <button className="pj-modal-close" onClick={() => { setIsOpen(false); document.body.style.overflow = ''; }}>✕</button>
        <div className="pj-modal-head">
          <h2>Start a Project</h2>
          <p>Tell us about what you&apos;re building.</p>
        </div>

        <div className="pj-form-card">
          {!projectDone && (
            <div className="pj-form-body">
              <div className="pj-step-indicator">
                <div className={`pj-si-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}><div className="pj-si-num">{step > 1 ? '✓' : '1'}</div>You</div>
                <div className="pj-si-line" />
                <div className={`pj-si-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}><div className="pj-si-num">{step > 2 ? '✓' : '2'}</div>Project</div>
                <div className="pj-si-line" />
                <div className={`pj-si-step ${step === 3 ? 'active' : ''}`}><div className="pj-si-num">3</div>Details</div>
              </div>

              {step === 1 && (
                <>
                  <div className="pj-form-row">
                    <div className="pj-field"><label>First name <span className="req">*</span></label><input type="text" placeholder="Alex" value={projectFirstName} onChange={(e) => setProjectFirstName(e.target.value)} /></div>
                    <div className="pj-field"><label>Last name <span className="req">*</span></label><input type="text" placeholder="Morgan" value={projectLastName} onChange={(e) => setProjectLastName(e.target.value)} /></div>
                  </div>
                  <div className="pj-field"><label>Email address <span className="req">*</span></label><input type="email" placeholder="alex@example.com" value={projectEmail} onChange={(e) => setProjectEmail(e.target.value)} /></div>
                  <div className="pj-field"><label>Phone</label><input type="tel" placeholder="+1 (555) 000-0000" value={projectPhone} onChange={(e) => setProjectPhone(e.target.value)} /></div>
                  {projectError && <p className="pj-error">{projectError}</p>}
                  <div className="pj-form-nav"><span className="pj-step-count"><b>01</b> / 03</span><button className="pj-btn-next" onClick={() => validateStepOne() ? setStep(2) : setProjectError('Please add first name, last name, and a valid email.')}>Next — Project Info →</button></div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="pj-field"><label>Services you&apos;re interested in <span className="req">*</span></label></div>
                  <div className="pj-svc-checks">
                    {['Web Design', 'UI/UX Design', 'Web Development', 'Mobile App', 'E-Commerce', 'Branding', 'SEO', 'Animation / 3D'].map((s) => (
                      <div key={s} className={`pj-svc-check ${selectedServices.includes(s) ? 'checked' : ''}`} onClick={() => toggleService(s)}><div className="pj-svc-check-box" />{s}</div>
                    ))}
                  </div>
                  <div className="pj-field"><label>Estimated budget</label></div>
                  <div className="pj-budget-grid">
                    {['< $2k', '$2k–$5k', '$5k–$10k', '$10k–$20k', '$20k+', "Let's discuss"].map((b) => (
                      <div key={b} className={`pj-budget-opt ${budget === b ? 'sel' : ''}`} onClick={() => setBudget(b)}>{b}</div>
                    ))}
                  </div>
                  <div className="pj-form-nav"><button className="pj-btn-prev" onClick={() => setStep(1)}>← Back</button><span className="pj-step-count"><b>02</b> / 03</span><button className="pj-btn-next" onClick={() => setStep(3)}>Next — Tell us more →</button></div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="pj-field"><label>Project description <span className="req">*</span></label><textarea value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 600))} placeholder="Tell us about your project — what you're building, who it's for, and what success looks like for you…" /><div className="pj-char-counter">{desc.length} / 600</div></div>
                  {projectError && <p className="pj-error">{projectError}</p>}
                  <button className="pj-btn-submit-main" onClick={submitProjectBrief} disabled={projectSubmitting}>{projectSubmitting ? 'Sending...' : 'Send Project Brief ↗'}</button>
                  <div className="pj-form-nav" style={{ borderTop: 'none', marginTop: '.8rem', paddingTop: 0, justifyContent: 'flex-start' }}><button className="pj-btn-prev" onClick={() => setStep(2)}>← Back</button><span className="pj-step-count" style={{ marginLeft: 'auto' }}><b>03</b> / 03</span></div>
                </>
              )}
            </div>
          )}

          {projectDone && (
            <div className="pj-form-success show">
              <div className="pj-success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div>
              <h3>Brief received!</h3>
              <p>Thank you. We&apos;ll review your project details and get back to you within 24 hours.</p>
              <button className="pj-btn-submit-main" onClick={() => { setIsOpen(false); document.body.style.overflow = ''; }} style={{ marginTop: '2rem' }}>Close Window</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
