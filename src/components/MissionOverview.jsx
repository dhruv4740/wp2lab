import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Radio, Shield, Cpu, Layers, Award, Terminal, CheckCircle2 } from 'lucide-react';

const SpecIcon = ({ type }) => {
  const icons = {
    cube: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    battery: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
        <rect x="2" y="7" width="18" height="10" rx="2" />
        <path d="M22 11v2" />
        <rect x="4" y="9" width="6" height="6" rx="1" fill="rgba(16,185,129,0.3)" />
      </svg>
    ),
    radio: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5">
        <path d="M12 20v-8" />
        <path d="M8 16c0-2.2 1.8-4 4-4s4 1.8 4 4" />
        <path d="M5 13c0-3.87 3.13-7 7-7s7 3.13 7 7" />
        <circle cx="12" cy="20" r="2" fill="rgba(245,158,11,0.3)" />
      </svg>
    ),
    orbit: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      </svg>
    )
  };
  return <div style={{ marginBottom: '14px' }}>{icons[type]}</div>;
};

const SUBSYSTEM_SPECS = {
  eps: {
    title: 'EPS // Electrical Power Subsystem',
    status: 'OPTIMAL (4.18V BUS)',
    color: '#10b981',
    metrics: [
      { label: 'SOLAR CELLS', val: 'GaAs Triple-Junction (28.5% Eff)' },
      { label: 'ENERGY STORAGE', val: '2x 18650 Li-Ion (3.7V 3200mAh)' },
      { label: 'MPPT EFFICIENCY', val: '96.2% Peak Harvest' },
      { label: 'AVG BUS POWER', val: '820 mW Operational' },
    ],
    summary: 'Custom sub-1W micro-EPS featuring autonomous maximum power point tracking and automated low-voltage battery disconnect.'
  },
  ai: {
    title: 'OBC // Autonomous Edge-AI Engine',
    status: 'INFERENCE NOMINAL (18ms)',
    color: '#00f0ff',
    metrics: [
      { label: 'CORE ARCHITECTURE', val: 'ARM Cortex-M4F @ 120MHz' },
      { label: 'MODEL LATENCY', val: '18.4 ms Dynamic Re-weight' },
      { label: 'POLICY WEIGHTS', val: 'Quantized INT8 Tensor (32KB)' },
      { label: 'DECISION INTERVAL', val: '500 ms Environmental Cycle' },
    ],
    summary: 'Onboard neural decision engine that monitors link SNR, state-of-charge, and pass geometry to autonomously re-prioritize downlink packets.'
  },
  rf: {
    title: 'RF // UHF Transceiver & Modem',
    status: 'CARRIER READY (437.525 MHz)',
    color: '#f59e0b',
    metrics: [
      { label: 'TX FREQUENCY', val: '437.525 MHz (Amateur UHF)' },
      { label: 'OUTPUT POWER', val: '500 mW (+27 dBm)' },
      { label: 'MODULATION', val: 'AX.25 GFSK 9600 bps' },
      { label: 'BACKUP BEACON', val: 'CW Morse @ 300 bps' },
    ],
    summary: 'Dual-mode transceiver offering digital packet telemetry, SSTV image broadcasts, and M17/Codec2 speech relays for the worldwide HAM community.'
  },
  orbit: {
    title: 'AOCS // Orbital Pass Profile',
    status: 'PASS READY (9.6° INCL)',
    color: '#38bdf8',
    metrics: [
      { label: 'ALTITUDE', val: '350 km Circular LEO' },
      { label: 'ORBIT VELOCITY', val: '7.68 km/s (27,650 km/h)' },
      { label: 'PASS DURATION', val: '7 to 10 Minutes Window' },
      { label: 'PASSES / DAY', val: '15.7 Global / 4 Mumbai Pass' },
    ],
    summary: 'Low-inclination trajectory optimized for equatorial access and rapid telemetry burst downlinks over the Mumbai ground station.'
  }
};

