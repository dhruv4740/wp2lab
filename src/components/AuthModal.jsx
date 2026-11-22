import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, UserCheck, X, ShieldAlert, Radio } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [station, setStation] = useState('Primary Ground Station');
  const [role, setRole] = useState('Telemetry Operator');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username.trim() || !password.trim()) {
      setError('Please provide operator callsign/handle and passkey.');
      return;
    }
    const ok = login(username.trim(), password.trim());
    if (ok) {
      setSuccess('Operator authenticated. Terminal session established.');
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setError('Authentication failed. Check credentials.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    const finalCallsign = callsign.trim() || username.trim().toUpperCase();
    const ok = register({
      username: username.trim(),
      password: password.trim(),
      callsign: finalCallsign,
      station: station.trim() || 'Mobile Ground Terminal',
      role,
    });
    if (ok) {
      setSuccess('Operator ' + finalCallsign + ' commissioned successfully.');
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setError('Registration rejected. Callsign or handle already registered.');
    }
  };

  const fillDemo = () => {
    setUsername('W3XYZ');
    setPassword('orbital-auth-2026');
    setCallsign('W3XYZ');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(4, 6, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#0a0e18',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(14, 18, 32, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Radio size={18} color="#00e5ff" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#f0f2f5',
                textTransform: 'uppercase',
              }}
            >
              Ground Terminal Access
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.25rem',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(6, 8, 16, 0.6)',
          }}
        >
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: tab === 'login' ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid #00e5ff' : '2px solid transparent',
              color: tab === 'login' ? '#00e5ff' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: tab === 'register' ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid #00e5ff' : '2px solid transparent',
              color: tab === 'register' ? '#00e5ff' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            REGISTER OPERATOR
          </button>
        </div>

        <div style={{ padding: '1.75rem 1.5rem' }}>
          {error && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: '6px',
                color: '#fb7185',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '6px',
                color: '#34d399',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <UserCheck size={16} />
              <span>{success}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Operator Callsign / Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. VU2SOM or W3XYZ"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Passkey
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '0.85rem',
                    backgroundColor: '#00e5ff',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#04060a',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 229, 255, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <KeyRound size={16} />
                  AUTHENTICATE
                </button>
                <button
                  type="button"
                  onClick={fillDemo}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#94a3b8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  DEMO PASS
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Operator Handle
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AstroDhruv"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Amateur Radio Callsign
                </label>
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="e.g. VU2SOM"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Security Passkey
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Station
                  </label>
                  <input
                    type="text"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      backgroundColor: 'rgba(6, 8, 16, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#f0f2f5',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      backgroundColor: 'rgba(6, 8, 16, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#f0f2f5',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  >
                    <option value="Telemetry Operator">Telemetry Op</option>
                    <option value="Telecommand Engineer">Command Eng</option>
                    <option value="Payload Scientist">Payload Sci</option>
                    <option value="HAM Radio Observer">HAM Observer</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  padding: '0.85rem',
                  backgroundColor: '#f59e0b',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#04060a',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                }}
              >
                COMMISSION OPERATOR
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
