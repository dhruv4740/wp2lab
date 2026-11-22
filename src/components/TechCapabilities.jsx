import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Radio,
  Share2,
  HardDrive,
  Layers,
  ArrowRight,
  X,
  Activity,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react';

const PIPELINE_NODES = [
  {
    id: 'sensors',
    title: 'Sensor Bus & EPS',
    role: 'Telemetry Ingestion',
    icon: HardDrive,
    color: '#00e5ff',
    x: 60,
    y: 200,
    desc: 'Continuously monitors battery state-of-charge, bus voltages, temperatures, and 3-axis magnetometers.',
    specs: {
      SamplingRate: '10 Hz Housekeeping',
      Sensors: 'INA219, BMP280, MPU6050',
      BusProtocol: 'I2C / SPI Fault-Tolerant',
    },
    route: '/telemetry',
    routeLabel: 'Open Live Telemetry',
  },
  {
    id: 'ai-router',
    title: 'Autonomous AI Router',
    role: 'Decision Engine',
    icon: Cpu,
    color: '#10b981',
    x: 230,
    y: 100,
    desc: 'Autonomous inference engine scoring payload priorities against real-time link budgets and battery reserve.',
    specs: {
      Model: 'Dynamic Heuristic + Decision Forest',
      PowerBudget: '< 45 mW Inference Mode',
      Prioritization: 'Health > Telecommand > SSTV',
    },
    route: '/telemetry',
    routeLabel: 'Inspect AI Scheduler',
  },
  {
    id: 'soc',
    title: 'Core SoC & Buffer',
    role: 'Buffer Storage',
    icon: Zap,
    color: '#a855f7',
    x: 230,
    y: 300,
    desc: 'Radiation-hardened FRAM non-volatile memory storing telemetry queues across out-of-pass orbits.',
    specs: {
      Capacity: '2 MB Non-Volatile Ring Buffer',
      DataIntegrity: 'Reed-Solomon + CRC16',
      Retention: '> 10 Years In Orbit',
    },
    route: '/gateway',
    routeLabel: 'View Buffer Gateway',
  },
  {
    id: 'radio',
    title: 'Multi-Mode Transceiver',
    role: 'Amateur RF Modulation',
    icon: Radio,
    color: '#f59e0b',
    x: 420,
    y: 200,
    desc: 'Versatile VHF/UHF transmitter broadcasting digital voice, analog SSTV imagery, and AX.25 packets to HAMs.',
    specs: {
      Frequency: '437.500 MHz UHF',
      Protocols: 'AX.25 APRS, Codec2, M17, Robot36 SSTV',
      PowerOutput: '500 mW Peak EIRP',
    },
    route: '/uplink',
    routeLabel: 'Ground Uplink Console',
  },
  {
    id: 'ground',
    title: 'Ground Support Station',
    role: 'Packet Demodulation',
    icon: Share2,
    color: '#38bdf8',
    x: 610,
    y: 200,
    desc: 'Automated ground receiver network capturing orbital passes and synchronizing telecommand queues globally.',
    specs: {
      Antenna: 'Cross-Yagi Dual Polarized',
      Receiver: 'SDR Automatic Tracking',
      Latency: '< 80 ms Local Demod',
    },
    route: '/gateway',
    routeLabel: 'Ground Support Terminal',
  },
];

