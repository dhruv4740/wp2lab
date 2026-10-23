import React from 'react';
import { Link } from 'react-router-dom';

const ITEMS = [
  { to: '/crew', title: 'Crew Registry', text: 'React + Express + MongoDB: create, read, update and delete crew records.' },
  { to: '/students', title: 'Student Management (Exp 8)', text: 'React + Express REST API + MongoDB: register, list, filter, update, delete, scholarship list.' },
  { to: '/login', title: 'Sign In', text: 'Login form with validation.' },
  { to: '/register', title: 'Register', text: 'Registration form with validation, dropdown and checkbox.' },
  { to: '/about', title: 'About (nested routes)', text: 'Nested routing with Team and Company sub-pages.' },
  { to: '/experiments/contact', title: 'Contact Form', text: 'Form submit with programmatic navigation.' },
  { to: '/experiments/news', title: 'News (fetch API)', text: 'Fetching JSON with loading and error states.' },
  { to: '/experiments/uplink', title: 'Uplink Forms', text: 'Forgiving and structured input formats.' },
  { to: '/experiments/node-console', title: 'Node.js Console', text: 'Node core modules, HTTP server and client, event loop.' },
  { to: '/telemetry', title: 'Telemetry (in-page editing)', text: 'Inline edit, overlays, tables, drag and drop.' },
];

export default function Experiments() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Experiments</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Every web programming topic built into this site, one click each.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {ITEMS.map((i) => (
          <Link key={i.to} to={i.to} style={{ textDecoration: 'none', color: '#f8fafc', padding: '1.1rem', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, background: 'rgba(11,16,29,0.7)' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{i.title}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{i.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
