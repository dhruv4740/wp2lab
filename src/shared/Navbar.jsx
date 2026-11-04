// Top navigation bar: NavLink highlights the active route, and the menu button toggles the mobile layout.
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../exp3-forms/AuthContext';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/students', label: 'Students' },
  { to: '/experiments/contact', label: 'Contact' },
  { to: '/telemetry', label: 'Telemetry' },
  { to: '/monitor', label: 'Monitor' },
  { to: '/uplink', label: 'Uplink' },
  { to: '/gateway', label: 'Gateway' },
  { to: '/news', label: 'News' },
  { to: '/crew', label: 'Crew' },
];

// Navbar styles, including the mobile menu rules, injected through a style element.
const css = `
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; gap: 1.5rem; padding: 0.8rem 1.5rem; background: rgba(4,6,10,0.9); border-bottom: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(8px); }
.nav a.link { color: #94a3b8; text-decoration: none; font-size: 0.9rem; }
.nav a.link:hover, .nav a.link.active { color: #00e5ff; }
.nav .links { display: flex; gap: 1.3rem; flex: 1; }
.nav .actions { display: flex; gap: 0.6rem; align-items: center; }
.nav button.b { padding: 0.4rem 0.9rem; border-radius: 6px; background: transparent; border: 1px solid rgba(0,229,255,0.4); color: #00e5ff; cursor: pointer; font-size: 0.85rem; }
.nav .burger { display: none; background: none; border: none; color: #f0f2f5; cursor: pointer; }
@media (max-width: 800px) {
  .nav .burger { display: block; margin-left: auto; }
  .nav .links, .nav .actions { display: none; }
  .nav.open { flex-wrap: wrap; }
  .nav.open .links, .nav.open .actions { display: flex; flex-direction: column; width: 100%; gap: 0.8rem; padding-top: 0.6rem; }
}
`;

export default function Navbar({ onOpenAuth }) {
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  return (
    <nav className={'nav' + (open ? ' open' : '')}>
      <style>{css}</style>
      <Link to="/" onClick={close} style={{ color: '#f0f2f5', textDecoration: 'none', fontWeight: 700, letterSpacing: 1 }}>SOMAIYASAT</Link>

      <div className="links">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={close} className={({ isActive }) => 'link' + (isActive ? ' active' : '')}>{l.label}</NavLink>
        ))}
      </div>

      <div className="actions">
        {isLoggedIn ? (
          <>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00e5ff' }}>{user.callsign}</span>
            <button className="b" onClick={() => { logout(); close(); navigate('/'); }}>Sign out</button>
          </>
        ) : (
          <button className="b" onClick={() => { close(); onOpenAuth(); }}>Sign in</button>
        )}
      </div>

      <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    </nav>
  );
}
