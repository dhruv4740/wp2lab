import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Signal, Thermometer, Navigation, Clock, Radio, TrendingUp } from 'lucide-react';

export default function PassDetailOverlay({ isOpen, onClose, pass }) {
  if (!isOpen || !pass) return null;

  // Generate simulated telemetry for the pass
  const telemetry = {
    maxElevation: `${Math.floor(Math.random() * 60 + 20)}°`,
    dopplerShift: `${(Math.random() * 8 - 4).toFixed(2)} kHz`,
    linkMargin: `${(Math.random() * 12 + 3).toFixed(1)} dB`,
    aosTime: pass.window?.split('–')[0]?.trim() || 'N/A',
    losTime: pass.window?.split('–')[1]?.trim() || 'N/A',
    temperature: `${Math.floor(Math.random() * 20 + 15)}°C`,
    rssi: `${Math.floor(Math.random() * 30 - 110)} dBm`,
    packetLoss: `${(Math.random() * 8).toFixed(1)}%`
  };

  const metricItems = [
    { label: 'Max Elevation', value: telemetry.maxElevation, icon: TrendingUp, color: '#34d399' },
    { label: 'Doppler Shift', value: telemetry.dopplerShift, icon: Radio, color: '#38bdf8' },
    { label: 'Link Margin', value: telemetry.linkMargin, icon: Signal, color: '#4a7c9b' },
    { label: 'RSSI', value: telemetry.rssi, icon: Signal, color: '#a78bfa' },
    { label: 'Board Temp', value: telemetry.temperature, icon: Thermometer, color: '#f59e0b' },
    { label: 'Packet Loss', value: telemetry.packetLoss, icon: Navigation, color: '#f87171' },
  ];

  // Generate SVG elevation profile
  const elevationPoints = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const elevation = Math.sin(t * Math.PI) * (40 + Math.random() * 25);
    return `${i * 25},${100 - elevation}`;
  }).join(' ');

  return (
    <AnimatePresence>
      <motion.div
        className="overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="overlay-panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '620px' }}
        >
          <button className="overlay-close-btn" onClick={onClose}>✕</button>

          {/* Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#38bdf8'
              }}>
                {pass.id}
              </span>
              <span style={{
                padding: '2px 10px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: '700',
                fontFamily: 'JetBrains Mono, monospace',
                backgroundColor: 'rgba(74, 124, 155, 0.15)',
                color: '#4a7c9b',
                border: '1px solid rgba(74, 124, 155, 0.3)'
              }}>
                {pass.mode}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
              DETAIL OVERLAY — GROUND PASS TELEMETRY
            </div>
          </div>

          {/* Pass Window */}
          <div style={{
            display: 'flex',
            gap: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: '#05070f',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>AOS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#34d399' }}>{telemetry.aosTime}</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>LOS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f87171' }}>{telemetry.losTime}</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>STATION</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc' }}>{pass.station}</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>DATA</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc' }}>{pass.bytes}</div>
            </div>
          </div>

          {/* Elevation Profile SVG */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#05070f',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '0.68rem',
              color: '#64748b',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}>
              ELEVATION PROFILE
            </div>
            <svg viewBox="0 0 480 120" width="100%" height="80" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a7c9b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4a7c9b" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              {/* Fill area */}
              <polygon
                points={`0,100 ${elevationPoints} 475,100`}
                fill="url(#elevGrad)"
              />
              {/* Line */}
              <polyline
                points={elevationPoints}
                fill="none"
                stroke="#4a7c9b"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Telemetry Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px'
          }}>
            {metricItems.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#05070f',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <Icon size={12} color={metric.color} />
                    <span style={{
                      fontSize: '0.65rem',
                      color: '#64748b',
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: '0.05em'
                    }}>
                      {metric.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: metric.color,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {metric.value}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
