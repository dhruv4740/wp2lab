import React from 'react';

// Shows the recommended downlink plan for the current risk level.
export default function AdvisoryPanel({ advisory }) {
  return (
    <div style={{ padding: '1rem 1.2rem', borderRadius: 10, background: 'var(--bg-surface)', border: 'var(--border-default)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 4 }}>Advisory</div>
      <div>{advisory}</div>
    </div>
  );
}
