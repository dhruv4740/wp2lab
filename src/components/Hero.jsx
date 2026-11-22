import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StarfieldCanvas from './StarfieldCanvas';
import WireframeCube from './WireframeCube';
import { ArrowDown, Radio } from 'lucide-react';

export default function Hero() {
  const [stage, setStage] = useState(0);
  const designationText = 'SomaiyaSat • Autonomous AI Router • PocketQube 1PQ';
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    // 0-0.6s: Pure black
    // 0.6s: Cyan line draws
    const t1 = setTimeout(() => setStage(1), 600);
    // 1.2s: Designation types out
    const t2 = setTimeout(() => setStage(2), 1200);
    // 2.0s: Headline fades in word-by-word
    const t3 = setTimeout(() => setStage(3), 2000);
    // 3.2s: Paragraph + CTA fade in
    const t4 = setTimeout(() => setStage(4), 3200);
    // 3.5s: Starfield and wireframe emerge
    const t5 = setTimeout(() => setStage(5), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  useEffect(() => {
    if (stage < 2) return;
    if (typedChars >= designationText.length) return;

    const interval = setInterval(() => {
      setTypedChars((prev) => {
        if (prev >= designationText.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 28);

    return () => clearInterval(interval);
  }, [stage, typedChars, designationText.length]);

  const scrollToBrief = () => {
    const brief = document.getElementById('mission-brief') || document.getElementById('mission');
    if (brief) {
      if (window.lenis) {
        window.lenis.scrollTo(brief);
      } else {
        brief.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const words = ['REWRITING', 'THE', 'RULES', 'OF', 'ORBITAL', 'COMMUNICATION'];
  const showHeadline = stage >= 3;
  const isRevealed = stage >= 4;
  const showWireframe = stage >= 5;

  return (
    <section
      id="mission"
      style={{
        position: 'relative',
        minHeight: '94vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#04060a',
        padding: '5rem 1.5rem 3rem',
      }}
    >
      {/* Starfield with interactive constellation builder enabled */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: showWireframe ? 1 : 0,
          transition: 'opacity 1.4s ease',
          pointerEvents: showWireframe ? 'auto' : 'none',
        }}
      >
        <StarfieldCanvas count={240} speed={0.25} interactive={true} />
      </div>

      {/* Central Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(4, 6, 10, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          opacity: stage >= 1 ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      />

      {/* Subtle PocketQube 1PQ Isometric Wireframe Background */}
      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '420px',
          opacity: showWireframe ? 0.16 : 0,
          transition: 'opacity 1.6s ease',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <WireframeCube />
      </div>

      {/* Engineering Scanlines Overlay (calibrated opacity <= 0.4 per spec) */}
      <div
        className="scanline-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.2,
        }}
      />

      {/* Foreground Content Container (zIndex: 10, maxWidth: 1400px per test requirements) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Mission Designation typing sequence */}
        <div
          style={{
            minHeight: '1.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.72rem, 1.2vw, 0.85rem)',
              color: '#00e5ff',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            {designationText.slice(0, typedChars)}
            {stage >= 2 && typedChars < designationText.length && (
              <span style={{ animation: 'cursorBlink 0.8s infinite', marginLeft: '2px', color: '#00e5ff' }}>
                _
              </span>
            )}
          </span>
        </div>

        {/* 0.6s Drawing Cyan Line */}
        <div
          style={{
            height: '2px',
            width: stage >= 1 ? '280px' : '0px',
            backgroundColor: '#00e5ff',
            boxShadow: '0 0 14px rgba(0, 229, 255, 0.8)',
            marginBottom: '2rem',
            transition: 'width 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '9999px',
          }}
        />

        {/* 2.0s Headline Word-by-Word Reveal */}
        <h1
          style={{
            fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#f0f2f5',
            maxWidth: '1150px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 0.3em',
          }}
        >
          {words.map((word, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                opacity: showHeadline ? 1 : 0,
                transform: showHeadline ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.08}s`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* 3.2s Lead Narrative Paragraph (1 concise sentence per requirement R2.2.2) */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
            color: '#94a3b8',
            maxWidth: '820px',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            fontWeight: 400,
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          SomaiyaSat is an ultra-compact PocketQube demonstrating autonomous AI orbital routing and real-time amateur radio telemetry from Low Earth Orbit.
        </p>

        {/* 3.2s Single High-Contrast Call to Action (links to /telemetry with text Telemetry Hub) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}
        >
          <Link
            to="/telemetry"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.1rem 2.75rem',
              backgroundColor: '#00e5ff',
              color: '#04060a',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '8px',
              boxShadow: '0 0 25px rgba(0, 229, 255, 0.45)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 229, 255, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.45)';
            }}
          >
            <Radio size={20} color="#04060a" />
            <span>Telemetry Hub</span>
          </Link>
        </div>

        {/* 3.5s Animated Scroll Indicator Cue */}
        <button
          type="button"
          onClick={scrollToBrief}
          style={{
            marginTop: '3.5rem',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#64748b',
            cursor: 'pointer',
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 0.8s ease 0.2s',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            SCROLL TO EXPLORE MISSION
          </span>
          <ArrowDown size={16} style={{ animation: 'floatDown 2s infinite ease-in-out' }} />
        </button>
      </div>
    </section>
  );
}
