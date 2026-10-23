import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function RegisterForm() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', marginBottom: '1.2rem' }}>Create account</h1>
      <AuthForm mode="register" onDone={() => navigate('/telemetry')} />
      <p style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>Already registered? <Link to="/login" style={{ color: '#00e5ff' }}>Sign in</Link></p>
    </div>
  );
}
