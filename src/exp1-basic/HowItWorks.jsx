import React, { useState, useEffect } from 'react';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080/api';
const CREW_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Poll a URL every `ms` milliseconds. Returns { data, error }.
function usePoll(url, ms) {
  const [state, setState] = useState({ data: null, error: false });
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(url)
        .then((r) => r.json())
        .then((data) => alive && setState({ data, error: false }))
        .catch(() => alive && setState({ data: null, error: true }));
    load();
    const id = setInterval(load, ms);
    return () => { alive = false; clearInterval(id); };
  }, [url, ms]);
  return state;
}

const TAGS = {
  live: { text: 'LIVE', color: '#10b981' },
  sim: { text: 'SIMULATED', color: '#f59e0b' },
  local: { text: 'IN BROWSER', color: '#38bdf8' },
};

function Card({ kind, title, hook, file, code, children }) {
  const tag = TAGS[kind];
  return (
    <div style={{ padding: '1.2rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,14,24,0.75)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
        <span style={{ color: tag.color }}>● {tag.text}</span>
        <span style={{ color: 'var(--text-muted)' }}>{hook}</span>
      </div>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem' }}>{title}</h3>
      {children}
      <details style={{ marginTop: '0.8rem' }}>
        <summary style={{ cursor: 'pointer', color: '#38bdf8', fontSize: '0.8rem' }}>Show code</summary>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.5rem 0 0.3rem' }}>{file}</div>
        <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', whiteSpace: 'pre-wrap', background: '#0b101d', padding: '0.6rem', borderRadius: 6, margin: 0 }}>{code}</pre>
      </details>
    </div>
  );
}

const big = { fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' };
const note = { color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' };

function CrewCard() {
  const { data, error } = usePoll(`${CREW_API}/crew`, 5000);
  return (
    <Card kind="live" title="Crew in MongoDB" file="src/exp1-basic/HowItWorks.jsx → usePoll (line 7)" code={"useEffect(() => {\n  const load = () => fetch(url).then(r => r.json()).then(setData);\n  load();\n  const id = setInterval(load, ms);\n  return () => clearInterval(id);\n}, [url, ms]);"} hook="useEffect + fetch">
      <div style={big}>{error ? 'offline' : data ? data.length : '…'}</div>
      <p style={note}>Counted from the database every 5 s. Add someone on the Crew page and watch it change.</p>
    </Card>
  );
}

function ServerCard() {
  const { data, error } = usePoll(`${GATEWAY}/health`, 3000);
  return (
    <Card kind="live" title="Ground server (Node)" file="src/exp1-basic/HowItWorks.jsx → usePoll (line 7)" code={"useEffect(() => {\n  const load = () => fetch(url).then(r => r.json()).then(setData);\n  load();\n  const id = setInterval(load, ms);\n  return () => clearInterval(id);\n}, [url, ms]);"} hook="useEffect + setInterval">
      <div style={big}>{error ? 'offline' : data ? `${Math.floor(data.nodeRuntime.uptimeSeconds / 60)} min up` : '…'}</div>
      <p style={note}>Real process uptime from server.js on port 8080, polled every 3 s.</p>
    </Card>
  );
}

function TelemetryCard() {
  const { data, error } = usePoll(`${GATEWAY}/telemetry`, 2000);
  return (
    <Card kind="sim" title="Satellite battery" file="src/exp1-basic/HowItWorks.jsx → usePoll (line 7)
server: server/groundStationServer.js:118" code={"useEffect(() => {\n  const load = () => fetch(url).then(r => r.json()).then(setData);\n  load();\n  const id = setInterval(load, ms);\n  return () => clearInterval(id);\n}, [url, ms]);"} hook="useEffect + setInterval">
      <div style={big}>{error ? 'offline' : data ? `${data.power.batteryPercent}%` : '…'}</div>
      <p style={note}>The fetch is real, the satellite is not: the server generates these values randomly until we have a downlink.</p>
    </Card>
  );
}

const PRIORITY = { 'TT&C': 0, SSTV: 1, Voice: 2 };

function RouterCard() {
  const [queue, setQueue] = useState([]);
  const [sent, setSent] = useState([]);

  const add = (type) => setQueue((q) => [...q, type]);
  const sendNext = () => {
    if (!queue.length) return;
    const best = queue.reduce((a, b) => (PRIORITY[b] < PRIORITY[a] ? b : a));
    setQueue((q) => { const i = q.indexOf(best); return q.filter((_, n) => n !== i); });
    setSent((s) => [best, ...s].slice(0, 5));
  };

  const btn = { padding: '0.4rem 0.7rem', borderRadius: 6, border: '1px solid #334155', background: '#0b101d', color: '#f8fafc', cursor: 'pointer' };
  return (
    <Card kind="local" title="AI router, simplified" file="src/exp1-basic/HowItWorks.jsx → RouterCard" code={"const [queue, setQueue] = useState([]);\nconst add = (t) => setQueue(q => [...q, t]);\nconst best = queue.reduce((a, b) =>\n  PRIORITY[b] < PRIORITY[a] ? b : a);"} hook="useState">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {Object.keys(PRIORITY).map((t) => <button key={t} style={btn} onClick={() => add(t)}>+ {t}</button>)}
        <button style={{ ...btn, borderColor: '#38bdf8', color: '#38bdf8' }} onClick={sendNext}>Send next</button>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Queue: {queue.join(', ') || 'empty'}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Sent: {sent.join(' → ') || 'nothing yet'}</div>
      <p style={note}>Add packets in any order. Telemetry (TT&C) always goes first, then images, then voice, like the real router.</p>
    </Card>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.4rem' }}>What on this site is live?</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Each card is labelled live, simulated or in-browser, and names the React hook that powers it.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        <CrewCard />
        <ServerCard />
        <TelemetryCard />
        <RouterCard />
      </div>
    </section>
  );
}
