// Exp 1: second child page under /about (route /about/company). Same idea as Team.jsx:
// keep the text in arrays, then draw one list item per entry with .map().
import React from 'react';

const SATELLITE_SPECS = [
  'Form Factor: 1PQ PocketQube (5 cm × 5 cm × 5 cm)',
  'Power Budget: < 1W sub-watt average orbital power',
  'Multi-Mode Payloads: M17, Codec2, SSTV, TT&C / Housekeeping',
  'Microcontroller: Low-Power SoC with Onboard AI Inference',
];

const DEPLOYER_SPECS = [
  'Controlled orbital insertion & spring-loaded release',
  'Redundant separation switches & deployment telemetry beacon',
  'RF deployment verification handshake protocol',
  'Compatible with ISRO PSLV / SSLV deployer racks',
];

// Reusable block: a title and a bulleted list. `title` and `items` are props.
function SpecCard({ title, items }) {
  return (
    <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '1.25rem' }}>
      <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '0.75rem' }}>{title}</h3>
      <ul style={{ paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((text) => <li key={text}>{text}</li>)}
      </ul>
    </div>
  );
}

export default function Company() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
      <SpecCard title="SomaiyaSat spacecraft" items={SATELLITE_SPECS} />
      <SpecCard title="SomaiyaPod deployer" items={DEPLOYER_SPECS} />
    </div>
  );
}
