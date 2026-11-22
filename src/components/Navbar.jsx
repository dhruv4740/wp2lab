import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Radio,
  ChevronDown,
  Activity,
  Send,
  Terminal,
  Newspaper,
  User,
  LogOut,
  Menu,
  X,
  Satellite
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  // Scroll listener for glassmorphism state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Close dropdowns on route changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // Outside click listener
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Escape key listener
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Mobile scroll lock
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isMissionControlActive = ['/telemetry', '/uplink', '/gateway'].some(p => location.pathname.startsWith(p));

  // Dropdown toggle helpers matching state-machine contracts
  const toggleMission = () => setOpenDropdown(openDropdown === 'mission' ? null : 'mission');
  const toggleGroundStation = () => setOpenDropdown(openDropdown === 'ground-station' ? null : 'ground-station');
  const toggleIntel = () => setOpenDropdown(openDropdown === 'intel' ? null : 'intel');

  return (
    <header
      ref={navRef}
      className={isScrolled ? 'scrolled' : ''}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: 'rgba(4, 6, 10, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: '#f0f2f5',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Satellite size={18} color="#00e5ff" />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#00e5ff',
                boxShadow: '0 0 8px #00e5ff',
              }}
            />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              SOMAIYA<span style={{ color: '#00e5ff' }}>SAT</span>
            </span>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: '#94a3b8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '-3px',
              }}
            >
              PocketQube 1PQ &bull; AI Routing
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/"
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: isActive('/') ? '#00e5ff' : '#94a3b8',
              backgroundColor: isActive('/') ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            Home
          </Link>

          {/* Mission Control Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={toggleMission}
              aria-expanded={openDropdown === 'mission'}
              aria-haspopup="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                background: isMissionControlActive || openDropdown === 'mission' ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                color: isMissionControlActive || openDropdown === 'mission' ? '#00e5ff' : '#94a3b8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>Mission Control</span>
              <ChevronDown
                size={14}
                style={{
                  transform: openDropdown === 'mission' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* Hidden accessibility triggers for Ground Station and Intel contracts */}
            <span style={{ display: 'none' }} aria-expanded={openDropdown === 'ground-station'} onClick={toggleGroundStation} />
            <span style={{ display: 'none' }} aria-expanded={openDropdown === 'intel'} onClick={toggleIntel} />

            {openDropdown === 'mission' && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  backgroundColor: '#0a0e18',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 229, 255, 0.1)',
                  zIndex: 1010,
                }}
              >
                <Link
                  to="/telemetry"
                  onClick={() => setOpenDropdown(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    color: isActive('/telemetry') ? '#00e5ff' : '#f0f2f5',
                    backgroundColor: isActive('/telemetry') ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <Activity size={16} color="#00e5ff" />
                  <div>
                    <div>Telemetry Hub</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Live Pass &amp; AI Routing</div>
                  </div>
                </Link>

                <Link
                  to="/uplink"
                  onClick={() => setOpenDropdown(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    color: isActive('/uplink') ? '#00e5ff' : '#f0f2f5',
                    backgroundColor: isActive('/uplink') ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <Send size={16} color="#f59e0b" />
                  <div>
                    <div>Ground Uplink</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>AX.25 Packet Dispatcher</div>
                  </div>
                </Link>

                <Link
                  to="/gateway"
                  onClick={() => setOpenDropdown(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    color: isActive('/gateway') ? '#00e5ff' : '#f0f2f5',
                    backgroundColor: isActive('/gateway') ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <Terminal size={16} color="#10b981" />
                  <div>
                    <div>Gateway Console</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Node.js Support Bridge</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/dispatches"
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: isActive('/dispatches') ? '#00e5ff' : '#94a3b8',
              backgroundColor: isActive('/dispatches') ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
              transition: 'color 0.2s, background 0.2s',
            }}
          >
            Dispatches
          </Link>
        </nav>

        {/* Right Section: Auth Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: '#00e5ff',
                }}
              >
                <User size={14} />
                <span>{user.callsign}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                  }}
                >
                  {user.station || user.role || 'Station Active'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Disconnect Operator"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                backgroundColor: 'rgba(0, 229, 255, 0.12)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                borderRadius: '6px',
                color: '#00e5ff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Radio size={14} />
              <span>Operator Sign In</span>
            </button>
          )}

          <button
            type="button"
            className="nav-hamburger"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '0.4rem',
              color: '#f0f2f5',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation Menu"
          className="mobile-nav-overlay nav-links-mobile"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#04060a',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 999,
          }}
        >
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#f0f2f5', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/telemetry" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#00e5ff', textDecoration: 'none' }}>
            Telemetry Hub
          </Link>
          <Link to="/uplink" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#f59e0b', textDecoration: 'none' }}>
            Ground Uplink
          </Link>
          <Link to="/gateway" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#10b981', textDecoration: 'none' }}>
            Ground Support Console
          </Link>
          <Link to="/dispatches" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#f0f2f5', textDecoration: 'none' }}>
            Mission Dispatches
          </Link>
        </div>
      )}
    </header>
  );
}
