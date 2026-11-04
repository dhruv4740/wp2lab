import React, { useState } from 'react';
import Overlay from './Overlay';
import { SlidersHorizontal, Save, X, Zap, Signal, Radio, Clock } from 'lucide-react';

const mono = { fontFamily: 'JetBrains Mono, monospace' };

const FIELDS = [
  { key: 'batterySafeThreshold', label: 'Battery Safe-Mode Threshold', unit: '%', icon: Zap, color: '#f59e0b', min: 10, max: 50, description: 'Below this level, AI router forces TT&C-only mode' },
  { key: 'snrSstvThreshold', label: 'SNR — SSTV Enable Threshold', unit: 'dB', icon: Signal, color: '#4a7c9b', min: 40, max: 100, description: 'Minimum SNR required before SSTV image downlink is permitted' },
  { key: 'snrVoiceThreshold', label: 'SNR — Voice Enable Threshold', unit: 'dB', icon: Radio, color: '#34d399', min: 15, max: 80, description: 'Minimum SNR for M17/Codec2 digital voice transmission' },
  { key: 'beaconInterval', label: 'TT&C Beacon Interval', unit: 'sec', icon: Clock, color: '#a78bfa', min: 10, max: 120, description: 'Telemetry beacon transmission interval during nominal operations' },
];

const buttonBase = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 22px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' };

export default function RuleConfigOverlay({ aiRules, setAiRules, onClose }) {
  // useState: a draft copy, so the sliders only change the real rules when "Apply" is pressed
  const [draft, setDraft] = useState(aiRules);

  const apply = () => {
    setAiRules(draft);
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(74, 124, 155, 0.15)', border: '1px solid rgba(74, 124, 155, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a7c9b' }}>
            <SlidersHorizontal size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>AI Router Priority Rules</h3>
            <div style={{ ...mono, fontSize: '0.72rem', color: '#64748b' }}>OVERLAY EDIT — CONFIGURE DECISION THRESHOLDS</div>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
          Modify the onboard AI router's decision thresholds. Changes will immediately affect the simulated routing behaviour on this dashboard.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '1.5rem' }}>
        {FIELDS.map(({ key, label, unit, icon: Icon, color, min, max, description }) => (
          <div key={key} style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#05070f', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Icon size={15} color={color} />
              <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#cbd5e1' }}>{label}</span>
              <span style={{ ...mono, marginLeft: 'auto', fontSize: '0.9rem', fontWeight: '700', color }}>{draft[key]} {unit}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: Number(e.target.value) })}
              style={{ width: '100%', accentColor: color }}
            />
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>{description}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ ...buttonBase, border: '1px solid rgba(255, 255, 255, 0.12)', backgroundColor: 'transparent', color: '#94a3b8', fontWeight: '600' }}>
          <X size={15} /> Cancel
        </button>
        <button onClick={apply} style={{ ...buttonBase, border: 'none', backgroundColor: '#00f0ff', color: '#04060a' }}>
          <Save size={15} /> Apply Rules
        </button>
      </div>
    </Overlay>
  );
}
