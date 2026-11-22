import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  User,
  Globe,
  AlertCircle,
  CheckCircle2,
  Radio,
  ArrowRight,
  KeyRound,
  Eye,
  EyeOff,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Mode: 'login' vs 'register'
  const [mode, setMode] = useState('login');

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Success Feedback
  const [authSuccess, setAuthSuccess] = useState(null);

  // --- Sign In State ---
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  // --- Registration State ---
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
    payloadMode: 'TT&C / Housekeeping',
    agreeTerms: false
  });
  const [regErrors, setRegErrors] = useState({});

  // --- Sign In Handler ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!loginForm.username.trim()) {
      errors.username = 'Operator ID / Username is required and cannot be empty';
    }
    if (!loginForm.password.trim()) {
      errors.password = 'Passcode is required and cannot be empty';
    } else if (loginForm.password.length < 6) {
      errors.password = 'Passcode must be at least 6 characters long';
    }

    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      login(loginForm.username, loginForm.password);
      setAuthSuccess(`Access Granted! Welcome Operator ${loginForm.username}. Redirecting to Telemetry Hub...`);
      setTimeout(() => {
        navigate('/telemetry');
      }, 1200);
    }
  };

  // --- Registration Handler ---
  const handleRegSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!regForm.name.trim()) errors.name = 'Full Name is required and cannot be empty';
    if (!regForm.email.trim()) {
      errors.email = 'Academic email address is required';
    } else if (!regForm.email.includes('@')) {
      errors.email = 'Valid email must contain "@" (e.g. operator@somaiya.edu)';
    }
    if (!regForm.password) {
      errors.password = 'Access passcode is required';
    } else if (regForm.password.length < 6) {
      errors.password = `Password is ${regForm.password.length} chars. Must be at least 6 characters`;
    }
    if (!regForm.country) errors.country = 'Please select a ground station location';
    if (!regForm.agreeTerms) errors.agreeTerms = 'You must accept amateur radio operational terms';

    setRegErrors(errors);

    if (Object.keys(errors).length === 0) {
      register(regForm);
      setAuthSuccess(`Registration Successful! Station initialized for ${regForm.name}. Redirecting to Telemetry Hub...`);
      setTimeout(() => {
        navigate('/telemetry');
      }, 1200);
    }
  };

  return (
    <div style={{
      maxWidth: '540px',
      margin: '3rem auto',
      padding: '0 1.5rem'
    }}>
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        position: 'relative'
      }}>
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: '#04060a',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: '#00f0ff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(2, 132, 199, 0.4)',
            marginBottom: '1rem'
          }}>
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            {mode === 'login' ? 'Mission Operator Sign In' : 'Register Ground Station Access'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
            SomaiyaSat &amp; SomaiyaPod Orbital Command Gateway
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: '#04060a',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setAuthSuccess(null);
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'login' ? '#0284c7' : 'transparent',
              color: mode === 'login' ? '#ffffff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setAuthSuccess(null);
            }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'register' ? '#0284c7' : 'transparent',
              color: mode === 'register' ? '#ffffff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Success Alert */}
        {authSuccess && (
          <div style={{
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid #34d399',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#a7f3d0',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={20} color="#34d399" />
            {authSuccess}
          </div>
        )}

        {/* --- MODE 1: SIGN IN --- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} noValidate>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: '#cbd5e1' }}>
                Operator Username / Callsign <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, username: e.target.value });
                    if (loginErrors.username) setLoginErrors({ ...loginErrors, username: '' });
                  }}
                  placeholder="Operator ID"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#04060a',
                    border: loginErrors.username ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {loginErrors.username && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {loginErrors.username}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: '#cbd5e1' }}>
                Passcode (min. 6 chars) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                    if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' });
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#04060a',
                    border: loginErrors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {loginErrors.password && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {loginErrors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#00f0ff',
                color: '#04060a',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)'
              }}
            >
              Sign In to Command Center <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* --- MODE 2: REGISTER --- */}
        {mode === 'register' && (
          <form onSubmit={handleRegSubmit} noValidate>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '500', marginBottom: '4px', color: '#cbd5e1' }}>
                Full Name / Operator ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={regForm.name}
                onChange={(e) => {
                  setRegForm({ ...regForm, name: e.target.value });
                  if (regErrors.name) setRegErrors({ ...regErrors, name: '' });
                }}
                placeholder="e.g. Student Research Engineer"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: regErrors.name ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              {regErrors.name && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '3px' }}>{regErrors.name}</div>
              )}
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '500', marginBottom: '4px', color: '#cbd5e1' }}>
                Academic / Station Email (@ required) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                value={regForm.email}
                onChange={(e) => {
                  setRegForm({ ...regForm, email: e.target.value });
                  if (regErrors.email) setRegErrors({ ...regErrors, email: '' });
                }}
                placeholder="operator@somaiya.edu"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: regErrors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              {regErrors.email && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '3px' }}>{regErrors.email}</div>
              )}
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '500', marginBottom: '4px', color: '#cbd5e1' }}>
                Access Passcode (min. 6 chars) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regForm.password}
                  onChange={(e) => {
                    setRegForm({ ...regForm, password: e.target.value });
                    if (regErrors.password) setRegErrors({ ...regErrors, password: '' });
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.4rem 0.65rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: '#04060a',
                    border: regErrors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  title={showRegPassword ? 'Hide password' : 'Show password'}
                >
                  {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {regErrors.password && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '3px' }}>{regErrors.password}</div>
              )}
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '500', marginBottom: '4px', color: '#cbd5e1' }}>
                Ground Station Location <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={regForm.country}
                onChange={(e) => {
                  setRegForm({ ...regForm, country: e.target.value });
                  if (regErrors.country) setRegErrors({ ...regErrors, country: '' });
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: '#04060a',
                  border: regErrors.country ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                  color: regForm.country ? '#ffffff' : '#94a3b8',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="">-- Select Ground Station Location --</option>
                <option value="India - Mumbai (KJSSE Command)">India - Mumbai (KJSSE Command)</option>
                <option value="Finland - Helsinki (ReOrbit Substation)">Finland - Helsinki (ReOrbit Substation)</option>
                <option value="USA - NASA Satellite Tracking Network">USA - NASA Satellite Tracking Network</option>
                <option value="Germany - DLR Amateur Node">Germany - DLR Amateur Node</option>
                <option value="Japan - JAXA Educational Station">Japan - JAXA Educational Station</option>
              </select>
              {regErrors.country && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '3px' }}>{regErrors.country}</div>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={regForm.agreeTerms}
                  onChange={(e) => {
                    setRegForm({ ...regForm, agreeTerms: e.target.checked });
                    if (regErrors.agreeTerms) setRegErrors({ ...regErrors, agreeTerms: '' });
                  }}
                  style={{ marginTop: '2px', accentColor: '#38bdf8' }}
                />
                <span>Agree to Amateur Radio Open Protocol &amp; ITU regulations</span>
              </label>
              {regErrors.agreeTerms && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '3px' }}>{regErrors.agreeTerms}</div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#10b981',
                color: '#04060a',
                fontWeight: '700',
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
              }}
            >
              <CheckCircle2 size={18} /> Complete Registration &amp; Sign In
            </button>
          </form>
        )}

        {/* Link to Full Registration */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: '#94a3b8'
        }}>
          Need to register a full international ground station?{' '}
          <Link to="/register" style={{ color: '#38bdf8', fontWeight: '600', textDecoration: 'none' }}>
            Open Ground Station Setup &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
