import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tag from '../components/Tag';
import { EXPERIMENTS, POINTERS, EXP_POINTERS } from '../labMap';

const sources = import.meta.glob(['/src/**/*.{js,jsx}', '/server/**/*.js'], { query: '?raw', import: 'default' });
const path = (f) => (f.startsWith('../') ? '/server/' + f.slice(10) : '/src/' + f);
const cell = { padding: '0.45rem 0.6rem', borderBottom: '1px solid #1e293b', textAlign: 'left', fontSize: '0.85rem' };

export default function Experiments() {
  const [lines, setLines] = useState({}); // pointer index -> line number

  useEffect(() => {
    [...POINTERS, ...EXP_POINTERS].forEach(async (p, i) => {
      const text = await sources[path(p.file)]();
      const n = text.split('\n').findIndex((l) => new RegExp(p.find).test(l)) + 1;
      setLines((prev) => ({ ...prev, [i]: n }));
    });
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', marginBottom: '0.5rem' }}>WP-II Experiments</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Exp 1 to 8 and where each is shown on this site, then every programming-test pointer with its file and line.</p>

      <h2 style={{ marginBottom: '0.8rem' }}>Experiment-wise</h2>
      <div style={{ display: 'grid', gap: '0.8rem', marginBottom: '2.5rem' }}>
        {EXPERIMENTS.map((e) => (
          <div key={e.n} style={{ padding: '0.9rem 1rem', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, background: 'rgba(11,16,29,0.7)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}><Tag label={`Exp ${e.n}`} kind="exp" /><b>{e.title}</b></div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Pages: {e.routes.map((r) => <Link key={r} to={r} style={{ color: '#38bdf8', marginRight: 10 }}>{r}</Link>)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: 4 }}>Files: {e.files.join('  ')}</div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: '0.8rem' }}>Programming-test pointers</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th style={cell}>Pointer</th><th style={cell}>Shown by</th><th style={cell}>File</th><th style={cell}>Line</th></tr></thead>
        <tbody>
          {POINTERS.map((p, i) => (
            <tr key={i}>
              <td style={cell}><Tag label={p.name} /></td>
              <td style={cell}>{p.detail}</td>
              <td style={{ ...cell, fontFamily: 'var(--font-mono)' }}>{path(p.file).slice(1)}</td>
              <td style={cell}>{lines[i] || '…'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ margin: '2rem 0 0.8rem' }}>Experiment topics (file and line)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th style={cell}>Exp</th><th style={cell}>Topic</th><th style={cell}>File</th><th style={cell}>Line</th></tr></thead>
        <tbody>
          {EXP_POINTERS.map((p, i) => (
            <tr key={i}>
              <td style={cell}><Tag label={`Exp ${p.exp}`} kind="exp" /></td>
              <td style={cell}>{p.name}</td>
              <td style={{ ...cell, fontFamily: 'var(--font-mono)' }}>{path(p.file).slice(1)}</td>
              <td style={cell}>{lines[POINTERS.length + i] || '…'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