const CORE_OBJECTIVES = [
  {
    id: 'OBJ-01',
    title: 'Autonomous In-Orbit Data Routing',
    desc: 'Edge INT8 neural engine dynamically prioritizes downlink packets based on instantaneous battery SoC and link SNR.',
    tag: 'AI ENGINE'
  },
  {
    id: 'OBJ-02',
    title: 'SomaiyaPod Deployment Handover',
    desc: 'Controlled thermal melt-wire release and calibrated spring pusher separation with verified switch telemetry.',
    tag: 'DEPLOYER'
  },
  {
    id: 'OBJ-03',
    title: 'Multi-Mode Amateur Radio Payloads',
    desc: 'Integration of Codec2 compressed speech, open M17 4FSK digital protocol, SSTV imagery, and 437 MHz TT&C beacons.',
    tag: 'AMATEUR RF'
  },
  {
    id: 'OBJ-04',
    title: 'Global HAM Community Access',
    desc: 'Decentralized citizen science enabling worldwide amateur ground stations to receive live telemetry frames.',
    tag: 'OPEN SCIENCE'
  },
  {
    id: 'OBJ-05',
    title: 'Space Qualification Survivability',
    desc: 'Comprehensive environmental qualification across EMI/EMC screening, Thermal Vacuum cycling, and launch vibration.',
    tag: 'SPACE ETL'
  }
];

