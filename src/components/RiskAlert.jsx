import React from 'react';

const COLORS = { Nominal: '#10b981', Degraded: '#f59e0b', Critical: '#f43f5e' };
const TEXT = {
  Nominal: 'NOMINAL: link and power are healthy.',
  Degraded: 'DEGRADED: link or power is below the safe margin.',
  Critical: 'CRITICAL: switch SomaiyaSat to safe mode.',
};

// Conditional rendering: the colour, icon and message change with the risk prop.
export default function RiskAlert({ risk }) {
  return (
    <div style={{ padding: '1rem 1.2rem', borderRadius: 10, border: `1px solid ${COLORS[risk]}`, color: COLORS[risk], fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)' }}>
      {risk === 'Critical' && '🚨 '}{risk === 'Degraded' && '⚠️ '}{risk === 'Nominal' && '✅ '}{TEXT[risk]}
    </div>
  );
}