export default function TechCapabilities() {
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    };
    if (selectedNode) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  return (
    <section
      id="capabilities"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        backgroundColor: '#04060a',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '3rem' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#00e5ff',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            CHAPTER 02 // TECHNICAL ARCHITECTURE
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f0f2f5', marginBottom: '1rem' }}>
            AUTONOMOUS PIPELINE & RF SYSTEM SCHEMATIC
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '820px', lineHeight: 1.6 }}>
            Explore how data flows through SomaiyaSat from raw sensor acquisition to autonomous AI packet scheduling and multi-mode amateur radio transmission. Click any schematic node below to inspect hardware specs and protocol parameters.
          </p>
        </motion.div>

        <div
          className="glass-panel"
          style={{
            position: 'relative',
            padding: '2rem 1.5rem',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '16px',
            backgroundColor: '#080c16',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span className="pulse-beacon" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00e5ff', display: 'inline-block' }} />
              <span>LIVE SIGNAL FLOW SIMULATION &bull; CLICK NODE TO INSPECT</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>
              UHF 437.5 MHz // AX.25 / M17 / SSTV
            </span>
          </div>

          <div style={{ width: '100%', overflow: 'hidden' }}>
            <svg
              viewBox="0 0 740 400"
              width="100%"
              preserveAspectRatio="xMidYMid meet"
              style={{ display: 'block', maxHeight: '420px', margin: '0 auto' }}
            >
              <defs>
                <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="amberLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="groundLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <path
                d="M 120 180 C 160 140, 180 120, 200 110"
                fill="none"
                stroke="url(#cyanLineGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                style={{ animation: 'dataFlow 3s linear infinite' }}
              />

              <path
                d="M 120 220 C 160 260, 180 280, 200 290"
                fill="none"
                stroke="url(#cyanLineGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                style={{ animation: 'dataFlow 3s linear infinite' }}
              />

              <path
                d="M 280 110 C 330 120, 360 160, 390 180"
                fill="none"
                stroke="url(#amberLineGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                style={{ animation: 'dataFlow 3s linear infinite' }}
              />

              <path
                d="M 280 290 C 330 280, 360 240, 390 220"
                fill="none"
                stroke="url(#amberLineGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                style={{ animation: 'dataFlow 3s linear infinite' }}
              />

              <path
                d="M 470 200 L 560 200"
                fill="none"
                stroke="url(#groundLineGrad)"
                strokeWidth="3"
                strokeDasharray="8 4"
                style={{ animation: 'dataFlow 2s linear infinite' }}
              />

              {PIPELINE_NODES.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 38 : 32}
                      fill={node.color}
                      fillOpacity={isSelected ? 0.25 : 0.1}
                      stroke={node.color}
                      strokeWidth={isSelected ? 2 : 1}
                      filter="url(#glowFilter)"
                    />

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="24"
                      fill="#0e1322"
                      stroke={node.color}
                      strokeWidth="2"
                    />

                    <text
                      x={node.x}
                      y={node.y + 44}
                      textAnchor="middle"
                      fill="#f0f2f5"
                      fontFamily="Space Grotesk, sans-serif"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {node.title}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 58}
                      textAnchor="middle"
                      fill={node.color}
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="9"
                      letterSpacing="0.05em"
                    >
                      {node.role}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <Terminal size={18} color="#00e5ff" />
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#00e5ff' }}>
                AX.25 PACKET APRS
              </h4>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Standard 1200 baud Bell 202 AFSK transmitting real-time orbital housekeeping and battery metrics worldwide.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <Radio size={18} color="#f59e0b" />
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f59e0b' }}>
                M17 DIGITAL VOICE & DATA
              </h4>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Next-generation open-source 4FSK digital protocol with Codec2 low-bitrate compression for ultra-efficient voice telemetry.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <Layers size={18} color="#10b981" />
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#10b981' }}>
                ROBOT36 SSTV TRANSMISSION
              </h4>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Analog slow-scan television broadcasting earth observation snapshots directly decodable by amateur radio operators.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <Cpu size={18} color="#a855f7" />
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#a855f7' }}>
                AUTONOMOUS AI SCHEDULING
              </h4>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Dynamic link-budget optimization arbitrating between digital voice, scientific data, and housekeeping queues.
            </p>
          </div>
        </div>

        <AnimatePresence>
          {selectedNode && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(4, 6, 10, 0.82)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedNode(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel"
                style={{
                  maxWidth: '520px',
                  width: '100%',
                  backgroundColor: '#0a0e18',
                  border: '1px solid ' + selectedNode.color,
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: selectedNode.color,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedNode.role}
                    </span>
                    <h3 style={{ fontSize: '1.5rem', color: '#f0f2f5', marginTop: '0.2rem' }}>
                      {selectedNode.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.25rem',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {selectedNode.desc}
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(6, 8, 16, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    ENGINEERING PARAMETERS
                  </div>
                  {Object.entries(selectedNode.specs).map(([key, val]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.35rem 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span style={{ color: '#94a3b8' }}>{key}</span>
                      <span style={{ color: '#f0f2f5', fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link
                    to={selectedNode.route}
                    onClick={() => setSelectedNode(null)}
                    style={{
                      flex: 1,
                      padding: '0.85rem',
                      backgroundColor: selectedNode.color,
                      color: '#04060a',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{selectedNode.routeLabel}</span>
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    style={{
                      padding: '0.85rem 1.25rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#94a3b8',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    CLOSE [ESC]
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
