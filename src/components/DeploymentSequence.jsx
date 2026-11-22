import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTelemetryChirp } from '../utils/audio';

const DEPLOYMENT_STEPS = [
  {
    id: 1,
    time: 'T-00:00:00',
    title: 'PSLV-C58 Orbital Launch',
    subtitle: 'ISRO PS4 Platform Insertion',
    detail: 'Lift-off from Sriharikota. Upper stage POEM platform reaches target 350 km orbit at 9.6° inclination angle.',
    status: 'COMPLETED',
    icon: '🚀'
  },
  {
    id: 2,
    time: 'T+00:15:20',
    title: 'SomaiyaPod Door Release',
    subtitle: 'Mechanical Latch Ejection Signal',
    detail: 'Primary command signal fires thermal melt-wire. SomaiyaPod door swings open, confirming ejection mechanism readiness.',
    status: 'COMPLETED',
    icon: '⚡'
  },
  {
    id: 3,
    time: 'T+00:15:24',
    title: 'PocketQube Separation',
    subtitle: 'Spring Deployer Ejection',
    detail: 'Internal deployment spring ejects 2P SomaiyaSat at 1.2 m/s relative velocity into free orbit.',
    status: 'COMPLETED',
    icon: '🛰️'
  },
  {
    id: 4,
    time: 'T+00:16:00',
    title: 'Solar Panel & Antenna Deploy',
    subtitle: 'Structural Kinematics',
    detail: 'Spring-hinged solar panels extend. UHF monopole antenna deploys to enable RF transmission channel.',
    status: 'COMPLETED',
    icon: '📡'
  },
  {
    id: 5,
    time: 'T+00:18:00',
    title: 'Onboard AI Subsystem Boot',
    subtitle: 'Low-Power SoC Initialization',
    detail: 'AI mission engine loads priority scheduler, checks battery voltage (3.8V), and initiates telemetry self-diagnostics.',
    status: 'ACTIVE',
    icon: '🧠'
  },
  {
    id: 6,
    time: 'T+00:45:10',
    title: 'Ground Station Signal Acquisition',
    subtitle: 'First LEO Orbital Pass',
    detail: 'KJSIT Mumbai Ground Station locks onto 437.000 MHz beacon. AI router evaluates SNR and begins multi-mode packet downlink.',
    status: 'NOMINAL',
    icon: '🌐'
  }
];

