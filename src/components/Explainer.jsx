import React from 'react';

const box = { padding: '1.2rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,14,24,0.75)' };
const h3 = { fontSize: '1.05rem', marginBottom: '0.5rem' };
const p = { color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.92rem', margin: 0 };
const mono = { fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' };

const STEPS = [
  ['1', 'Satellite', 'A 5 cm PocketQube satellite orbits Earth and makes data: battery, temperature, pictures, voice. Not launched yet, so this part is SIMULATED.'],
  ['2', 'AI router', 'It cannot send everything in a pass of about 10 minutes, so it ranks packets: telemetry first, then images, then voice.'],
  ['3', 'Ground station', 'Our Node.js server (port 8080) plays the receiver on the ground and serves telemetry over HTTP. Uptime is real, the numbers are random.'],
  ['4', 'This website', 'React pages fetch from the servers and show it: Telemetry, Uplink (send commands), Gateway, News.'],
  ['5', 'Database', 'Express API (port 5000) stores crew in MongoDB. This is real, saved data.'],
];

const DATA = [
  ['LIVE', '#10b981', 'Crew list (name, branch)', 'You type it, it is saved in MongoDB and survives a restart.'],
  ['LIVE', '#10b981', 'Ground server uptime', 'Read from the real Node process.'],
  ['LIVE', '#10b981', 'Space news', 'Real articles from the Spaceflight News API (api.spaceflightnewsapi.net), free, no key, via our /api/news.'],
  ['SIMULATED', '#f59e0b', 'Battery, temperature, signal', 'Math.random() in the ground server, standing in for the satellite until launch.'],
  ['SIMULATED', '#f59e0b', 'Telemetry stream, uplink queue, pass log', 'Generated in the browser with React state.'],
  ['LOCAL ONLY', '#38bdf8', 'Login / register', 'Kept in browser localStorage, no server check. A demo of Context and forms.'],
];

export default function Explainer() {
  return (
    <section id="about-project" style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem 1rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.6rem' }}>What is this project?</h2>
      <p style={{ ...p, marginBottom: '1.5rem' }}>
        SomaiyaSat is a student amateur-radio satellite. A satellite can talk to Earth only for a few minutes per pass, so it must choose what to send.
        This website is the <b>ground-station dashboard</b> for it: it shows the satellite's data, lets operators send commands, and keeps the crew list.
        The satellite is not in orbit yet, so some data is simulated. The cards below say which.
      </p>

      <h3 style={{ ...h3, marginBottom: '0.8rem' }}>How data flows</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.8rem', marginBottom: '1.5rem' }}>
        {STEPS.map(([n, t, d]) => (
          <div key={n} style={box}>
            <div style={mono}>STEP {n}</div>
            <h3 style={{ ...h3, marginTop: 4 }}>{t}</h3>
            <p style={{ ...p, fontSize: '0.82rem' }}>{d}</p>
          </div>
        ))}
      </div>

      <h3 style={{ ...h3, marginBottom: '0.8rem' }}>What is real and what is not</h3>
      <div style={{ ...box, padding: 0, overflow: 'hidden' }}>
        {DATA.map(([tag, color, what, why], i) => (
          <div key={what} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0.8rem', padding: '0.8rem 1rem', borderTop: i ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>● {tag}</span>
            <span style={{ fontSize: '0.88rem' }}><b>{what}</b> <span style={{ color: 'var(--text-secondary)' }}>— {why}</span></span>
          </div>
        ))}
      </div>
      <p style={{ ...p, marginTop: '1rem', fontSize: '0.82rem' }}>
        Stack: React 18 + Vite (browser) → Express + MongoDB (port 5000) and plain Node http (port 8080). The "Code behind this page" panel at the bottom of every page shows the matching source.
      </p>
    </section>
  );
}
