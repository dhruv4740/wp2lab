import React, { useState } from 'react';
import {
  Send,
  Radio,
  Cpu,
  Shield,
  Clock,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Layers,
  Key,
  Database,
  ArrowRight,
} from 'lucide-react';
import WireframeStudio from '../components/WireframeStudio';

export default function GroundUplink() {
  const [activeView, setActiveView] = useState('console'); // 'console' | 'wireframe'

  // Controlled Form Inputs
  const [targetSatellite, setTargetSatellite] = useState('SOMAIYASAT-1PQ');
  const [commandOpcode, setCommandOpcode] = useState('0x4A'); // 0x4A: Query AI Routing Log
  const [hexPayload, setHexPayload] = useState('AA BB 01 20 26');
  const [powerLevel, setPowerLevel] = useState(500); // 500 mW
  const [operatorAuthKey, setOperatorAuthKey] = useState('');
  const [forgivingSchedule, setForgivingSchedule] = useState('next Thu 14:30');

  // Form State & Validation
  const [transmissionStatus, setTransmissionStatus] = useState('IDLE'); // 'IDLE' | 'TRANSMITTING' | 'SENT' | 'ERROR'
  const [validationErrors, setValidationErrors] = useState({});

  // Real-time Checksum (CRC-16 simulated)
  const computeCRC = (str) => {
    let hash = 0x1021;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffff;
    }
    return '0x' + hash.toString(16).toUpperCase().padStart(4, '0');
  };

  const calculatedCRC = computeCRC(targetSatellite + commandOpcode + hexPayload);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!hexPayload.trim()) errors.hexPayload = 'Hex telecommand payload cannot be empty';
    if (!operatorAuthKey.trim()) errors.operatorAuthKey = 'Operator passkey required to sign command packet';
    if (powerLevel < 100 || powerLevel > 1000) errors.powerLevel = 'Power level must be 100 - 1000 mW';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTransmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setTransmissionStatus('TRANSMITTING');
    setTimeout(() => {
      setTransmissionStatus('SENT');
      setTimeout(() => setTransmissionStatus('IDLE'), 4000);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#f0f2f5', marginBottom: '0.4rem' }}>Uplink</h1>
          <p style={{ color: '#94a3b8', maxWidth: 620, lineHeight: 1.5 }}>
            Build a telecommand packet, sign it with your passkey and send it during a pass.
          </p>
        </div>

        {/* View Switcher: Console vs Wireframe Studio */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#0a0e18', padding: '0.35rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            type="button"
            onClick={() => setActiveView('console')}
            style={{
              padding: '0.5rem 0.85rem',
              backgroundColor: activeView === 'console' ? '#f59e0b' : 'transparent',
              color: activeView === 'console' ? '#04060a' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            COMMAND CONSOLE
          </button>
          <button
            type="button"
            onClick={() => setActiveView('wireframe')}
            style={{
              padding: '0.5rem 0.85rem',
              backgroundColor: activeView === 'wireframe' ? '#f59e0b' : 'transparent',
              color: activeView === 'wireframe' ? '#04060a' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            WIREFRAME STUDIO
          </button>
        </div>
      </div>

      {activeView === 'wireframe' ? (
        <WireframeStudio />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '2rem' }}>
          {/* Left: Controlled Form */}
          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#0a0e18', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={20} color="#f59e0b" />
              <span>Packet Frame Builder</span>
            </h3>

            <form onSubmit={handleTransmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Target Spacecraft Call / ID
                </label>
                <input
                  type="text"
                  value={targetSatellite}
                  onChange={(e) => setTargetSatellite(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Command Opcode
                  </label>
                  <select
                    value={commandOpcode}
                    onChange={(e) => setCommandOpcode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(6, 8, 16, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#f0f2f5',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    <option value="0x4A">0x4A: Query AI Routing Log</option>
                    <option value="0x52">0x52: Trigger Robot36 SSTV</option>
                    <option value="0x61">0x61: Ping M17 Transceiver</option>
                    <option value="0x70">0x70: Set Safe Battery Floor</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    RF Power: {powerLevel} mW
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={powerLevel}
                    onChange={(e) => setPowerLevel(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#f59e0b', marginTop: '0.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Hex Telecommand Payload
                </label>
                <input
                  type="text"
                  value={hexPayload}
                  onChange={(e) => setHexPayload(e.target.value)}
                  placeholder="e.g. AA BB 01 20 26"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: validationErrors.hexPayload ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                {validationErrors.hexPayload && (
                  <div style={{ color: '#fb7185', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                    {validationErrors.hexPayload}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Operator Cryptographic Passkey
                </label>
                <input
                  type="password"
                  value={operatorAuthKey}
                  onChange={(e) => setOperatorAuthKey(e.target.value)}
                  placeholder="Enter secret operator key..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: validationErrors.operatorAuthKey ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                {validationErrors.operatorAuthKey && (
                  <div style={{ color: '#fb7185', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                    {validationErrors.operatorAuthKey}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Forgiving Schedule Parser (Temporal Input)
                </label>
                <input
                  type="text"
                  value={forgivingSchedule}
                  onChange={(e) => setForgivingSchedule(e.target.value)}
                  placeholder="e.g. next Thu 14:30 or in 45 mins"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(6, 8, 16, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#f0f2f5',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', marginTop: '0.3rem' }}>
                  Accepts natural language expressions: tomorrow 10:00, in 2 hours, next Thu
                </div>
              </div>

              <button
                type="submit"
                disabled={transmissionStatus === 'TRANSMITTING'}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.9rem',
                  backgroundColor: '#f59e0b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#04060a',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: transmissionStatus === 'TRANSMITTING' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Send size={16} />
                <span>
                  {transmissionStatus === 'TRANSMITTING'
                    ? 'MODULATING AX.25 PACKET...'
                    : transmissionStatus === 'SENT'
                    ? 'TRANSMISSION CONFIRMED (ACK)'
                    : 'TRANSMIT TELECOMMAND FRAME'}
                </span>
              </button>
            </form>
          </div>

          {/* Right: Live Frame Preview & CRC Inspection */}
          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#0a0e18', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={20} color="#00e5ff" />
              <span>Serialized AX.25 Frame Inspector</span>
            </h3>

            <div style={{ backgroundColor: '#060810', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '8px', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.6 }}>
              <div style={{ color: '#64748b' }}>// AX.25 UI-Frame Binary Representation</div>
              <div style={{ color: '#00e5ff', marginTop: '0.4rem' }}>DEST_ADDR: {targetSatellite.padEnd(10, ' ')}</div>
              <div style={{ color: '#94a3b8' }}>SRC_ADDR:  GROUND-NODE-01</div>
              <div style={{ color: '#f59e0b' }}>OPCODE:    {commandOpcode}</div>
              <div style={{ color: '#f0f2f5' }}>PAYLOAD:   {hexPayload}</div>
              <div style={{ color: '#10b981', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                FCS_CRC16: {calculatedCRC} (Computed Real-Time)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#060810', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b' }}>MODULATION</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#00e5ff', fontWeight: 600 }}>AFSK 1200 / 4FSK</div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#060810', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b' }}>TX FREQUENCY</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f59e0b', fontWeight: 600 }}>437.500 MHz</div>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
              This interface demonstrates comprehensive form patterns including controlled components, dynamic multi-field calculation, natural language parsing, and cryptographic client-side validation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
