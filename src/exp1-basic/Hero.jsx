// Landing banner for the home page: title, short description and two links (route link and in-page anchor).
import React from 'react';
import { Link } from 'react-router-dom';

// A function component: it returns JSX, which React turns into the page. It takes no props.
// style={{ ... }}: the outer braces mean "JavaScript here", the inner braces are the style object (camelCase names).
export default function Hero() {
  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 1.5rem 3rem', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.12), transparent 60%)' }}>
      <div style={{ maxWidth: 760 }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.85rem', letterSpacing: 2, marginBottom: '1rem' }}>
          POCKETQUBE MISSION · KJSIT / KJSSE
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '1.2rem' }}>
          SomaiyaSat: a satellite that decides what to send down
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          A 5 cm amateur-radio satellite with an onboard AI router. It ranks telemetry, images and voice, then sends the most important data in each short ground pass.
        </p>
        {/* Two buttons: <Link> opens another page without reloading; <a href="#..."> only scrolls down this page */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/telemetry" className="btn-primary" style={{ padding: '0.8rem 1.6rem', borderRadius: 8, background: 'var(--accent-cyan)', color: '#04060a', fontWeight: 600, textDecoration: 'none' }}>
            View telemetry
          </Link>
          <a href="#about-project" style={{ padding: '0.8rem 1.6rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', color: 'var(--text-primary)', textDecoration: 'none' }}>
            What is this?
          </a>
        </div>
      </div>
    </section>
  );
}
