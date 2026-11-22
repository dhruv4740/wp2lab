import React from 'react';
import { AlertCircle, RefreshCw, Radio, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SomaiyaSat Telemetry Crash Caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#050505',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '580px',
            width: '100%',
            backgroundColor: '#0b101d',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={28} />
            </div>

            <h1 style={{ fontSize: '1.45rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Mission Telemetry Interrupt
            </h1>

            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              The ground command interface encountered a runtime state anomaly. Telemetry watchdog has safely captured the event.
            </p>

            {this.state.error && (
              <div style={{
                backgroundColor: '#05070f',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '0.78rem',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#f87171',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.75rem'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={15} /> Reconnect Command Link
              </button>

              <button
                onClick={this.handleHome}
                style={{
                  padding: '0.7rem 1.2rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'transparent',
                  color: '#cbd5e1',
                  fontWeight: '500',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Home size={15} /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
