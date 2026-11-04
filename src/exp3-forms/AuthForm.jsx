import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const ROLES = ['Ground Station Operator', 'AI Payload Operator', 'Observer'];
const box = { width: '100%', padding: '0.65rem', borderRadius: 6, border: '1px solid #334155', background: '#0b101d', color: '#f8fafc', marginTop: 4 };

// Exp 3: one form for both sign in and register. Inputs are controlled (value comes from state)
// and validation runs on submit, showing an error under each invalid field.
export default function AuthForm({ mode, onDone }) {
  const { login, register } = useAuth();
  const isReg = mode === 'register';
  const [v, setV] = useState({ name: '', email: '', password: '', role: ROLES[0], agree: false });
  const [errors, setErrors] = useState({});
  // Returns a change handler for one field; checkboxes use checked, other inputs use value.
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = (e) => {
    // Stop the browser's page reload, then collect one message per invalid field.
    e.preventDefault();
    const err = {};
    if (!v.name.trim()) err.name = isReg ? 'Name is required' : 'Username is required';
    if (isReg && !/^\S+@\S+\.\S+$/.test(v.email)) err.email = 'Enter a valid email';
    if (v.password.length < 6) err.password = 'At least 6 characters';
    if (isReg && !v.agree) err.agree = 'Please accept the terms';
    // Show the errors and stop if any field failed; otherwise sign in or register and notify the parent.
    setErrors(err);
    if (Object.keys(err).length) return;
    if (isReg) register({ name: v.name.trim(), email: v.email, role: v.role });
    else login(v.name.trim(), v.password);
    onDone?.();
  };

  // Small helper that renders one labelled input and its error message.
  const field = (key, label, type = 'text') => (
    <label style={{ display: 'block', marginBottom: '0.9rem', fontSize: '0.85rem', color: '#94a3b8' }}>
      {label}
      <input style={box} type={type} value={v[key]} onChange={set(key)} />
      {errors[key] && <span style={{ color: '#f87171' }}>{errors[key]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate>
      {field('name', isReg ? 'Name' : 'Username')}
      {isReg && field('email', 'Email', 'email')}
      {field('password', 'Password', 'password')}
      {isReg && (
        <>
          <label style={{ display: 'block', marginBottom: '0.9rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            Role
            <select style={box} value={v.role} onChange={set('role')}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
          </label>
          <label style={{ display: 'block', marginBottom: '0.9rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            <input type="checkbox" checked={v.agree} onChange={set('agree')} /> I accept the ground station terms
            {errors.agree && <div style={{ color: '#f87171' }}>{errors.agree}</div>}
          </label>
        </>
      )}
      <button type="submit" style={{ width: '100%', padding: '0.7rem', borderRadius: 6, border: 'none', background: '#00e5ff', color: '#04060a', fontWeight: 600, cursor: 'pointer' }}>
        {isReg ? 'Create account' : 'Sign in'}
      </button>
      <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 10 }}>Demo only: the account is stored in this browser (localStorage), not on a server.</p>
    </form>
  );
}
