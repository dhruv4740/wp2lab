import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function SatellitePing() {
  const [satellite, setSatellite] = useState(null); // { id, startX, startY, endX, endY, angle, duration }
  const [pos, setPos] = useState({ x: -100, y: -100, angle: 0 });
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [toast, setToast] = useState(null); // { type: 'success' | 'miss', text: string }
  const [clicked, setClicked] = useState(false);

  const clickedRef = useRef(false);
  const animFrameRef = useRef(null);
  const spawnTimerRef = useRef(null);

  useEffect(() => {
    // Initial spawn quickly after load (3s) so user doesn't wait indefinitely
    spawnTimerRef.current = setTimeout(() => {
      spawnSatellite();
    }, 3000);

    return () => {
      clearTimeout(spawnTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const spawnSatellite = () => {
    if (satellite) return; // already active

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Pick entry edge: 0=top, 1=right, 2=bottom, 3=left
    const edge = Math.floor(Math.random() * 4);
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const padding = 50;

    if (edge === 0) {
      startX = Math.random() * (width - 150) + 75;
      startY = -padding;
      endX = Math.random() * (width - 150) + 75;
      endY = height + padding;
    } else if (edge === 1) {
      startX = width + padding;
      startY = Math.random() * (height - 150) + 75;
      endX = -padding;
      endY = Math.random() * (height - 150) + 75;
    } else if (edge === 2) {
      startX = Math.random() * (width - 150) + 75;
      startY = height + padding;
      endX = Math.random() * (width - 150) + 75;
      endY = -padding;
    } else {
      startX = -padding;
      startY = Math.random() * (height - 150) + 75;
      endX = width + padding;
      endY = Math.random() * (height - 150) + 75;
    }

    const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;
    const duration = 5000; // 5 seconds transit

    const satData = {
      id: Date.now(),
      startX,
      startY,
      endX,
      endY,
      angle,
      duration,
    };

    clickedRef.current = false;
    setClicked(false);
    setPos({ x: startX, y: startY, angle });
    setSatellite(satData);
    setAttempts((prev) => prev + 1);

    const startTime = performance.now();

    const loop = (now) => {
      if (clickedRef.current) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const curX = startX + (endX - startX) * progress;
      const curY = startY + (endY - startY) * progress;
      setPos({ x: curX, y: curY, angle });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        // Exited screen without click
        if (!clickedRef.current) {
          setToast({ type: 'miss', text: 'SIGNAL LOST' });
          setTimeout(() => setToast(null), 2000);
        }
        setSatellite(null);
        spawnTimerRef.current = setTimeout(() => {
          spawnSatellite();
        }, 18000 + Math.random() * 12000);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  };

  const handleSatelliteClick = (e) => {
    e.stopPropagation();
    if (clicked || !satellite) return;

    clickedRef.current = true;
    setClicked(true);
    setHits((prev) => prev + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (rect.left + rect.width / 2) / window.innerWidth;
    const clickY = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { x: clickX, y: clickY },
        colors: ['#00e5ff', '#ffffff', '#f59e0b'],
      });
    } catch (err) {
      console.warn('Confetti error:', err);
    }

    setToast({ type: 'success', text: 'SIGNAL ACQUIRED' });
    setTimeout(() => setToast(null), 2000);

    setTimeout(() => {
      setSatellite(null);
      spawnTimerRef.current = setTimeout(() => {
        spawnSatellite();
      }, 15000 + Math.random() * 10000);
    }, 400);
  };

  return (
    <>
      {/* Flying Satellite Target */}
      {satellite && (
        <div
          onClick={handleSatelliteClick}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.angle}deg) scale(${clicked ? 1.8 : 1})`,
            width: '50px',
            height: '50px',
            zIndex: 9998,
            cursor: 'crosshair',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: clicked
              ? 'drop-shadow(0 0 16px #00e5ff) brightness(2)'
              : 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.7))',
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
          title="🛰️ Incoming satellite! Click to establish downlink."
        >
          {/* 32x32 Geometric Satellite SVG with glowing beacon */}
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style={{ overflow: 'visible' }}>
            <rect x="1" y="11" width="8" height="10" rx="1" stroke={clicked ? '#00e5ff' : '#00e5ff'} strokeWidth="1.2" fill="rgba(10, 14, 24, 0.9)" />
            <line x1="5" y1="11" x2="5" y2="21" stroke={clicked ? '#00e5ff' : '#0891b2'} strokeWidth="1" />
            <line x1="1" y1="16" x2="9" y2="16" stroke={clicked ? '#00e5ff' : '#0891b2'} strokeWidth="1" />
            <line x1="9" y1="16" x2="12" y2="16" stroke="#00e5ff" strokeWidth="1.5" />

            <rect x="12" y="10" width="8" height="12" rx="1.5" stroke={clicked ? '#00e5ff' : '#f0f2f5'} strokeWidth="1.5" fill="#080b12" />
            <circle cx="16" cy="16" r="2.5" fill={clicked ? '#00e5ff' : '#f59e0b'} style={{ animation: 'pulseCyan 0.8s infinite' }} />

            <line x1="20" y1="16" x2="23" y2="16" stroke="#00e5ff" strokeWidth="1.5" />
            <rect x="23" y="11" width="8" height="10" rx="1" stroke={clicked ? '#00e5ff' : '#00e5ff'} strokeWidth="1.2" fill="rgba(10, 14, 24, 0.9)" />
            <line x1="27" y1="11" x2="27" y2="21" stroke={clicked ? '#00e5ff' : '#0891b2'} strokeWidth="1" />
            <line x1="23" y1="16" x2="31" y2="16" stroke={clicked ? '#00e5ff' : '#0891b2'} strokeWidth="1" />

            <line x1="16" y1="10" x2="16" y2="3" stroke="#00e5ff" strokeWidth="1.5" />
            <circle cx="16" cy="2" r="1.5" fill="#00e5ff" />
          </svg>
        </div>
      )}

      {/* Ping Toast Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 100002,
            backgroundColor: '#0a0e18',
            border: `1px solid ${toast.type === 'success' ? '#00e5ff' : '#f59e0b'}`,
            borderRadius: '6px',
            padding: '0.65rem 1.2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: toast.type === 'success' ? '#00e5ff' : '#f59e0b',
            boxShadow: `0 8px 24px rgba(0, 0, 0, 0.8), 0 0 16px ${toast.type === 'success' ? 'rgba(0, 229, 255, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            animation: 'pulseCyan 0.4s ease-out',
          }}
        >
          {toast.type === 'success' ? '✓ ' : '✕ '} {toast.text}
        </div>
      )}

      {/* Persistent Stats & Instant Spawn Trigger in Bottom Left */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 50,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: '#94a3b8',
          letterSpacing: '0.06em',
          backgroundColor: 'rgba(10, 14, 24, 0.85)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          padding: '0.4rem 0.75rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
        }}
      >
        <span>🛰️ <strong>PINGS:</strong> {hits}/{attempts}</span>
        <button
          type="button"
          onClick={() => spawnSatellite()}
          disabled={!!satellite}
          style={{
            background: satellite ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 229, 255, 0.15)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            color: satellite ? '#64748b' : '#00e5ff',
            borderRadius: '4px',
            fontSize: '0.68rem',
            padding: '2px 8px',
            cursor: satellite ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          title="Manually trigger a satellite flyby"
        >
          {satellite ? 'IN TRANSIT...' : 'INTERCEPT NOW 🚀'}
        </button>
      </div>
    </>
  );
}
