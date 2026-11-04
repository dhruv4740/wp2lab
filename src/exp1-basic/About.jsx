import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, Rocket } from 'lucide-react';

const card = { backgroundColor: '#080b12', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' };
const mono = { fontFamily: 'JetBrains Mono, monospace' };

// NavLink passes { isActive } to this function so the open tab can be highlighted.
const linkStyle = ({ isActive }) => ({
  textDecoration: 'none',
  fontSize: '0.86rem',
  fontWeight: '600',
  padding: '0.5rem 1.1rem',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: isActive ? '#00f0ff' : '#94a3b8',
  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
  border: isActive ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.08)',
});

export default function About() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ ...card, padding: '2rem 2.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <span style={{ ...mono, backgroundColor: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#00f0ff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
            MISSION ARCHITECTURE &bull; KJS-SRS-01
          </span>
          <span style={{ ...mono, color: '#64748b', fontSize: '0.72rem' }}>REORBIT FINLAND PARTNERSHIP</span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#f8fafc', margin: '0 0 0.75rem 0', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
          SomaiyaSat Spacecraft &amp; SomaiyaPod Deployer
        </h1>

        <p style={{ color: '#94a3b8', lineHeight: '1.65', fontSize: '0.96rem', margin: 0, maxWidth: '820px' }}>
          SomaiyaSat is a 1PQ/2P PocketQube ultra-small satellite platform developed by KJSIT &amp; KJSSE in collaboration with ReOrbit (Finland). It validates autonomous edge AI inter-satellite routing and multi-mode amateur radio communication (M17, Codec2, SSTV, TT&amp;C) deployed via the SomaiyaPod mechanism.
        </p>

        {/* Nested routes: each NavLink switches the child page shown in the Outlet below */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
          <NavLink to="team" style={linkStyle}>
            <Users size={16} /> Engineering Leadership &amp; Teams
          </NavLink>
          <NavLink to="company" style={linkStyle}>
            <Rocket size={16} /> Spacecraft &amp; Deployer Specifications
          </NavLink>
        </div>
      </div>

      {/* Outlet renders the nested child route (Team or Company) */}
      <div style={{ ...card, padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
