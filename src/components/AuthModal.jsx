import React, { useState, useEffect } from 'react';
import AuthForm from './AuthForm';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, background: '#0a0e18', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1px solid #334155', background: mode === m ? '#0e7490' : 'transparent', color: '#f8fafc', cursor: 'pointer' }}>
              {m === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>
        <AuthForm key={mode} mode={mode} onDone={onClose} />
      </div>
    </div>
  );
}
