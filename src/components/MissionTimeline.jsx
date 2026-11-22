import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Radio, Orbit, Activity, ShieldCheck, Zap } from 'lucide-react';

export const MILESTONES = [
  {
    time: 'T-00:00:00',
    title: 'PSLV-C58 Launch Ignition',
    loc: 'SDSC SHAR First Launch Pad',
    desc: 'ISRO PSLV-C58 lift-off carrying the POEM platform and SomaiyaSat.',
    status: 'COMPLETE',
  },
  {
    time: 'T+00:12:00',
    title: 'POEM Platform Insertion',
    loc: '350 km Circular Orbit',
    desc: 'Orbital injection of the POEM-3 hosting platform and SomaiyaPod deployer.',
    status: 'COMPLETE',
  },
  {
    time: 'T+00:15:20',
    title: 'Orbital Thermal Equilibrium',
    loc: 'LEO Eclipse Entry',
    desc: 'Internal chassis temperatures stabilize within nominal operating margins.',
    status: 'COMPLETE',
  },
  {
    time: 'T+00:18:00',
    title: 'AI Subsystem Boot',
    loc: 'Onboard Edge SoC',
    desc: 'Neural priority arbitration firmware initializes.',
    status: 'COMPLETE',
  },
  {
    time: 'T+00:25:00',
    title: 'Attitude Stabilization & Detumble',
    loc: 'B-dot Magnetic Detumble',
    desc: 'Active magnetic torquers eliminate tip-off rotation rates below 2 deg/sec.',
    status: 'COMPLETE',
  },
  {
    time: 'T+00:45:10',
    title: 'First Ground Pass Lock',
    loc: 'Primary Ground Station',
    desc: 'Carrier signal acquired on 437.500 MHz with clean AX.25 decoding.',
    status: 'NOMINAL',
  },
  {
    time: 'T+00:46:00',
    title: 'Autonomous Routing Active',
    loc: 'Autonomous Flight Executive',
    desc: 'Onboard scheduler begins dynamic arbitration between scientific telemetry and voice queues.',
    status: 'NOMINAL',
  },
  {
    time: 'T+01:31:30',
    title: 'First Orbit Completion',
    loc: '500 km Sun-Sync Orbit',
    desc: 'Spacecraft completes initial 92-minute orbit with nominal power reserves.',
    status: 'NOMINAL',
  },
];

export default function MissionTimeline() {
  return (
    <section
      id="timeline"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        backgroundColor: '#060810',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
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
            CHAPTER 03 // MISSION CHRONOLOGY
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f0f2f5', marginBottom: '1rem' }}>
            ORBITAL EXECUTION TIMELINE
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Chronological flight telemetry sequence from launch ignition through POEM stage separation and autonomous AI routing stabilization.
          </p>
        </motion.div>

        {/* Vertical Timeline Container */}
        <div style={{ position: 'relative', padding: '2rem 0' }}>
          {/* Glowing Vertical Progress Line */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '50%',
              width: '2px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, #00e5ff 0%, #10b981 50%, #f59e0b 100%)',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.4)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {MILESTONES.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isEven ? 'flex-start' : 'flex-end',
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  {/* Center Node Marker */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#04060a',
                      border: '3px solid #00e5ff',
                      boxShadow: '0 0 14px #00e5ff',
                      zIndex: 2,
                    }}
                  />

                  {/* Card Element */}
                  <div
                    className="glass-panel glass-panel-interactive"
                    style={{
                      width: '44%',
                      padding: '1.5rem',
                      backgroundColor: '#0a0e18',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          color: '#00e5ff',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {milestone.time}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: milestone.status === 'COMPLETE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: milestone.status === 'COMPLETE' ? '#34d399' : '#fbbf24',
                          fontWeight: 600,
                        }}
                      >
                        {milestone.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: '#f0f2f5', marginBottom: '0.4rem' }}>
                      {milestone.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '0.65rem' }}>
                      <MapPin size={12} color="#00e5ff" />
                      <span>{milestone.loc}</span>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {milestone.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
