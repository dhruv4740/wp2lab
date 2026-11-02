import React, { useState } from 'react';

const box = { padding: '0.55rem', borderRadius: 6, border: '1px solid #334155', background: '#0b101d', color: '#f8fafc', width: '100%' };
const FIELDS = [
  { key: 'snr', label: 'Link SNR (dB)', check: (v) => (v < -20 || v > 40 ? 'SNR must be between -20 dB and 40 dB.' : '') },
  { key: 'battery', label: 'Battery (%)', check: (v) => (v < 0 || v > 100 ? 'Battery must be between 0% and 100%.' : '') },
  { key: 'temperature', label: 'Temperature (°C)', check: (v) => (v < -60 || v > 100 ? 'Temperature must be between -60°C and 100°C.' : '') },
];

// Manual entry form: controlled inputs, validation on submit, and the parent is called only when every field is valid.
export default function LinkForm({ onSubmitData }) {
  const [values, setValues] = useState({ snr: '', battery: '', temperature: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = {};
    FIELDS.forEach((f) => {
      const raw = values[f.key];
      if (raw.trim() === '' || Number.isNaN(Number(raw))) found[f.key] = f.label + ' is required and must be a number.';
      else if (f.check(Number(raw))) found[f.key] = f.check(Number(raw));
    });
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmitData({ snr: Number(values.snr), battery: Number(values.battery), temperature: Number(values.temperature) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.8rem', padding: '1.2rem', borderRadius: 12, background: 'var(--bg-surface)', border: 'var(--border-default)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)' }}>Manual link data entry</h3>
      {FIELDS.map((f) => (
        <label key={f.key} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {f.label}
          <input name={f.key} value={values[f.key]} onChange={handleChange} style={box} />
          {errors[f.key] && <div style={{ color: '#fb7185', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{errors[f.key]}</div>}
        </label>
      ))}
      <button type="submit" style={{ ...box, cursor: 'pointer', borderColor: '#38bdf8', color: '#38bdf8' }}>Submit data</button>
    </form>
  );
}
