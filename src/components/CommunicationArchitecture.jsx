import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTelemetryChirp } from '../utils/audio';

const COMMS_MODULES = [
  {
    id: 'ttc',
    code: 'MOD-01',
    name: 'TT&C Telemetry Beacon',
    subtitle: 'Telemetry, Tracking & Command',
    bandwidth: '300-1200 BPS',
    freq: '437.000 MHz (UHF)',
    priority: 'PRIORITY 1 (FAILSAFE)',
    modulation: 'AX.25 / APRS AFSK',
    description: 'Always-active beacon transmitting battery voltage (3.8V), solar current, SoC temperature (24°C), and satellite health every 30 seconds.',
    details: [
      'Frequency: 437.000 MHz Downlink',
      'Protocol: APRS AX.25 Standard UI Frames',
      'Power Output: 100 mW EIRP',
      'Fallback: Mandatory activation when battery < 35%'
    ],
    waveformColor: '#10b981'
  },
  {
    id: 'codec2',
    code: 'MOD-02',
    name: 'Codec2 Voice Codec',
    subtitle: 'Low-Bitrate Speech Engine',
    bandwidth: '700-3200 BPS',
    freq: '145.980 MHz (VHF)',
    priority: 'PRIORITY 3 (DIGITAL VOICE)',
    modulation: 'Open Codec2 Compressed Audio',
    description: 'Ultra low-bitrate open speech compression standard, allowing high-clarity HAM digital voice transmission through narrow RF channels.',
    details: [
      'Voice Bitrate: 1300 / 700 bps modes',
      'Channel Bandwidth: < 2.4 kHz',
      'Target: Worldwide Amateur Radio operators',
      'Integration: Runs directly on onboard SoC'
    ],
    waveformColor: '#f59e0b'
  },
  {
    id: 'm17',
    code: 'MOD-03',
    name: 'M17 Digital Protocol',
    subtitle: 'Open RF Communication Standard',
    bandwidth: '4800 BPS',
    freq: '437.000 MHz / 145.980 MHz',
    priority: 'PRIORITY 3 (DIGITAL DATA)',
    modulation: '4FSK / Convolutional FEC',
    description: 'Next-generation open-source digital radio protocol featuring stream framing, forward error correction (FEC), and callsign routing.',
    details: [
      'Data Rate: 4800 bps total (2400 bps voice + FEC)',
      'Modulation: 4FSK with Root-Raised Cosine filter',
      'Access Code: 67.0 Hz CTCSS / M17 Sync Word',
      'Purpose: Inter-satellite and ground station relays'
    ],
    waveformColor: '#00f0ff'
  },
  {
    id: 'sstv',
    code: 'MOD-04',
    name: 'SSTV Image Transmission',
    subtitle: 'Slow Scan Television Downlink',
    bandwidth: '12.5 KHz MAX',
    freq: '145.980 MHz Downlink',
    priority: 'PRIORITY 2 (HIGH-BANDWIDTH)',
    modulation: 'Robot36 / SSDV Digital Frames',
    description: 'Downlinks high-resolution Earth observation snapshots and orbital telemetry graphics taken during peak Low Earth Orbit passes.',
    details: [
      'Image Format: Robot36 & SSDV (Slow Scan Digital Video)',
      'Resolution: 320 x 240 / 640 x 480 RGB',
      'Trigger Condition: SNR > 75 dB & Battery > 50%',
      'Downlink Duration: 36 seconds per frame'
    ],
    waveformColor: '#818cf8'
  }
];

