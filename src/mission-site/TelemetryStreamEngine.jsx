import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, RefreshCw } from 'lucide-react';

const mono = { fontFamily: 'var(--font-mono)' };
const MAX_PACKETS = 6;
const GOOD_STATUS = ['NOMINAL', 'ACTIVE', 'VERIFIED'];

const rand = (min, range) => min + Math.random() * range;

// The kinds of packet the simulated satellite can send; `sample` makes random values.
const OPCODES = [
  { code: '0x01_EPS_TELEMETRY', sample: () => ({ voltage: rand(8.2, 0.3).toFixed(2) + ' V', current: Math.floor(rand(160, 40)) + ' mA', status: 'NOMINAL' }) },
  { code: '0x04_BATT_THERMAL', sample: () => ({ temp: rand(-8, 4).toFixed(1) + ' °C', heater: 'OFF', status: 'STABLE' }) },
  { code: '0x09_AI_ROUTER_STATE', sample: () => ({ mode: Math.random() > 0.4 ? 'M17_VOICE_STREAM' : 'SSTV_BEACON', snr: rand(16, 6).toFixed(1) + ' dB', status: 'ACTIVE' }) },
  { code: '0x12_AX25_FRAME', sample: () => ({ callsign: 'VU2SAT-1', hops: '3_SAT_MESH', status: 'FORWARDED' }) },
];

function makePacket(opcode, fields) {
  return { id: Date.now(), time: new Date().toLocaleTimeString(), opcode, ...fields };
}

function randomPacket() {
  const chosen = OPCODES[Math.floor(Math.random() * OPCODES.length)];
  return makePacket(chosen.code, chosen.sample());
}

const infoBox = { backgroundColor: 'rgba(6, 8, 16, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem 1rem' };
const infoLabel = { ...mono, fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' };
const infoValue = { ...mono, fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' };
const controlBtn = { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '6px', ...mono, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const cellPad = { padding: '0.65rem 1rem' };

export default function TelemetryStreamEngine() {
  // useState: whether the stream is running, how often it ticks, and the latest packets
  const [isStreaming, setIsStreaming] = useState(true);
  const [pollInterval, setPollInterval] = useState(2000);
  const [packets, setPackets] = useState([
    { id: 1, time: '11:42:01', opcode: '0x01_EPS_TELEMETRY', voltage: '8.38 V', current: '180 mA', status: 'NOMINAL' },
    { id: 2, time: '11:42:03', opcode: '0x09_AI_ROUTER_STATE', mode: 'M17_VOICE_STREAM', snr: '18.4 dB', status: 'ACTIVE' },
  ]);
  const [tickCount, setTickCount] = useState(2);

  const addPacket = (packet) => {
    setPackets((prev) => [packet, ...prev.slice(0, MAX_PACKETS - 1)]);
    setTickCount((count) => count + 1);
  };

  // useEffect: start a timer while streaming. The returned cleanup stops the old timer
  // when the stream is paused, the rate changes, or the component is removed.
  useEffect(() => {
    if (!isStreaming) return;
    const timer = setInterval(() => addPacket(randomPacket()), pollInterval);
    return () => clearInterval(timer);
  }, [isStreaming, pollInterval]);

  const injectPacket = () => addPacket(makePacket('0x3F_MANUAL_COMMAND_ECHO', { origin: 'Mumbai Ground Command', status: 'VERIFIED' }));

  return (
    <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#0a0e18', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '16px', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span style={{ ...mono, fontSize: '0.72rem', backgroundColor: 'rgba(0, 229, 255, 0.12)', border: '1px solid rgba(0, 229, 255, 0.4)', color: '#00e5ff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              LIVE STREAM
            </span>
            <span style={{ ...mono, fontSize: '0.7rem', color: isStreaming ? '#10b981' : '#f59e0b' }}>
              ● {isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
            </span>
          </div>
          <h3 style={{ fontSize: '1.35rem', color: '#f0f2f5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#00e5ff" /> Live Telemetry Packet Engine (useState + useEffect)
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Real-time orbital housekeeping stream demonstrating dynamic <code>useEffect</code> timer subscription, dependency tracking, and automatic interval cleanup.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsStreaming(!isStreaming)}
            style={{
              ...controlBtn,
              border: '1px solid ' + (isStreaming ? 'rgba(245, 158, 11, 0.4)' : 'rgba(0, 229, 255, 0.4)'),
              backgroundColor: isStreaming ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0, 229, 255, 0.12)',
              color: isStreaming ? '#fbbf24' : '#00e5ff',
            }}
          >
            {isStreaming ? <Pause size={14} /> : <Play size={14} />}
            {isStreaming ? 'Pause Stream' : 'Resume Stream'}
          </button>
          <button type="button" onClick={injectPacket} style={{ ...controlBtn, border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#f0f2f5' }}>
            <RefreshCw size={14} /> Inject Telemetry Packet
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={infoBox}>
          <div style={infoLabel}>POLL INTERVAL (RATE)</div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
            {[1000, 2000, 4000].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPollInterval(rate)}
                style={{
                  ...mono, fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer',
                  border: '1px solid ' + (pollInterval === rate ? '#00e5ff' : 'rgba(255, 255, 255, 0.1)'),
                  backgroundColor: pollInterval === rate ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                  color: pollInterval === rate ? '#00e5ff' : '#94a3b8',
                }}
              >
                {rate / 1000}s
              </button>
            ))}
          </div>
        </div>
        <div style={infoBox}>
          <div style={infoLabel}>LIFECYCLE TICKS</div>
          <div style={{ ...infoValue, color: '#00e5ff' }}>{tickCount} cycles</div>
        </div>
        <div style={infoBox}>
          <div style={infoLabel}>STREAM BUFFER SIZE</div>
          <div style={{ ...infoValue, color: '#f0f2f5' }}>{packets.length} packets</div>
        </div>
      </div>

      <div style={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ ...mono, width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(10, 14, 24, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
              {['TIMESTAMP', 'OPCODE', 'TELEMETRY PAYLOAD', 'STATUS'].map((h) => <th key={h} style={{ padding: '0.6rem 1rem' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {packets.map((pkt, i) => {
              const good = GOOD_STATUS.includes(pkt.status);
              // Everything except these fixed columns is shown as "KEY: value" in the payload column
              const { id, time, opcode, status, ...payload } = pkt;
              return (
                <tr key={id} style={{ backgroundColor: i === 0 ? 'rgba(0, 229, 255, 0.04)' : i % 2 === 0 ? 'rgba(6, 8, 16, 0.6)' : 'transparent', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ ...cellPad, color: '#94a3b8' }}>{time}</td>
                  <td style={{ ...cellPad, color: '#00e5ff', fontWeight: 600 }}>{opcode}</td>
                  <td style={{ ...cellPad, color: '#f0f2f5' }}>
                    {Object.entries(payload).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(' | ')}
                  </td>
                  <td style={cellPad}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, backgroundColor: good ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 229, 255, 0.15)', color: good ? '#34d399' : '#00e5ff' }}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
