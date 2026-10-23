import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Tag from './Tag';
import { EXPERIMENTS } from '../labMap';

// Page → files that implement it. Edit this map to change what the panel shows.
const FILES = {
  '/': ['components/HowItWorks.jsx', 'components/LatestNews.jsx', 'components/Hero.jsx'],
  '/crew': ['pages/CrewRegistry.jsx', '../server/mongo/api.js', '../server/mongo/crew.js'],
  '/telemetry': ['pages/TelemetryHub.jsx', 'components/TelemetryStreamEngine.jsx', 'components/DraggableQueue.jsx'],
  '/uplink': ['pages/GroundUplink.jsx'],
  '/gateway': ['pages/GroundSupport.jsx', '../server/groundStationServer.js'],
  '/news': ['pages/Dispatches.jsx', '../server/mongo/api.js'],
  '/experiments': ['pages/Experiments.jsx', 'labMap.js', 'components/Tag.jsx'],
  '/students': ['pages/Students.jsx', '../server/students/routes.js', '../server/students/find.js'],
  '/experiments/contact': ['pages/Contact.jsx'],
  '/login': ['pages/LoginForm.jsx', 'context/AuthContext.jsx'],
  '/register': ['pages/RegisterForm.jsx', 'context/AuthContext.jsx'],
  '/about/team': ['pages/About.jsx', 'pages/Team.jsx'],
  '/about/company': ['pages/About.jsx', 'pages/Company.jsx'],
};

// Things worth pointing at, in the order they should appear.
const PATTERNS = [
  ['useState', /useState\(/],
  ['useEffect', /useEffect\(/],
  ['fetch', /\bfetch\(/],
  ['useNavigate / Outlet', /useNavigate\(|<Outlet/],
  ['Context', /createContext\(|useContext\(/],
  ['Express route', /app\.(get|post|put|delete)\(/],
  ['MongoDB call', /\.(insertOne|find|findOneAndUpdate|deleteOne)\(/],
  ['axios', /axios\.get\(/],
  ['async / await', /await /],
  ['http server', /http\.createServer\(/],
];

const sources = import.meta.glob(['/src/**/*.{js,jsx}', '/server/**/*.js'], { query: '?raw', import: 'default' });

function Snippet({ lines, at }) {
  const from = Math.max(0, at - 1);
  const to = Math.min(lines.length, at + 11);
  return (
    <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: '#0b101d', padding: '0.6rem', borderRadius: 6, margin: '0.3rem 0 0.8rem', overflowX: 'auto' }}>
      {lines.slice(from, to).map((l, i) => `${String(from + i + 1).padStart(4)}  ${l}`).join('\n')}
    </pre>
  );
}

function FileBlock({ file }) {
  const path = file.startsWith('../') ? '/server/' + file.slice(10) : '/src/' + file;
  const label = path.slice(1);
  const [lines, setLines] = useState(null);
  const [open, setOpen] = useState(null);

  const load = (e) => {
    if (e.target.open && !lines) sources[path]().then((t) => setLines(t.split('\n')));
  };
  const hits = lines ? PATTERNS.map(([name, re]) => [name, lines.findIndex((l) => re.test(l)) + 1]).filter(([, n]) => n) : [];

  return (
    <details onToggle={load} style={{ marginBottom: '0.5rem' }}>
      <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0' }}>{label}</summary>
      {!lines && <div style={{ color: '#64748b', fontSize: '0.8rem' }}>loading…</div>}
      {lines && (
        <div style={{ marginTop: '0.4rem' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {hits.map(([name, n]) => (
              <button key={name} onClick={() => setOpen(open === name ? null : name)} style={{ padding: '0.25rem 0.6rem', borderRadius: 5, border: '1px solid #334155', background: open === name ? '#0e7490' : '#0b101d', color: '#f8fafc', cursor: 'pointer', fontSize: '0.75rem' }}>
                {name} · line {n}
              </button>
            ))}
            {!hits.length && <span style={{ color: '#64748b', fontSize: '0.8rem' }}>No hooks or routes here.</span>}
          </div>
          {open && <Snippet lines={lines} at={hits.find(([n]) => n === open)[1]} />}
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 6 }}>{lines.length} lines total. Open the file path above to see the rest.</div>
        </div>
      )}
    </details>
  );
}

export default function CodePanel() {
  const { pathname } = useLocation();
  const files = FILES[pathname];
  const exps = EXPERIMENTS.filter((e) => e.routes.includes(pathname));
  if (!files) return null;
  return (
    <>
    <div style={{ display: 'flex', gap: 6, maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem' }}>{exps.map((e) => <Tag key={e.n} label={`Exp ${e.n}: ${e.title}`} kind="exp" />)}</div>
    <details key={pathname} style={{ maxWidth: 1000, margin: '0 auto', padding: '1rem 1.5rem 3rem', width: '100%' }}>
      <summary style={{ cursor: 'pointer', color: '#38bdf8', fontSize: '0.9rem' }}>{'</>'} Code behind this page</summary>
      <div style={{ marginTop: '0.8rem' }}>
        {files.map((f) => <FileBlock key={f} file={f} />)}
      </div>
    </details>
    </>
  );
}
