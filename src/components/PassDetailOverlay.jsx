import React, { useState } from 'react';
import Overlay from './Overlay';
import { Signal, Thermometer, Navigation, Radio, TrendingUp } from 'lucide-react';

const mono = { fontFamily: 'JetBrains Mono, monospace' };
const tile = { borderRadius: '8px', backgroundColor: '#05070f', border: '1px solid rgba(255, 255, 255, 0.06)' };

// Simulated telemetry for one pass; called once per opened overlay.
function makeTelemetry() {
  return {
    maxElevation: `${Math.floor(Math.random() * 60 + 20)}°`,
    dopplerShift: `${(Math.random() * 8 - 4).toFixed(2)} kHz`,
    linkMargin: `${(Math.random() * 12 + 3).toFixed(1)} dB`,
    rssi: `${Math.floor(Math.random() * 30 - 110)} dBm`,
    temperature: `${Math.floor(Math.random() * 20 + 15)}°C`,
    packetLoss: `${(Math.random() * 8).toFixed(1)}%`,
    // 20 SVG points that rise and fall like a satellite crossing the sky
    elevationPoints: Array.from({ length: 20 }, (_, i) => `${i * 25},${100 - Math.sin((i / 19) * Math.PI) * (40 + Math.random() * 25)}`).join(' '),
  };
}

export default function PassDetailOverlay({ pass, onClose }) {
  // useState with an initializer: generate the random values once, not on every render
  const [t] = useState(makeTelemetry);
  const [aos, los] = pass.window.split('–').map((s) => s.trim());

  const metrics = [
    { label: 'Max Elevation', value: t.maxElevation, icon: TrendingUp, color: '#34d399' },
    { label: 'Doppler Shift', value: t.dopplerShift, icon: Radio, color: '#38bdf8' },
    { label: 'Link Margin', value: t.linkMargin, icon: Signal, color: '#4a7c9b' },
    { label: 'RSSI', value: t.rssi, icon: Signal, color: '#a78bfa' },
    { label: 'Board Temp', value: t.temperature, icon: Thermometer, color: '#f59e0b' },
    { label: 'Packet Loss', value: t.packetLoss, icon: Navigation, color: '#f87171' },
  ];

  const windowInfo = [
    ['AOS', aos, '#34d399'],
    ['LOS', los, '#f87171'],
    ['STATION', pass.station, '#f8fafc'],
    ['DATA', pass.bytes, '#f8fafc'],
  ];

  return (
    <Overlay onClose={onClose} maxWidth={620}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ ...mono, fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8' }}>{pass.id}</span>
          <span style={{ ...mono, padding: '2px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', backgroundColor: 'rgba(74, 124, 155, 0.15)', color: '#4a7c9b', border: '1px solid rgba(74, 124, 155, 0.3)' }}>
            {pass.mode}
          </span>
        </div>
        <div style={{ ...mono, fontSize: '0.72rem', color: '#64748b' }}>DETAIL OVERLAY — GROUND PASS TELEMETRY</div>
      </div>

      <div style={{ ...tile, display: 'flex', gap: '20px', padding: '12px 16px', marginBottom: '16px' }}>
        {windowInfo.map(([label, value, color], i) => (
          <React.Fragment key={label}>
            {i > 0 && <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />}
            <div>
              <div style={{ ...mono, fontSize: '0.68rem', color: '#64748b' }}>{label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color }}>{value}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div style={{ ...tile, padding: '16px', marginBottom: '16px' }}>
        <div style={{ ...mono, fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.1em', marginBottom: '8px' }}>ELEVATION PROFILE</div>
        <svg viewBox="0 0 480 120" width="100%" height="80" style={{ overflow: 'visible' }}>
          {[0, 25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.05)" />
          ))}
          <polygon points={`0,100 ${t.elevationPoints} 475,100`} fill="rgba(74, 124, 155, 0.2)" />
          <polyline points={t.elevationPoints} fill="none" stroke="#4a7c9b" strokeWidth="2" />
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ ...tile, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Icon size={12} color={color} />
              <span style={{ ...mono, fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <div style={{ ...mono, fontSize: '1rem', fontWeight: '700', color }}>{value}</div>
          </div>
        ))}
      </div>
    </Overlay>
  );
}
