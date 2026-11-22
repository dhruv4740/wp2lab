import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NODES = [
  {
    id: 'deployer',
    title: 'SomaiyaPod Deployer',
    sub: 'Mechanical Ejection Pod',
    x: 60,
    y: 200,
    detail: 'Launcher container pod engineered to hold 2P PocketQube and send microswitch ejection signal.'
  },
  {
    id: 'bus',
    title: 'Power & Telemetry Bus',
    sub: 'Sub-1W Solar / Battery',
    x: 230,
    y: 100,
    detail: '3.8V Li-ion battery and solar array monitoring board supplying regulated power to mission payloads.'
  },
  {
    id: 'soc',
    title: 'AI Scheduler Engine',
    sub: 'Low-Power SoC Kernel',
    x: 230,
    y: 300,
    detail: 'Central microcontroller running real-time queue prioritization algorithms based on battery & SNR telemetry.'
  },
  {
    id: 'payloads',
    title: 'Multi-Mode RF Payloads',
    sub: 'UHF/VHF Transmitter',
    x: 420,
    y: 200,
    detail: 'Multi-protocol radio module executing TT&C, SSTV images, and Codec2/M17 HAM voice modulation.'
  },
  {
    id: 'ground',
    title: 'Ground Pass Network',
    sub: 'KJSIT & HAM Operators',
    x: 610,
    y: 200,
    detail: 'Ground station antennas acquiring 437 MHz / 145.980 MHz signals during orbital line-of-sight passes.'
  }
];

const LIFECYCLE_STAGES = [
  { code: 'STAGE A', name: 'Requirements & Link Analysis', desc: 'GMAT / STK orbital trajectory modeling and link budget calculation under sub-1W constraints.' },
  { code: 'STAGE B', name: 'AI Model Design & Training', desc: 'Synthetic telemetry dataset generation and INT8 decision tree training for heuristic queueing.' },
  { code: 'STAGE C', name: 'Parallel Payload & Pod Dev', desc: 'Simultaneous fabrication of SomaiyaPod spring deployer and multi-mode radio transmitter stacks.' },
  { code: 'STAGE D', name: 'AI Deployment & HIL Simulation', desc: 'Hardware-in-the-Loop test bench execution with real microcontroller and synthetic RF fading.' },
  { code: 'STAGE E', name: 'Ground Station Software', desc: 'Automated Doppler-tracking demodulation software deployed at KJSIT Mumbai station.' },
  { code: 'STAGE F', name: 'ETL Space Qualification', desc: 'Full environmental qualification: EMI/EMC shielding, Thermal-Vacuum cycling, and vibration.' }
];

