import React, { useEffect, useState } from 'react';

// Simple launch sequence: countdown, liftoff, orbit message.
// Opened by the "PSLV Launch" button via the 'trigger-pslv-launch' event.
const STEPS = ['T-3', 'T-2', 'T-1', 'LIFTOFF', 'ORBIT'];

const css = `
@keyframes rise { from { transform: translateY(0); } to { transform: translateY(-120vh); } }
@keyframes flame { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.5); } }
`;

export default function LaunchOverlay() {
  const [step, setStep] = useState(-1); // -1 = closed

  useEffect(() => {
    const open = () => setStep(0);
    window.addEventListener('trigger-pslv-launch', open);
    return () => window.removeEventListener('trigger-pslv-launch', open);
  }, []);

  useEffect(() => {
    if (step < 0 || step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep(step + 1), step < 3 ? 1000 : 4500);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step < 0) return;
    const onKey = (e) => e.key === 'Escape' && setStep(-1);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  if (step < 0) return null;
  const flying = step >= 3 && step < 4;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'linear-gradient(#02040a, #0b1220)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>
      <style>{css}</style>
      <button onClick={() => setStep(-1)} style={{ position: 'absolute', top: 20, right: 24, background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Close (Esc)</button>

      <div style={{ position: 'absolute', top: 24, left: 28, fontSize: '0.8rem', color: '#94a3b8' }}>PSLV-C58 / SOMAIYASAT-1</div>

      {step < 4 && (
        <svg width="60" height="150" viewBox="0 0 60 150" style={{ position: 'absolute', bottom: '14%', animation: flying ? 'rise 4.5s ease-in forwards' : 'none' }}>
          <rect x="22" y="20" width="16" height="90" rx="4" fill="#e2e8f0" />
          <path d="M22 20 L30 0 L38 20 Z" fill="#38bdf8" />
          <rect x="14" y="70" width="8" height="40" fill="#94a3b8" />
          <rect x="38" y="70" width="8" height="40" fill="#94a3b8" />
          {flying && <path d="M24 110 L30 150 L36 110 Z" fill="#f59e0b" style={{ transformOrigin: '30px 110px', animation: 'flame 0.2s infinite' }} />}
        </svg>
      )}

      <div style={{ fontSize: step === 3 ? '2.4rem' : '4rem', fontWeight: 700, color: step === 4 ? '#34d399' : '#38bdf8', letterSpacing: 2, textAlign: 'center', zIndex: 1 }}>
        {step === 4 ? 'ORBIT REACHED' : STEPS[step]}
      </div>
      {step === 4 && <div style={{ marginTop: 12, color: '#94a3b8', fontSize: '0.9rem' }}>SomaiyaSat-1 deployed at 500 km, sun-synchronous orbit</div>}
    </div>
  );
}
