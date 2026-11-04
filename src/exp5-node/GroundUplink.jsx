import React, { useState, useEffect } from 'react';
import { Send, Radio, Terminal } from 'lucide-react';

// Shared styles
const label = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' };
const field = { width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(6, 8, 16, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '6px', color: '#f0f2f5', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' };
const errorText = { color: '#fb7185', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' };
const panel = { padding: '2rem', backgroundColor: '#0a0e18', borderRadius: '16px' };
const infoBox = { padding: '0.75rem', backgroundColor: '#060810', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)' };

// Simple checksum: mixes every character of the text into one 16-bit number
function computeCRC(text) {
  let hash = 0x1021;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffff;
  }
  return '0x' + hash.toString(16).toUpperCase().padStart(4, '0');
}

export default function GroundUplink() {
  // Controlled form inputs
  const [target, setTarget] = useState('SOMAIYASAT-1PQ');
  const [opcode, setOpcode] = useState('0x4A');
  const [payload, setPayload] = useState('AA BB 01 20 26');
  const [power, setPower] = useState(500);
  const [passkey, setPasskey] = useState('');
  const [schedule, setSchedule] = useState('next Thu 14:30');

  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'TRANSMITTING' | 'SENT'
  const [errors, setErrors] = useState({});

  // Derived value: recalculated on every render, so it needs no state
  const crc = computeCRC(target + opcode + payload);

  // useEffect: moves TRANSMITTING -> SENT -> IDLE with timers, cleared if the status changes
  useEffect(() => {
    if (status === 'IDLE') return;
    const id = setTimeout(() => setStatus(status === 'TRANSMITTING' ? 'SENT' : 'IDLE'), status === 'TRANSMITTING' ? 1200 : 4000);
    return () => clearTimeout(id);
  }, [status]);

  // Validation: collect messages in an object; the form is valid when it is empty
  const handleTransmit = (e) => {
    e.preventDefault();
    const found = {};
    if (!payload.trim()) found.payload = 'Hex telecommand payload cannot be empty';
    if (!passkey.trim()) found.passkey = 'Operator passkey required to sign command packet';
    setErrors(found);
    if (Object.keys(found).length === 0) setStatus('TRANSMITTING');
  };

  const buttonText = { IDLE: 'TRANSMIT TELECOMMAND FRAME', TRANSMITTING: 'MODULATING AX.25 PACKET...', SENT: 'TRANSMISSION CONFIRMED (ACK)' }[status];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#f0f2f5', marginBottom: '0.4rem' }}>Uplink</h1>
      <p style={{ color: '#94a3b8', maxWidth: 620, lineHeight: 1.5, marginBottom: '1.5rem' }}>
        Build a telecommand packet, sign it with your passkey and send it during a pass.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '2rem' }}>
        {/* Left: controlled form */}
        <div className="glass-panel" style={{ ...panel, border: '1px solid rgba(245, 158, 11, 0.25)' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={20} color="#f59e0b" />
            <span>Packet Frame Builder</span>
          </h3>

          <form onSubmit={handleTransmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={label}>Target Spacecraft Call / ID</label>
              <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} style={field} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={label}>Command Opcode</label>
                <select value={opcode} onChange={(e) => setOpcode(e.target.value)} style={field}>
                  <option value="0x4A">0x4A: Query AI Routing Log</option>
                  <option value="0x52">0x52: Trigger Robot36 SSTV</option>
                  <option value="0x61">0x61: Ping M17 Transceiver</option>
                  <option value="0x70">0x70: Set Safe Battery Floor</option>
                </select>
              </div>
              <div>
                <label style={label}>RF Power: {power} mW</label>
                <input type="range" min="100" max="1000" step="50" value={power} onChange={(e) => setPower(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b', marginTop: '0.5rem' }} />
              </div>
            </div>

            <div>
              <label style={label}>Hex Telecommand Payload</label>
              <input type="text" value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="e.g. AA BB 01 20 26" style={{ ...field, borderColor: errors.payload ? '#f43f5e' : undefined }} />
              {errors.payload && <div style={errorText}>{errors.payload}</div>}
            </div>

            <div>
              <label style={label}>Operator Passkey</label>
              <input type="password" value={passkey} onChange={(e) => setPasskey(e.target.value)} placeholder="Enter secret operator key..." style={{ ...field, borderColor: errors.passkey ? '#f43f5e' : undefined }} />
              {errors.passkey && <div style={errorText}>{errors.passkey}</div>}
            </div>

            <div>
              <label style={label}>Pass Schedule</label>
              <input type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="e.g. next Thu 14:30 or in 45 mins" style={field} />
            </div>

            <button
              type="submit"
              disabled={status === 'TRANSMITTING'}
              style={{ padding: '0.9rem', backgroundColor: '#f59e0b', border: 'none', borderRadius: '8px', color: '#04060a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, cursor: status === 'TRANSMITTING' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Send size={16} />
              <span>{buttonText}</span>
            </button>
          </form>
        </div>

        {/* Right: live preview of the frame, updates as the form changes */}
        <div className="glass-panel" style={{ ...panel, border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={20} color="#00e5ff" />
            <span>AX.25 Frame Inspector</span>
          </h3>

          <div style={{ ...infoBox, border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '8px', padding: '1rem', fontSize: '0.8rem', lineHeight: 1.6 }}>
            <div style={{ color: '#00e5ff' }}>DEST_ADDR: {target}</div>
            <div style={{ color: '#94a3b8' }}>SRC_ADDR:  GROUND-NODE-01</div>
            <div style={{ color: '#f59e0b' }}>OPCODE:    {opcode}</div>
            <div style={{ color: '#f0f2f5' }}>PAYLOAD:   {payload}</div>
            <div style={{ color: '#10b981', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              FCS_CRC16: {crc}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={infoBox}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>RF POWER</div>
              <div style={{ color: '#00e5ff', fontWeight: 600 }}>{power} mW</div>
            </div>
            <div style={infoBox}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>TX FREQUENCY</div>
              <div style={{ color: '#f59e0b', fontWeight: 600 }}>437.500 MHz</div>
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Every field is a controlled component: its value lives in state, so the frame above updates as you type.
          </p>
        </div>
      </div>
    </div>
  );
}