export default function MissionOverview() {
  const [activeSubsystem, setActiveSubsystem] = useState('eps');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeData = SUBSYSTEM_SPECS[activeSubsystem];

  return (
    <section
      className="mission-section blueprint-grid"
      id="mission"
      style={{
        padding: '100px 32px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      <div className="chapter-tag" style={{ color: '#00f0ff', marginBottom: '16px' }}>
        01 — MISSION PROFILE & OBJECTIVES (KJS-SRS-01)
      </div>

      {/* Main Headline & Scannable Lead Narrative (<= 2 Sentences Maximum) */}
      <div style={{ maxWidth: '960px', marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            color: '#f8fafc',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}
        >
          Extreme miniaturization meets autonomous orbit intelligence.
        </h2>
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.65,
            fontWeight: 400
          }}
        >
          Operating under sub-1W power envelopes and short 7-minute LEO passes, SomaiyaSat deploys edge-AI neural routing to autonomously balance telemetry, SSTV imaging, and amateur digital voice relays without human intervention.
        </p>
      </div>

      {/* TOP INSTITUTIONAL METADATA BENTO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(11, 15, 23, 0.75)'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.1em' }}>
            USE CASE ID // SPECIFICATION
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#00f0ff', marginTop: '4px' }}>
            KJS-SRS-01
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
            AI Use Case Integration in Curriculum
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(11, 15, 23, 0.75)'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.1em' }}>
            INTERNATIONAL COLLABORATOR
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
            ReOrbit, Finland
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
            Autonomous Satellite Infrastructure Partner
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(11, 15, 23, 0.75)'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.1em' }}>
            PRIMARY BENEFICIARIES
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>
            Global Amateur Radio Community
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
            Worldwide HAM Operators &amp; Ground Stations
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(11, 15, 23, 0.75)'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.1em' }}>
            APPLICATION VERTICAL
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            Space Tech &amp; Remote Sensing
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
            KJSIT &amp; KJSSE Engineering Faculty
          </div>
        </div>
      </div>

      {/* 4 HIGH-IMPACT AEROSPACE METRIC PILLS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '56px'
        }}
      >
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          style={{
            padding: '24px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: '2px solid #00f0ff',
            backgroundColor: 'rgba(7, 9, 14, 0.85)'
          }}
        >
          <SpecIcon type="cube" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#00f0ff', fontFamily: 'var(--font-mono, monospace)' }}>5</span>
            <span style={{ fontSize: '1rem', color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>cm</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.08em' }}>
            FORM FACTOR // 2P POCKETQUBE
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '10px', lineHeight: 1.5 }}>
            Standard 2-Unit pico-satellite chassis (50 x 50 x 114 mm) with sub-500g mass.
          </p>
        </motion.div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            padding: '24px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: '2px solid #10b981',
            backgroundColor: 'rgba(7, 9, 14, 0.85)'
          }}
        >
          <SpecIcon type="battery" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono, monospace)' }}>&lt;1</span>
            <span style={{ fontSize: '1rem', color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>W</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.08em' }}>
            POWER ENVELOPE // SUB-1W AVG
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '10px', lineHeight: 1.5 }}>
            Triple-junction GaAs solar harvesting with autonomous MPPT energy optimization.
          </p>
        </motion.div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          style={{
            padding: '24px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: '2px solid #f59e0b',
            backgroundColor: 'rgba(7, 9, 14, 0.85)'
          }}
        >
          <SpecIcon type="radio" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono, monospace)' }}>437</span>
            <span style={{ fontSize: '1rem', color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>MHz</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.08em' }}>
            RF SPECTRUM // UHF AMATEUR BAND
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '10px', lineHeight: 1.5 }}>
            437.525 MHz multi-mode radio supporting M17, Codec2 voice, and SSTV image frames.
          </p>
        </motion.div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          style={{
            padding: '24px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: '2px solid #38bdf8',
            backgroundColor: 'rgba(7, 9, 14, 0.85)'
          }}
        >
          <SpecIcon type="orbit" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono, monospace)' }}>350</span>
            <span style={{ fontSize: '1rem', color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>km</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.08em' }}>
            TRAJECTORY // 9.6° INCLINATION LEO
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '10px', lineHeight: 1.5 }}>
            Low-inclination orbit offering rapid 7 to 10-minute ground passes over Mumbai.
          </p>
        </motion.div>
      </div>

      {/* 5 CORE MISSION OBJECTIVES BENTO */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#64748b', letterSpacing: '0.15em', marginBottom: '8px' }}>
          // CURRICULUM FRAMEWORK DELIVERABLES
        </div>
        <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '20px' }}>
          Five Core Operational Objectives
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          {CORE_OBJECTIVES.map((obj) => (
            <div
              key={obj.id}
              style={{
                padding: '18px 20px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(11, 15, 23, 0.65)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: '#00f0ff' }}>{obj.id}</span>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.65rem', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '2px' }}>{obj.tag}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                {obj.title}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {obj.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE SUBSYSTEM DIAGNOSTICS */}
      <div
        style={{
          padding: '32px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 9, 14, 0.85)',
          marginBottom: '56px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#00f0ff', letterSpacing: '0.15em' }}>
              // INTERACTIVE SUBSYSTEM DIAGNOSTICS
            </div>
            <h3 style={{ fontSize: '1.35rem', color: '#f8fafc', marginTop: '4px' }}>
              SomaiyaSat Onboard Hardware &amp; Payload Telemetry
            </h3>
          </div>

          {/* Subsystem Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveSubsystem('eps')}
              className={`hud-btn ${activeSubsystem === 'eps' ? 'hud-btn-active' : ''}`}
            >
              01 // EPS POWER
            </button>
            <button
              onClick={() => setActiveSubsystem('ai')}
              className={`hud-btn ${activeSubsystem === 'ai' ? 'hud-btn-active' : ''}`}
            >
              02 // EDGE-AI OBC
            </button>
            <button
              onClick={() => setActiveSubsystem('rf')}
              className={`hud-btn ${activeSubsystem === 'rf' ? 'hud-btn-active' : ''}`}
            >
              03 // UHF RF STACK
            </button>
            <button
              onClick={() => setActiveSubsystem('orbit')}
              className={`hud-btn ${activeSubsystem === 'orbit' ? 'hud-btn-active' : ''}`}
            >
              04 // ORBIT PASS
            </button>
          </div>
        </div>

        {/* Active Subsystem Panel */}
        <div
          style={{
            backgroundColor: 'rgba(4, 7, 14, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              {activeData.title}
            </div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: activeData.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="beacon-pulse" style={{ backgroundColor: activeData.color, boxShadow: `0 0 10px ${activeData.color}` }} />
              <span>STATUS: {activeData.status}</span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.6 }}>
            {activeData.summary}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            {activeData.metrics.map((m, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  padding: '12px 16px',
                  borderRadius: '4px'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.08em' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginTop: '4px' }}>
                  {m.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blueprint Schematic Section with Collapsible Technical Drawer */}
      <div
        className="eng-panel"
        style={{
          padding: 0,
          backgroundColor: '#07090e',
          overflow: 'hidden',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <details className="tech-drawer"
          style={{ width: '100%' }}
          onToggle={e => setDrawerOpen(e.currentTarget.open)}
        >
          <summary
            style={{
              cursor: 'pointer',
              padding: '24px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              userSelect: 'none',
              outline: 'none'
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#00f0ff', letterSpacing: '0.15em' }}>
                DRAWING NO. BS0-CAD-2024 // SPECIFICATIONS
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginTop: '4px' }}>
                SomaiyaSat 2P Mechanical Specifications, CAD &amp; Institutional Governance
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#64748b' }}>
                CAD UNITS: MILLIMETERS [MM]
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  color: drawerOpen ? '#10b981' : '#00f0ff',
                  padding: '6px 14px',
                  border: drawerOpen ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)'
                }}
              >
                {drawerOpen ? 'COLLAPSE SPECS ▲' : 'EXPAND / VIEW SPECS ▼'}
              </span>
            </div>
          </summary>

          <div style={{ padding: '36px 40px', overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                alignItems: 'center'
              }}
            >
              {/* Blueprint SVG Illustration */}
              <div style={{ position: 'relative', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#04060a', borderRadius: '4px' }}>
                <svg viewBox="0 0 500 400" width="100%" height="100%" style={{ overflow: 'visible' }}>
                  <defs>
                    <pattern id="cadGridNew" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="500" height="400" fill="url(#cadGridNew)" />

                  {/* 2P PocketQube Isometric Blueprint Wireframe */}
                  <polygon points="170,160 300,100 410,160 280,220" fill="none" stroke="#00f0ff" strokeWidth="2" />
                  <polygon points="170,160 280,220 280,330 170,270" fill="none" stroke="#00f0ff" strokeWidth="2" />
                  <polygon points="280,220 410,160 410,270 280,330" fill="none" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Solar Panel Plates */}
                  <polygon points="150,150 165,157 165,267 150,260" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.5" />
                  <polygon points="415,162 430,155 430,265 415,272" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.5" />

                  {/* Monopole Antenna */}
                  <line x1="280" y1="100" x2="280" y2="20" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="280" cy="20" r="4" fill="#f59e0b" />

                  {/* Dimension Lines & Text Callouts */}
                  <line x1="120" y1="160" x2="120" y2="270" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="115" y1="160" x2="125" y2="160" stroke="#64748b" strokeWidth="1" />
                  <line x1="115" y1="270" x2="125" y2="270" stroke="#64748b" strokeWidth="1" />
                  <text x="70" y="220" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">57.2 mm</text>

                  <line x1="170" y1="300" x2="280" y2="360" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="210" y="350" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">127.4 mm</text>

                  <line x1="280" y1="360" x2="410" y2="300" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="360" y="340" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">124.0 mm</text>

                  {/* Annotations */}
                  <line x1="280" y1="50" x2="350" y2="30" stroke="#f59e0b" strokeWidth="1" />
                  <text x="355" y="32" fill="#f59e0b" fontSize="11" fontFamily="JetBrains Mono">UHF MONOPOLE ANTENNA</text>

                  <line x1="220" y1="180" x2="100" y2="100" stroke="#00f0ff" strokeWidth="1" />
                  <text x="10" y="95" fill="#00f0ff" fontSize="11" fontFamily="JetBrains Mono">AI ROUTER SOC MODULE</text>

                  <line x1="330" y1="250" x2="440" y2="230" stroke="#10b981" strokeWidth="1" />
                  <text x="445" y="234" fill="#10b981" fontSize="11" fontFamily="JetBrains Mono">SUB-1W BUS POWER</text>
                </svg>
              </div>

              {/* Technical Specs List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ borderLeft: '2px solid #00f0ff', paddingLeft: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#64748b' }}>
                    PROJECT STAKEHOLDERS &amp; INSTITUTIONS
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                    KJSIT / KJSSE &amp; ReOrbit, Finland
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                    Principal Investigators: Dr. Umesh Shinde (KJSIT) &amp; Dr. Shailesh Nikam (KJSSE)
                  </div>
                </div>

                <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#64748b' }}>
                    DEPLOYMENT METHODOLOGY
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                    SomaiyaPod Container Deployer
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                    Spring-actuated orbital container with dual thermal melt-wires and separation switch confirmation.
                  </div>
                </div>

                <div style={{ borderLeft: '2px solid #f59e0b', paddingLeft: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#64748b' }}>
                    AUTONOMOUS MISSION TASK
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                    Autonomous AI Priority Queue Routing
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                    Dynamic packet prioritization: TT&amp;C housekeeping &gt; SSTV images &gt; Codec2 / M17 voice.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
