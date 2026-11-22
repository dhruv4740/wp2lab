import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Shield, ArrowUpDown, Lock, Eye, AlertTriangle } from 'lucide-react';

export default function AutonomousDecision() {
  const [battery, setBattery] = useState(85);
  const [snr, setSnr] = useState(82);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Evaluate AI logic based on Battery % and Link SNR (dB)
  const getAiState = () => {
    if (snr > 75 && battery > 50) {
      return {
        activeMode: 'SSTV Image Transmission',
        activePriority: 'Priority 2 (High Bandwidth)',
        bandwidth: 'FULL (12.5 kHz)',
        statusColor: '#00f0ff',
        queueOrder: [
          { id: 'sstv', name: 'SSTV Image Packet #14', size: '240 KB', priority: 1, type: 'IMAGE', color: '#00f0ff' },
          { id: 'ttc', name: 'TT&C Beacon (3.8V, 24°C)', size: '1.2 KB', priority: 2, type: 'TELEMETRY', color: '#10b981' },
          { id: 'm17', name: 'M17 Digital Voice Queue', size: '16 KB', priority: 3, type: 'VOICE', color: '#94a3b8' }
        ],
        reason: 'Optimal link SNR (>75 dB) and strong battery (>50%) permit high-bandwidth SSTV downlink.'
      };
    } else if (snr > 40 && battery > 35) {
      return {
        activeMode: 'M17 / Codec2 Digital Voice',
        activePriority: 'Priority 3 (Medium Bandwidth)',
        bandwidth: 'SQUEEZED (3.2 kHz)',
        statusColor: '#f59e0b',
        queueOrder: [
          { id: 'm17', name: 'M17 Digital Voice Queue', size: '16 KB', priority: 1, type: 'VOICE', color: '#f59e0b' },
          { id: 'ttc', name: 'TT&C Beacon (3.8V, 24°C)', size: '1.2 KB', priority: 2, type: 'TELEMETRY', color: '#10b981' },
          { id: 'sstv', name: 'SSTV Image (Deferred)', size: '240 KB', priority: 3, type: 'IMAGE', color: '#94a3b8' }
        ],
        reason: 'Moderate SNR (>40 dB). Squeezing transmission to low-bitrate Codec2 digital voice.'
      };
    } else {
      return {
        activeMode: 'TT&C Housekeeping (Safe Priority)',
        activePriority: 'Priority 1 (Failsafe)',
        bandwidth: 'MINIMAL (300 bps)',
        statusColor: '#ef4444',
        queueOrder: [
          { id: 'ttc', name: 'TT&C Beacon (3.8V, 24°C)', size: '1.2 KB', priority: 1, type: 'TELEMETRY', color: '#ef4444' },
          { id: 'm17', name: 'M17 Voice (Buffered)', size: '16 KB', priority: 2, type: 'VOICE', color: '#94a3b8' },
          { id: 'sstv', name: 'SSTV Image (Paused)', size: '240 KB', priority: 3, type: 'IMAGE', color: '#64748b' }
        ],
        reason: 'Low link quality or battery depletion. Falling back to TT&C housekeeping beacon only.'
      };
    }
  };

  const aiState = getAiState();

  return (
    <section
      className="mission-section"
      id="autonomy"
      style={{
        padding: '100px 32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}
    >
      <div className="chapter-tag" style={{ color: '#00f0ff', marginBottom: '16px' }}>
        03 — AUTONOMOUS AI DATA ROUTING &amp; GOVERNANCE
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
          Onboard dynamic queue scheduling without human intervention.
        </h2>
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.65,
            fontWeight: 400
          }}
        >
          Adjust the environmental parameters below to observe the AI Scheduler re-evaluating transmission priorities in real-time based on battery state-of-charge and orbital pass link SNR.
        </p>
      </div>

      {/* Interactive Playground Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px',
          alignItems: 'stretch'
        }}
      >
        {/* Left Controls Panel */}
        <div
          style={{
            padding: '28px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(7, 9, 14, 0.85)'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#00f0ff', letterSpacing: '0.15em', marginBottom: '8px' }}>
            TELEMETRY INPUT SIMULATOR
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '28px' }}>
            Orbital Environment Sliders
          </h3>

          {/* Battery Slider */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>BATTERY VOLTAGE / SOC</span>
              <span className="font-mono tabular-nums" style={{ fontSize: '0.95rem', color: battery > 50 ? '#10b981' : battery > 35 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                {battery}% <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({(2.8 + (battery / 100) * 1.4).toFixed(2)} V)</span>
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={battery}
              onChange={(e) => setBattery(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00f0ff', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
              <span>10% [CRITICAL]</span>
              <span>50% [THRESHOLD]</span>
              <span>100% [FULL]</span>
            </div>
          </div>

          {/* Link SNR Slider */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>RF LINK SNR (437 MHz PASS)</span>
              <span className="font-mono tabular-nums" style={{ fontSize: '0.95rem', color: '#00f0ff', fontWeight: 700 }}>
                {snr} dB
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={snr}
              onChange={(e) => setSnr(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00f0ff', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
              <span>0 dB [NO SIGNAL]</span>
              <span>40 dB [VOICE THRESHOLD]</span>
              <span>75 dB [SSTV THRESHOLD]</span>
            </div>
          </div>

          {/* Evaluated Mode Summary */}
          <div
            style={{
              backgroundColor: '#04060a',
              padding: '16px 20px',
              borderRadius: '4px',
              borderLeft: `3px solid ${aiState.statusColor}`,
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="beacon-pulse" style={{ backgroundColor: aiState.statusColor, boxShadow: `0 0 8px ${aiState.statusColor}` }} />
              <span>AI ROUTER DECISION OUTPUT</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
              {aiState.activeMode}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5 }}>
              {aiState.reason}
            </div>
          </div>
        </div>

        {/* Right Priority Queue Visualizer Panel */}
        <div
          style={{
            padding: '28px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(7, 9, 14, 0.85)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.70rem', color: '#00f0ff', letterSpacing: '0.15em' }}>DYNAMIC TRANSMISSION QUEUE</div>
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginTop: '2px' }}>AI Packet Scheduler</h3>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.7rem',
                color: aiState.statusColor,
                padding: '4px 10px',
                borderRadius: '2px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span className="beacon-pulse" style={{ backgroundColor: aiState.statusColor, boxShadow: `0 0 8px ${aiState.statusColor}` }} />
              <span>BANDWIDTH: {aiState.bandwidth}</span>
            </span>
          </div>

          {/* Animated Packet Queue Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            <AnimatePresence>
              {aiState.queueOrder.map((packet, index) => (
                <motion.div
                  key={packet.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '4px',
                    backgroundColor: index === 0 ? 'rgba(0, 240, 255, 0.06)' : 'rgba(4, 7, 14, 0.8)',
                    border: index === 0 ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: index === 0 ? '0 0 20px rgba(0, 240, 255, 0.12)' : 'none',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: index === 0 ? '#00f0ff' : '#1e293b',
                          color: index === 0 ? '#04060a' : '#8b9daf',
                          fontWeight: 700,
                          fontSize: '0.80rem',
                          borderRadius: '2px'
                        }}
                      >
                        Q{index + 1}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc' }}>
                          {packet.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.70rem', color: '#64748b', marginTop: '2px' }}>
                          TYPE: <span style={{ color: packet.color }}>{packet.type}</span> // PAYLOAD: {packet.size}
                        </div>
                      </div>
                    </div>

                    {index === 0 && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.68rem',
                          padding: '4px 8px',
                          backgroundColor: '#10b981',
                          color: '#04060a',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          borderRadius: '2px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#04060a' }} />
                        DOWNLINKING NOW
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#64748b', marginTop: '16px', textAlign: 'center' }}>
            QUEUE RE-ORDERED IN REAL-TIME BY ONBOARD INT8 NEURAL ENGINE
          </div>
        </div>
      </div>

      {/* Collapsible Technical Drawer: Decision Logic Matrix & Modern AI Governance */}
      <div
        className="eng-panel"
        style={{
          marginTop: '36px',
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
              padding: '20px 28px',
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
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#00f0ff', letterSpacing: '0.15em' }}>
                ALGORITHMIC SPECIFICATIONS &amp; MODERN AI GOVERNANCE
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: '2px 0 0 0' }}>
                AI Decision Matrix &amp; Modern Governance Framework (KJS-SRS-01)
              </h4>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                color: drawerOpen ? '#10b981' : '#00f0ff',
                padding: '4px 12px',
                border: drawerOpen ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }}
            >
              {drawerOpen ? 'COLLAPSE MATRIX ▲' : 'EXPAND MATRIX ▼'}
            </span>
          </summary>
          <div style={{ padding: '28px', overflow: 'hidden' }}>
            {/* Part 1: Decision Logic Modes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ borderLeft: '2px solid #00f0ff', paddingLeft: '14px' }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: '#64748b' }}>HIGH-BANDWIDTH MODE</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>SSTV Image Relay</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Condition: Battery &gt; 50% &amp; SNR &gt; 75 dB</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#00f0ff', marginTop: '2px' }}>Bandwidth: 12.5 kHz // 240 KB frames</div>
              </div>
              <div style={{ borderLeft: '2px solid #f59e0b', paddingLeft: '14px' }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: '#64748b' }}>VOICE COMPRESSION MODE</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>M17 / Codec2 Speech</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Condition: Battery &gt; 35% &amp; SNR &gt; 40 dB</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#f59e0b', marginTop: '2px' }}>Bandwidth: 3.2 kHz // 700-3200 bps</div>
              </div>
              <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '14px' }}>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: '#64748b' }}>FAILSAFE BEACON MODE</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>TT&amp;C Housekeeping Only</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Condition: Default / Low Energy Margin</div>
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>Bandwidth: 300 bps // Continuous Health</div>
              </div>
            </div>

            {/* Part 2: Modern AI Governance (Part A.13) */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px' }}>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#818cf8', letterSpacing: '0.12em', marginBottom: '12px' }}>
                // MODERN AI GOVERNANCE PILLARS (PART A.13)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>1. Agentic Autonomy</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>In-orbit pass scheduling executes without ground telecommand latency.</div>
                </div>
                <div style={{ padding: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>2. AI Security &amp; Trust</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Independent hardware watchdog resets subsystem if inference diverges.</div>
                </div>
                <div style={{ padding: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>3. Explainable AI (XAI)</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Telemetry packets append rationale codes for each routing choice.</div>
                </div>
                <div style={{ padding: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>4. Human-in-the-Loop</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>Ground operators can override automated queue via encrypted telecommand.</div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