export default function SystemSchematic() {
  const [hoveredNode, setHoveredNode] = useState(NODES[2]); // Default AI SoC
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section
      className="mission-section"
      id="architecture"
      style={{
        padding: '100px 32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      <div className="chapter-tag" style={{ color: '#00f0ff', marginBottom: '16px' }}>
        05 — SYSTEM ARCHITECTURE &amp; LIFECYCLE
      </div>

      <div style={{ maxWidth: '960px', marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            marginBottom: '20px'
          }}
        >
          Integrated hardware architecture and 6-stage lifecycle.
        </h2>
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.65,
            fontWeight: 400
          }}
        >
          Observe real-time telemetry and data packet flows moving through the satellite hardware pipeline. Hover over any node to inspect subsystem parameters.
        </p>
      </div>

      {/* Schematic Container Panel */}
      <div
        className="eng-panel"
        style={{
          padding: '36px',
          backgroundColor: '#07090f',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#00f0ff', letterSpacing: '0.15em' }}>
            SCHEMATIC // SOMAIYASAT-BUS-V2
          </div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="beacon-pulse" style={{ backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span>STATUS: PIPELINE ACTIVE [DATA FLOWING]</span>
          </div>
        </div>

        {/* SVG Interactive Architecture Graph */}
        <div style={{ position: 'relative', width: '100%', minHeight: '380px', overflow: 'hidden' }}>
          <svg viewBox="0 0 740 400" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connecting Engineering Lines */}
            {/* Deployer to Bus & SoC */}
            <path d="M 120 200 L 170 200 L 170 100 L 230 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 120 200 L 170 200 L 170 300 L 230 300" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Bus to SoC */}
            <line x1="230" y1="130" x2="230" y2="270" stroke="#10b981" strokeWidth="1.5" />

            {/* SoC & Bus to Payloads */}
            <path d="M 290 100 L 350 100 L 350 200 L 420 200" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <path d="M 290 300 L 350 300 L 350 200 L 420 200" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* Payloads to Ground */}
            <line x1="480" y1="200" x2="610" y2="200" stroke="#f59e0b" strokeWidth="2" />

            {/* Sequential Animated Data Packets Flowing Along Pipeline */}
            {/* Packet 1: Power bus telemetry to AI Scheduler SoC */}
            <motion.circle
              r="4"
              fill="#10b981"
              animate={{
                cx: [230, 230],
                cy: [130, 270],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1
              }}
            />

            {/* Packet 2: AI Scheduler decisions to RF Payloads */}
            <motion.circle
              r="4"
              fill="#00f0ff"
              animate={{
                cx: [290, 350, 350, 420],
                cy: [300, 300, 200, 200],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.8
              }}
            />

            {/* Packet 3: RF Downlink to Ground Pass Network */}
            <motion.circle
              r="4"
              fill="#f59e0b"
              animate={{
                cx: [480, 610],
                cy: [200, 200],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'linear',
                delay: 1.6
              }}
            />

            {/* Interactive Hardware Nodes */}
            {NODES.map((node) => {
              const isHovered = hoveredNode.id === node.id;
              const nodeColor = node.id === 'soc' ? '#00f0ff' : node.id === 'bus' ? '#10b981' : node.id === 'payloads' ? '#f59e0b' : node.id === 'deployer' ? '#818cf8' : '#38bdf8';
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r={isHovered ? 28 : 24}
                    fill="#04060a"
                    stroke={isHovered ? nodeColor : 'rgba(255, 255, 255, 0.15)'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <circle
                    r={6}
                    fill={nodeColor}
                  />
                  <text
                    y={38}
                    textAnchor="middle"
                    fill={isHovered ? '#ffffff' : '#f8fafc'}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.title}
                  </text>
                  <text
                    y={52}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hovered Node Telemetry Callout */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px 20px',
            backgroundColor: 'rgba(4, 6, 10, 0.7)',
            borderRadius: '4px',
            borderLeft: '3px solid #00f0ff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: '#00f0ff' }}>
              SELECTED NODE: {hoveredNode.title.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              {hoveredNode.detail}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#64748b' }}>
            NODE ID: {hoveredNode.id.toUpperCase()} // LATENCY: 2.1ms
          </div>
        </div>
      </div>

      {/* 6-STAGE CURRICULUM LIFECYCLE TABS */}
      <div
        style={{
          padding: '28px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 9, 14, 0.85)'
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#818cf8', letterSpacing: '0.12em', marginBottom: '8px' }}>
          // HIGH-LEVEL WORKFLOW &amp; CURRICULUM LIFECYCLE (PART A.11)
        </div>
        <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '20px' }}>
          6-Stage Engineering &amp; Qualification Pipeline
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          {LIFECYCLE_STAGES.map((stg, i) => (
            <button
              key={stg.code}
              onClick={() => setActiveStage(i)}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                padding: '8px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
                textAlign: 'left',
                border: activeStage === i ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.08)',
                backgroundColor: activeStage === i ? 'rgba(129, 140, 248, 0.12)' : 'rgba(4, 6, 10, 0.6)',
                color: activeStage === i ? '#818cf8' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 700 }}>{stg.code}</div>
              <div style={{ fontSize: '0.65rem', color: activeStage === i ? '#f8fafc' : '#64748b', marginTop: '2px' }}>{stg.name}</div>
            </button>
          ))}
        </div>

        <div
          style={{
            padding: '16px 20px',
            borderRadius: '4px',
            backgroundColor: 'rgba(4, 6, 10, 0.7)',
            borderLeft: '3px solid #818cf8'
          }}
        >
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
            {LIFECYCLE_STAGES[activeStage].code}: {LIFECYCLE_STAGES[activeStage].name}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.6 }}>
            {LIFECYCLE_STAGES[activeStage].desc}
          </div>
        </div>
      </div>
    </section>
  );
}
