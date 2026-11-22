import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Save, X, Zap, Signal, Radio, Clock } from 'lucide-react';

export default function RuleConfigOverlay({ isOpen, onClose, currentRules, onApply }) {
  const [rules, setRules] = useState(currentRules || {
    batterySafeThreshold: 25,
    snrSstvThreshold: 75,
    snrVoiceThreshold: 40,
    beaconInterval: 30
  });

  const handleApply = () => {
    onApply(rules);
    onClose();
  };

  const fields = [
    {
      key: 'batterySafeThreshold',
      label: 'Battery Safe-Mode Threshold',
      unit: '%',
      icon: Zap,
      color: '#f59e0b',
      min: 10,
      max: 50,
      description: 'Below this level, AI router forces TT&C-only mode'
    },
    {
      key: 'snrSstvThreshold',
      label: 'SNR — SSTV Enable Threshold',
      unit: 'dB',
      icon: Signal,
      color: '#4a7c9b',
      min: 40,
      max: 100,
      description: 'Minimum SNR required before SSTV image downlink is permitted'
    },
    {
      key: 'snrVoiceThreshold',
      label: 'SNR — Voice Enable Threshold',
      unit: 'dB',
      icon: Radio,
      color: '#34d399',
      min: 15,
      max: 80,
      description: 'Minimum SNR for M17/Codec2 digital voice transmission'
    },
    {
      key: 'beaconInterval',
      label: 'TT&C Beacon Interval',
      unit: 'sec',
      icon: Clock,
      color: '#a78bfa',
      min: 10,
      max: 120,
      description: 'Telemetry beacon transmission interval during nominal operations'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className="overlay-panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className="overlay-close-btn" onClick={onClose}>✕</button>

          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(74, 124, 155, 0.15)',
                border: '1px solid rgba(74, 124, 155, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a7c9b'
              }}>
                <SlidersHorizontal size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
                  AI Router Priority Rules
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  OVERLAY EDIT — CONFIGURE DECISION THRESHOLDS
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Modify the onboard AI router's decision thresholds. Changes will immediately affect the simulated routing behaviour on this dashboard.
            </p>
          </div>

          {/* Rule Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '1.5rem' }}>
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#05070f',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon size={15} color={field.color} />
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#cbd5e1' }}>
                      {field.label}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: field.color
                    }}>
                      {rules[field.key]} {field.unit}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={rules[field.key]}
                    onChange={(e) => setRules(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: field.color }}
                  />

                  <div style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    marginTop: '6px',
                    fontStyle: 'italic'
                  }}>
                    {field.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <X size={15} /> Cancel
            </button>
            <button
              onClick={handleApply}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#00f0ff',
                color: '#04060a',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(74, 124, 155, 0.35)'
              }}
            >
              <Save size={15} /> Apply Rules
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
