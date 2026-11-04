import React, { useState, useEffect, useCallback } from 'react';

// Exp 8: React front end for the Crew REST API (list, add, edit, delete) stored in MongoDB.
// Uses the fetch API in async functions and controlled form inputs (Exp 3).
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BRANCHES = ['Computer', 'IT', 'Electronics', 'Mechanical', 'Other'];

// Helper for every request: sends JSON, parses the reply, and throws the server's error message on a non-2xx status.
async function api(path, options) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const box = { padding: '0.6rem', borderRadius: 6, border: '1px solid #334155', background: '#0b101d', color: '#f8fafc' };
const btn = { ...box, cursor: 'pointer', borderColor: '#38bdf8', color: '#38bdf8' };

export default function CrewRegistry() {
  const [crew, setCrew] = useState([]);
  const [form, setForm] = useState({ name: '', branch: BRANCHES[0] });
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [error, setError] = useState('');

  // Load the crew list from the server; also called after every change to refresh the table.
  const load = useCallback(() => {
    api('/crew').then(setCrew).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  // Two-step delete: the first click asks for confirmation, the second click deletes.
  // The pending confirmation is cleared after 4 seconds.
  useEffect(() => {
    if (!confirmId) return;
    const t = setTimeout(() => setConfirmId(null), 4000);
    return () => clearTimeout(t);
  }, [confirmId]);

  // PUT when editing an existing member, POST when adding a new one.
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api(editId ? `/crew/${editId}` : '/crew', { method: editId ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setForm({ name: '', branch: BRANCHES[0] });
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (confirmId !== id) return setConfirmId(id);
    setConfirmId(null);
    try {
      await api(`/crew/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Crew Registry</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Ground-station crew, stored in MongoDB.</p>

      <form onSubmit={submit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input style={{ ...box, flex: 1, minWidth: 180 }} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select style={box} value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
          {BRANCHES.map((b) => <option key={b}>{b}</option>)}
        </select>
        <button style={btn} type="submit">{editId ? 'Save' : 'Add'}</button>
        {editId && <button style={box} type="button" onClick={() => { setEditId(null); setForm({ name: '', branch: BRANCHES[0] }); }}>Cancel</button>}
      </form>

      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#94a3b8' }}><th>Callsign</th><th>Name</th><th>Branch</th><th /></tr>
        </thead>
        <tbody>
          {crew.map((m) => (
            <tr key={m._id} style={{ borderTop: '1px solid #1e293b' }}>
              <td style={{ padding: '0.6rem 0', fontFamily: 'var(--font-mono)' }}>{m.callsign}</td>
              <td>{m.name}</td>
              <td>{m.branch}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button style={{ ...box, marginRight: 6 }} onClick={() => { setEditId(m._id); setForm({ name: m.name, branch: m.branch }); }}>Edit</button>
                <button style={{ ...box, borderColor: '#f87171', color: '#f87171' }} onClick={() => remove(m._id)}>
                  {confirmId === m._id ? 'Confirm?' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
          {crew.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem 0', color: '#64748b' }}>No crew yet. Add the first member above.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
