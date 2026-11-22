import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Rocket, CheckCircle2 } from 'lucide-react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export default function KonamiLaunch() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'initiated', '3', '2', '1', 'liftoff'
  const [showToast, setShowToast] = useState(false);
  const keyIndexRef = useRef(0);
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing into input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const now = Date.now();
      if (now - lastKeyTimeRef.current > 2000) {
        keyIndexRef.current = 0;
      }
      lastKeyTimeRef.current = now;

      const targetKey = KONAMI_CODE[keyIndexRef.current].toLowerCase();
      const pressedKey = e.key.toLowerCase();

      if (pressedKey === targetKey) {
        keyIndexRef.current += 1;
        if (keyIndexRef.current === KONAMI_CODE.length) {
          keyIndexRef.current = 0;
          triggerLaunch();
        }
      } else {
        if (pressedKey === KONAMI_CODE[0].toLowerCase()) {
          keyIndexRef.current = 1;
        } else {
          keyIndexRef.current = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerLaunch = () => {
    if (sessionStorage.getItem('konami_launched') === 'true') {
      // Can still be triggered, but let's allow it for delight
    }
    setActive(true);
    setPhase('initiated');

    // 0.5s: "LAUNCH SEQUENCE INITIATED"
    // 1.5s: "3... 2... 1..."
    const t1 = setTimeout(() => setPhase('3'), 1500);
    const t2 = setTimeout(() => setPhase('2'), 1900);
    const t3 = setTimeout(() => setPhase('1'), 2300);

    // 2.5s: "LIFTOFF" + screen shake
    const t4 = setTimeout(() => {
      setPhase('liftoff');
    }, 2600);

    // 3.0s: Confetti burst
    const t5 = setTimeout(() => {
      try {
        confetti({
          particleCount: 160,
          spread: 180,
          origin: { y: 1 },
          colors: ['#00e5ff', '#f59e0b', '#ff6b6b', '#ffffff'],
        });
      } catch (err) {
        console.warn('Confetti launch error:', err);
      }
    }, 3000);

    // 4.2s: End sequence & show toast
    const t6 = setTimeout(() => {
      setActive(false);
      setPhase('idle');
      sessionStorage.setItem('konami_launched', 'true');
      setShowToast(true);
    }, 4200);

    // Hide toast after 4s
    const t7 = setTimeout(() => {
      setShowToast(false);
    }, 8500);

    return () => {
      [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
    };
  };

  return (
    <>
      {active && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#04060a',
            zIndex: 100000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: phase === 'liftoff' ? 'shakeScreen 0.5s ease-in-out infinite' : 'none',
            overflow: 'hidden',
          }}
        >
          {/* Scanline backdrop */}
          <div className="scanline-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

          {/* Radar circle animation */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              border: '1px dashed rgba(0, 229, 255, 0.25)',
              pointerEvents: 'none',
            }}
          />

          {phase === 'initiated' && (
            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
                  color: '#00e5ff',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  textShadow: '0 0 20px rgba(0, 229, 255, 0.8)',
                  marginBottom: '1rem',
                }}
              >
                LAUNCH SEQUENCE INITIATED
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#64748b' }}>
                ARMING SOLID ROCKET BOOSTERS &bull; CALIBRATING ATTITUDE CONTROL
              </div>
            </div>
          )}

          {(phase === '3' || phase === '2' || phase === '1') && (
            <div
              key={phase}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(5rem, 15vw, 12rem)',
                fontWeight: 900,
                color: phase === '1' ? '#f59e0b' : '#00e5ff',
                textShadow: '0 0 40px rgba(0, 229, 255, 0.9)',
                zIndex: 10,
                animation: 'pulseCyan 0.35s ease-out',
              }}
            >
              T-{phase}
            </div>
          )}

          {phase === 'liftoff' && (
            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <Rocket size={72} color="#00e5ff" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 20px #00e5ff)' }} />
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 10vw, 8rem)',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: '#f0f2f5',
                  textShadow: '0 0 40px rgba(0, 229, 255, 0.8), 0 0 80px rgba(245, 158, 11, 0.6)',
                }}
              >
                LIFTOFF!
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.85rem, 1.8vw, 1.2rem)',
                  color: '#00e5ff',
                  letterSpacing: '0.15em',
                  marginTop: '1rem',
                }}
              >
                SOMAIYASAT 1PQ REACHING ORBITAL INSERTION VELOCITY
              </div>
            </div>
          )}
        </div>
      )}

      {/* Achievement Unlocked Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100001,
            backgroundColor: '#0a0e18',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            borderRadius: '10px',
            padding: '0.85rem 1.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 229, 255, 0.25)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            color: '#f0f2f5',
          }}
        >
          <CheckCircle2 size={18} color="#00e5ff" />
          <span>
            🚀 <strong>Achievement Unlocked:</strong> Ground Control
          </span>
        </div>
      )}
    </>
  );
}
