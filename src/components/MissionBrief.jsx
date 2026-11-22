import React from 'react';
import { motion } from 'framer-motion';
import CountUpNumber from './CountUpNumber';
import { Layers, Radio, Globe, Cpu, ChevronRight } from 'lucide-react';

export default function MissionBrief() {
  return (
    <section
      id="mission-brief"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        backgroundColor: '#060810',
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
          style={{ marginBottom: '3.5rem' }}
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
            CHAPTER 01 // MISSION DOSSIER
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem', color: '#f0f2f5' }}>
            NEXT-GENERATION EDGE COMPUTING IN LEO
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '820px', lineHeight: 1.6 }}>
            SomaiyaSat is an ultra-small 2P PocketQube satellite operating at 437 MHz UHF, engineered to evaluate autonomous neural decision routing in deep-space environments. Developed in strategic collaboration with ReOrbit Finland, the spacecraft proves that intelligent data curation can operate inside micro-watt power budgets.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>ALTITUDE</span>
              <Globe size={18} color="#00e5ff" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0f2f5', marginBottom: '0.25rem' }}>
              <CountUpNumber end={500} suffix=" km" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sun-Synchronous Polar LEO</div>
          </div>

          <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>TELEMETRY RF</span>
              <Radio size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0f2f5', marginBottom: '0.25rem' }}>
              <CountUpNumber end={437.5} decimals={1} suffix=" MHz" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Multi-mode AX.25, M17 &amp; SSTV</div>
          </div>

          <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>ORBIT PERIOD</span>
              <Cpu size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0f2f5', marginBottom: '0.25rem' }}>
              <CountUpNumber end={92} suffix=" min" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>15.6 Orbits Per Solar Day</div>
          </div>

          <div className="glass-panel glass-panel-interactive" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>TOTAL MASS</span>
              <Layers size={18} color="#a855f7" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f0f2f5', marginBottom: '0.25rem' }}>
              <CountUpNumber end={250} suffix=" g" />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Standard 1PQ/2P PocketQube Form</div>
          </div>
        </div>

        <details className="tech-drawer" style={{ overflow: 'hidden' }}>
          <summary>
            <span>[VIEW SPECS] SATELLITE SUBSYSTEM &amp; REORBIT DEPLOYER ARCHITECTURE</span>
            <ChevronRight size={16} />
          </summary>
          <div className="tech-drawer-content eng-panel" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: '#00e5ff', fontSize: '0.95rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  ELECTRICAL POWER SUBSYSTEM (EPS)
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8' }}>
                  Body-mounted triple-junction solar arrays delivering 2.2W peak generation with redundant lithium-iron-phosphate battery management and autonomous load shedding.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#00e5ff', fontSize: '0.95rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  AUTONOMOUS ONBOARD ROUTER (OBC)
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8' }}>
                  Radiation-mitigated micro-controller evaluating link budget, solar angles, and packet queues to optimize amateur radio downlink windows in real time.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#00e5ff', fontSize: '0.95rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  SOMAIYAPOD DEPLOYER INTERFACE
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8' }}>
                  Spring-assisted low-jitter release mechanism developed in collaboration with ReOrbit for integration aboard the PSLV orbital stage (POEM).
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