export default function DeploymentSequence() {
  const [activeStep, setActiveStep] = useState(4); // Default to AI Boot step

  const handleSelectStep = (idx) => {
    setActiveStep(idx);
    playTelemetryChirp();
  };

  return (
    <section
      className="mission-section"
      id="deployment"
      style={{
        padding: '100px 32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      <div className="chapter-tag" style={{ color: '#10b981', marginBottom: '16px' }}>
        02 — SOMAIYAPOD DEPLOYER &amp; SEPARATION SEQUENCE
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
          From PSLV upper stage to autonomous orbit operations.
        </h2>
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.65,
            fontWeight: 400
          }}
        >
          Trace the exact physical ejection and initialization sequence of SomaiyaSat from the SomaiyaPod deployer.
        </p>
      </div>

      {/* Interactive Step Navigation & Stage Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}
      >
        {/* Step Navigation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {DEPLOYMENT_STEPS.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.id}
                onClick={() => handleSelectStep(idx)}
                style={{
                  cursor: 'pointer',
                  padding: '18px 22px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(11, 15, 23, 0.75)',
                  border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: '#10b981',
                      borderRadius: '4px 0 0 4px',
                      boxShadow: '0 0 10px #10b981'
                    }}
                  />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.75rem',
                      color: isSelected ? '#10b981' : '#64748b',
                      fontWeight: isSelected ? 700 : 400
                    }}
                  >
                    {step.time}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.68rem',
                      color: step.status === 'ACTIVE' ? '#00f0ff' : step.status === 'NOMINAL' ? '#10b981' : '#94a3b8',
                      padding: '2px 8px',
                      borderRadius: '2px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    {step.status}
                  </span>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginTop: '6px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  {step.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Technical Detail View & Visualizer */}
        <div
          style={{
            padding: '36px',
            minHeight: '440px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(7, 9, 14, 0.85)'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '1.8rem',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {DEPLOYMENT_STEPS[activeStep].icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#10b981' }}>
                    SEQUENCE STAGE {activeStep + 1} OF 6
                  </div>
                  <h3 style={{ fontSize: '1.45rem', color: '#f8fafc', marginTop: '2px' }}>
                    {DEPLOYMENT_STEPS[activeStep].title}
                  </h3>
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  backgroundColor: 'rgba(4, 7, 14, 0.8)',
                  padding: '16px',
                  borderRadius: '4px',
                  borderLeft: '2px solid #10b981',
                  marginBottom: '24px',
                  lineHeight: 1.8
                }}
              >
                <div>TIMESTAMP : {DEPLOYMENT_STEPS[activeStep].time}</div>
                <div>SUBSYSTEM : {DEPLOYMENT_STEPS[activeStep].subtitle}</div>
                <div>TELEMETRY : SEPARATION_CONFIRMATION_SWITCH_NOMINAL</div>
              </div>

              <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '32px' }}>
                {DEPLOYMENT_STEPS[activeStep].detail}
              </p>

              {/* Dynamic Telemetry Box for Step Physics */}
              <div
                style={{
                  height: '140px',
                  backgroundColor: '#04060a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <div className="blueprint-grid-dense" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />

                {activeStep === 0 && (
                  <div style={{ textAlign: 'center', zIndex: 2, fontFamily: 'var(--font-mono, monospace)' }}>
                    <div style={{ color: '#f59e0b', fontSize: '1.15rem', fontWeight: 700 }}>STAGE INSERTION // ISRO POEM</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>ORBITAL VELOCITY: 7.68 KM/S // ALTITUDE: 350 KM</div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div style={{ textAlign: 'center', zIndex: 2, fontFamily: 'var(--font-mono, monospace)' }}>
                    <div style={{ color: '#10b981', fontSize: '1.15rem', fontWeight: 700 }}>SOMAIYAPOD THERMAL LATCH OPEN</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>MELT-WIRE ACTUATED // DOOR SWING 90° CONFIRMED</div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div style={{ textAlign: 'center', zIndex: 2, fontFamily: 'var(--font-mono, monospace)' }}>
                    <div style={{ color: '#10b981', fontSize: '1.15rem', fontWeight: 700 }}>SPRING PUSHER EJECTION ACTIVE</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>RELATIVE ΔV = +1.2 M/S // TUMBLE RATE: &lt; 5°/S</div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div style={{ textAlign: 'center', zIndex: 2, fontFamily: 'var(--font-mono, monospace)' }}>
                    <div style={{ color: '#00f0ff', fontSize: '1.15rem', fontWeight: 700 }}>SOLAR WINGS &amp; UHF ANTENNA DEPLOYED</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>GaAs TRIPLE JUNCTION GENERATING 2.4W PEAK</div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div style={{ textAlign: 'center', zIndex: 2, fontFamily: 'var(--font-mono, monospace)' }}>
                    <div style={{ color: '#00f0ff', fontSize: '1.15rem', fontWeight: 700 }}>ONBOARD AI ENGINE INITIALIZED</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>BATTERY BUS: 3.8V // INT8 HEURISTIC SCHEDULER LOADED</div>
                  </div>
                )}

                {activeStep === 5 && (
                  <div style={{ textAlign: 'center', zIndex: 2, fontFamily: 'var(--font-mono, monospace)' }}>
                    <div style={{ color: '#10b981', fontSize: '1.15rem', fontWeight: 700 }}>GROUND PASS SIGNAL ACQUIRED</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>KJSIT MUMBAI // 437.525 MHZ TELEMETRY LOCKED</div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
