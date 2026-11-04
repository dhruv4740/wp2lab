import React from 'react';

// Error boundary: if any child component crashes while rendering, show this fallback instead of a blank page.
// React only supports error boundaries as class components, so this is the one class in the project.
export default class ErrorBoundary extends React.Component {
  state = { error: null }; // null while everything is fine

  // React calls this when a child throws; the returned object becomes the new state.
  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children; // normal case: render the app

    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#050505', color: '#f8fafc', padding: '2rem' }}>
        <div style={{ maxWidth: 520, textAlign: 'center', padding: '2rem', background: '#0b101d', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 16 }}>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p style={{ color: '#f87171', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{String(this.state.error)}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.6rem 1.2rem', borderRadius: 8, border: '1px solid #38bdf8', background: 'transparent', color: '#38bdf8', cursor: 'pointer' }}>
            Reload
          </button>
        </div>
      </div>
    );
  }
}
