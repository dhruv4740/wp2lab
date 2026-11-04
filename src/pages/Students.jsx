import React, { useState, useEffect, useCallback } from 'react';

// Exp 8: React front end for the Students REST API (list, filter, create, update, delete,
// scholarship list). Uses the fetch API in async functions and controlled form inputs (Exp 3).
// Exp 2 (hooks, props-style data, conditional rendering, events) is shown here too: read the
// state, the effect and the return() below.
// API: base address of the Express server (port 5000). VITE_API_URL can override it.
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Options for the Branch dropdown; the form starts on the first one.
const BRANCHES = ['Computer', 'IT', 'Electronics', 'Mechanical'];
// A blank form. Used at the start and again after a student is saved or editing is cancelled.
const EMPTY = { rollNo: '', name: '', branch: BRANCHES[0], state: '', joiningYear: '', cgpa: '', subjects: '' };

// Helper for every request: sends JSON, parses the reply, and throws the server's error message on a non-2xx status.
async function api(path, options) {
  const res = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Two style objects reused by every input and button. `...box` copies box and then overrides some fields.
const box = { padding: '0.55rem', borderRadius: 6, border: '1px solid #334155', background: '#0b101d', color: '#f8fafc' };
const btn = { ...box, cursor: 'pointer', borderColor: '#38bdf8', color: '#38bdf8' };

export default function Students() {
  // useState gives the page a memory. Each line is [value, function to change it] = useState(start value).
  // Calling the setter makes React draw the page again with the new value.
  const [students, setStudents] = useState([]);      // the rows shown in the table
  const [form, setForm] = useState(EMPTY);           // what is typed in the form boxes
  const [editId, setEditId] = useState(null);        // null = adding a student; an id = editing that student
  const [view, setView] = useState('all'); // 'all' | 'scholarship'
  const [filter, setFilter] = useState({ key: 'state', value: '' }); // filter by state / year / subject
  const [loading, setLoading] = useState(true);      // true while waiting for the server
  const [error, setError] = useState('');            // error text to show, or '' for none

  // Build the URL from the current view and filter (for example /students?state=Goa), then GET the list.
  const load = useCallback(() => {
    let path = view === 'scholarship' ? '/students/scholarship' : '/students';
    if (view === 'all' && filter.value.trim()) path += `?${filter.key}=${encodeURIComponent(filter.value.trim())}`;
    setLoading(true);
    api(path).then(setStudents).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [view, filter]);
  // useEffect runs code after the page is drawn. It runs once when the page opens, and again whenever
  // `load` changes (which only happens when `view` or `filter` change). So changing the tab or typing
  // in the filter box fetches a fresh list. useCallback above keeps `load` the same function between
  // draws; without it the effect would run after every draw.
  useEffect(() => { load(); }, [load]);

  // Returns a change handler that updates one field of the form state (controlled inputs).
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // One submit handler: PUT when editing an existing student, POST when registering a new one.
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api(editId ? `/students/${editId}` : '/students', { method: editId ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  // Ask first (window.confirm), then send DELETE and reload the list.
  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.name}?`)) return;
    try {
      await api(`/students/${s._id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  // Copy the chosen student into the form and switch to edit mode.
  const edit = (s) => {
    setEditId(s._id);
    setForm({ rollNo: s.rollNo, name: s.name, branch: s.branch, state: s.state, joiningYear: s.joiningYear, cgpa: s.cgpa, subjects: (s.subjects || []).join(', ') });
  };

  // What the page draws. Four parts: title, form, tabs + filter, table.
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Student Management</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>React → Express REST API → MongoDB (<code>students</code> collection).</p>

      {/* Part 1: the form. Every box shows a value from `form` and updates it on change (controlled inputs).
          onSubmit runs `submit`. The button text and the Cancel button depend on editId (conditional rendering). */}
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
        <input style={box} placeholder="Roll No" value={form.rollNo} onChange={set('rollNo')} required />
        <input style={box} placeholder="Name" value={form.name} onChange={set('name')} required />
        <select style={box} value={form.branch} onChange={set('branch')}>{BRANCHES.map((b) => <option key={b}>{b}</option>)}</select>
        <input style={box} placeholder="State" value={form.state} onChange={set('state')} required />
        <input style={box} type="number" placeholder="Joining year" value={form.joiningYear} onChange={set('joiningYear')} required />
        <input style={box} type="number" step="0.1" min="0" max="10" placeholder="CGPA" value={form.cgpa} onChange={set('cgpa')} required />
        <input style={box} placeholder="Subjects (comma separated)" value={form.subjects} onChange={set('subjects')} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ ...btn, flex: 1 }} type="submit">{editId ? 'Save' : 'Register'}</button>
          {editId && <button style={box} type="button" onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      {/* Shown only when `error` is not empty */}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {/* Part 2: two tab buttons (the active one is highlighted) and the filter, which is hidden on the scholarship tab */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        <button style={view === 'all' ? btn : box} onClick={() => setView('all')}>All students</button>
        <button style={view === 'scholarship' ? btn : box} onClick={() => setView('scholarship')}>Scholarship (CGPA &gt; 9)</button>
        {view === 'all' && (
          <>
            <select style={box} value={filter.key} onChange={(e) => setFilter({ key: e.target.value, value: '' })}>
              <option value="state">State</option>
              <option value="year">Joining year</option>
              <option value="subject">Subject</option>
            </select>
            <input style={box} placeholder={`Filter by ${filter.key}`} value={filter.value} onChange={(e) => setFilter({ ...filter, value: e.target.value })} />
          </>
        )}
      </div>

      {/* Part 3: "Loading…" until the server answers, then the table. students.map() draws one row per student;
          key={s._id} is the unique id MongoDB gave that student. The last row shows when the list is empty. */}
      {loading ? <p style={{ color: '#94a3b8' }}>Loading…</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#94a3b8' }}><th>Roll No</th><th>Name</th><th>Branch</th><th>State</th><th>Year</th><th>CGPA</th><th>Subjects</th><th /></tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} style={{ borderTop: '1px solid #1e293b' }}>
                <td style={{ padding: '0.5rem 0', fontFamily: 'var(--font-mono)' }}>{s.rollNo}</td>
                <td>{s.name}</td><td>{s.branch}</td><td>{s.state}</td><td>{s.joiningYear}</td><td>{s.cgpa}</td>
                <td>{(s.subjects || []).join(', ')}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button style={{ ...box, marginRight: 6 }} onClick={() => edit(s)}>Edit</button>
                  <button style={{ ...box, borderColor: '#f87171', color: '#f87171' }} onClick={() => remove(s)}>Delete</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan="8" style={{ padding: '1rem 0', color: '#64748b' }}>No students found.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