export default function CommunicationArchitecture() {
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedModule(null);
      }
    };
    if (selectedModule) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedModule]);

  return (
    <section
      className="mission-section"
      id="comms"
      style={{
        padding: '100px 32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      <div className="chapter-tag" style={{ color: '#f59e0b', marginBottom: '16px' }}>
        04 — MULTI-MODE AMATEUR RADIO PAYLOADS
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
          Four specialized amateur radio payloads in orbit.
        </h2>
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.65,
            fontWeight: 400
          }}
        >
          Designed as self-contained engineering subsystems rather than generic feature cards, each module operates under strict spectral and power efficiency protocols.
        </p>
      </div>

      {/* Modules Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}
      >
        {COMMS_MODULES.map((mod) => (
          <div
            key={mod.id}
            onClick={() => {
              setSelectedModule(mod);
              playTelemetryChirp();
            }}
            style={{
              cursor: 'pointer',
              padding: '28px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: `2px solid ${mod.waveformColor}`,
              backgroundColor: 'rgba(7, 9, 14, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = mod.waveformColor;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderTop = `2px solid ${mod.waveformColor}`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: mod.waveformColor, fontWeight: 700 }}>
                  {mod.code}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)'
                  }}
                >
                  {mod.bandwidth}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '4px' }}>
                {mod.name}
              </h3>
              <div style={{ fontSize: '0.82rem', color: mod.waveformColor, marginBottom: '16px', opacity: 0.9 }}>
                {mod.subtitle}
              </div>

              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
                {mod.description}
              </p>
            </div>

            <div>
              {/* Waveform Visualization SVG */}
              <div
                style={{
                  height: '44px',
                  backgroundColor: '#04060a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <svg width="100%" height="30" viewBox="0 0 300 30" preserveAspectRatio="xMidYMid meet">
                  <path
                    d={
                      mod.id === 'ttc'
                        ? 'M 0 15 Q 15 0 30 15 T 60 15 T 90 15 T 120 15 T 150 15 T 180 15 T 210 15 T 240 15 T 270 15 T 300 15'
                        : mod.id === 'codec2'
                        ? 'M 0 15 Q 7 5 15 15 T 30 15 T 45 15 T 60 15 T 75 15 T 90 15 T 105 15 T 120 15 T 135 15 T 150 15 T 165 15 T 180 15 T 195 15 T 210 15 T 225 15 T 240 15 T 255 15 T 270 15 T 285 15 T 300 15'
                        : mod.id === 'm17'
                        ? 'M 0 15 L 20 5 L 40 25 L 60 5 L 80 25 L 100 5 L 120 25 L 140 5 L 160 25 L 180 5 L 200 25 L 220 5 L 240 25 L 260 5 L 280 25 L 300 15'
                        : 'M 0 15 L 10 2 L 10 28 L 20 15 L 30 2 L 30 28 L 40 15 L 50 2 L 50 28 L 60 15 L 70 2 L 70 28 L 80 15 L 90 2 L 90 28 L 100 15 L 110 2 L 110 28 L 120 15 L 130 2 L 130 28 L 140 15 T 300 15'
                    }
                    fill="none"
                    stroke={mod.waveformColor}
                    strokeWidth="1.8"
                  />
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#64748b' }}>
                  {mod.freq}
                </span>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: mod.waveformColor, fontWeight: 700 }}>
                  INSPECT SPEC →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Module Inspector Modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModule(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(4, 6, 10, 0.92)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '620px',
                width: '100%',
                backgroundColor: '#07090e',
                padding: '40px',
                borderRadius: '4px',
                border: `1px solid ${selectedModule.waveformColor}`,
                boxShadow: `0 0 30px rgba(0, 0, 0, 0.8)`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: selectedModule.waveformColor, letterSpacing: '0.1em' }}>
                  SPECIFICATION DATASHEET // {selectedModule.code}
                </span>
                <button
                  onClick={() => setSelectedModule(null)}
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f8fafc',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    borderRadius: '2px'
                  }}
                >
                  CLOSE [ESC]
                </button>
              </div>

              <h3 style={{ fontSize: '1.75rem', color: '#f8fafc', marginBottom: '4px' }}>
                {selectedModule.name}
              </h3>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '24px' }}>
                MODULATION: {selectedModule.modulation}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {selectedModule.details.map((detail, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.82rem',
                      color: '#e2e8f0',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(4, 6, 10, 0.6)',
                      borderRadius: '4px',
                      borderLeft: `2px solid ${selectedModule.waveformColor}`
                    }}
                  >
                    {detail}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {selectedModule.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
