import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: '#030406',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '80px 48px 40px',
      position: 'relative'
    }}>
      <div className="blueprint-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
          marginBottom: '60px'
        }}>
          {/* Column 1: Mission Title */}
          <div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#4a7c9b', letterSpacing: '0.2em', marginBottom: '12px' }}>
              SOMAIYASAT // KJS-SRS-01
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#f3f4f6', fontWeight: 700, marginBottom: '16px' }}>
              SOMAIYASAT & SOMAIYAPOD
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#8b9daf', lineHeight: 1.7, maxWidth: '360px' }}>
              Autonomous AI mission management and multi-mode amateur radio payloads running onboard a 2P PocketQube nanosatellite in Low Earth Orbit.
            </p>
          </div>

          {/* Column 2: Stakeholders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#8b9daf', letterSpacing: '0.15em' }}>
              INSTITUTIONAL STAKEHOLDERS
            </div>

            <div>
              <div style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '0.95rem' }}>
                K. J. Somaiya Institute of Technology (KJSIT)
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                Dr. Umesh Shinde — Dept. of Basic Science & Humanities
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '0.95rem' }}>
                K. J. Somaiya School of Engineering (KJSSE)
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                Dr. Shailesh Nikam — Dept. of Mechanical Engineering
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: '#4a7c9b', fontSize: '0.95rem' }}>
                ReOrbit, Finland
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                Industry Space Technology Collaborator
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#8b9daf', letterSpacing: '0.15em', marginBottom: '16px' }}>
              MISSION LABS & CHAPTERS
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>📡 GROUND STATION REGISTRATION</Link></li>
              <li><Link to="/telemetry" style={{ color: '#34d399', textDecoration: 'none', fontWeight: '600' }}>⚡ TELEMETRY CONTROL CENTER</Link></li>
              <li><Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>01 — MISSION ARCHITECTURE</Link></li>
              <li><a href="#deployment" style={{ color: '#9ca3af', textDecoration: 'none' }}>02 — DEPLOYMENT SEQUENCE</a></li>
              <li><a href="#autonomy" style={{ color: '#9ca3af', textDecoration: 'none' }}>03 — AUTONOMOUS DECISION MAKING</a></li>
              <li><a href="#comms" style={{ color: '#9ca3af', textDecoration: 'none' }}>04 — COMMUNICATION ARCHITECTURE</a></li>
              <li><a href="#architecture" style={{ color: '#9ca3af', textDecoration: 'none' }}>05 — SYSTEM SCHEMATIC</a></li>
              <li><a href="#orbit" style={{ color: '#9ca3af', textDecoration: 'none' }}>06 — ORBIT VISUALIZATION</a></li>
              <li><a href="#timeline" style={{ color: '#9ca3af', textDecoration: 'none' }}>07 — MISSION TIMELINE</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(0, 240, 255, 0.18)',
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="beacon-pulse" />
            <span className="font-mono" style={{ fontSize: '0.75rem', color: '#00ff88', fontWeight: 600 }}>
              SOMAIYASAT-1 // ORBITAL BUS ACTIVE [350 KM LEO]
            </span>
          </div>

          <div className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b' }}>
            © 2026 SOMAIYASAT MISSION / KJSIT &amp; REORBIT. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="hud-btn"
          >
            TOP OF DECK ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
