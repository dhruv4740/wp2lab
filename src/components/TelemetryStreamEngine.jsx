import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, RefreshCw, Layers, Terminal, CheckCircle2, Clock } from 'lucide-react';

export default function TelemetryStreamEngine() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [pollInterval, setPollInterval] = useState(2000); // ms
  const [packets, setPackets] = useState([
    { id: 1, time: '11:42:01', opcode: '0x01_EPS_TELEMETRY', voltage: '8.38 V', current: '180 mA', status: 'NOMINAL' },
    { id: 2, time: '11:42:03', opcode: '0x09_AI_ROUTER_STATE', mode: 'M17_VOICE_STREAM', snr: '18.4 dB', status: 'ACTIVE' },
  ]);
  const [tickCount, setTickCount] = useState(2);
  const [lastMountTime] = useState(() => new Date().toLocaleTimeString());

  // Demonstrates useEffect lifecycle hook with interval timer and strict cleanup
  useEffect(() => {
    if (!isStreaming) return;

    const timer = setInterval(() => {
      setTickCount((prev) => prev + 1);

      const opcodes = [
        { code: '0x01_EPS_TELEMETRY', sample: () => ({ voltage: (8.2 + Math.random() * 0.3).toFixed(2) + ' V', current: Math.floor(160 + Math.random() * 40) + ' mA', status: 'NOMINAL' }) },
        { code: '0x04_BATT_THERMAL', sample: () => ({ temp: (-8 + Math.random() * 4).toFixed(1) + ' °C', heater: 'OFF', status: 'STABLE' }) },
        { code: '0x09_AI_ROUTER_STATE', sample: () => ({ mode: Math.random() > 0.4 ? 'M17_VOICE_STREAM' : 'SSTV_BEACON', snr: (16 + Math.random() * 6).toFixed(1) + ' dB', status: 'ACTIVE' }) },
        { code: '0x12_AX25_FRAME', sample: () => ({ callsign: 'VU2SAT-1', hops: '3_SAT_MESH', status: 'FORWARDED' }) },
      ];

      const chosen = opcodes[Math.floor(Math.random() * opcodes.length)];
      const newPacket = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        opcode: chosen.code,
        ...chosen.sample(),
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 5)]);
    }, pollInterval);

    // Lifecycle cleanup function prevents memory leaks when paused or polling rate changes
    return () => {
      clearInterval(timer);
    };
  }, [isStreaming, pollInterval]);

  const handleInjectPacket = () => {
    const manualPacket = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      opcode: '0x3F_MANUAL_COMMAND_ECHO',
      origin: 'Mumbai Ground Command',
      status: 'VERIFIED',
    };
    setPackets((prev) => [manualPacket, ...prev.slice(0, 5)]);
    setTickCount((c) => c + 1);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem',
        backgroundColor: '#0a0e18',
        border: '1px solid rgba(0, 229, 255, 0.3)',
        borderRadius: '16px',
        marginBottom: '3rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* Header with Experiment Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                backgroundColor: 'rgba(0, 229, 255, 0.12)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                color: '#00e5ff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              LIVE STREAM
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: isStreaming ? '#10b981' : '#f59e0b',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isStreaming ? '#10b981' : '#f59e0b',
                }}
              />
              {isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.35rem', color: '#f0f2f5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#00e5ff" />
            <span>Live Telemetry Packet Engine (useState + useEffect)</span>
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Real-time orbital housekeeping stream demonstrating dynamic <code>useEffect</code> timer subscription, dependency tracking, and automatic interval cleanup.
          </p>
        </div>

        {/* Stream Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsStreaming((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: isStreaming ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(0, 229, 255, 0.4)',
              backgroundColor: isStreaming ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0, 229, 255, 0.12)',
              color: isStreaming ? '#fbbf24' : '#00e5ff',
            }}
          >
            {isStreaming ? <Pause size={14} /> : <Play size={14} />}
            <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>

          <button
            type="button"
            onClick={handleInjectPacket}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#f0f2f5',
            }}
          >
            <RefreshCw size={14} />
            <span>Inject Telemetry Packet</span>
          </button>
        </div>
      </div>

      {/* Lifecycle Diagnostics Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ backgroundColor: 'rgba(6, 8, 16, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>
            POLL INTERVAL (RATE)
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
            {[1000, 2000, 4000].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPollInterval(rate)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: pollInterval === rate ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: pollInterval === rate ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                  color: pollInterval === rate ? '#00e5ff' : '#94a3b8',
                }}
              >
                {rate / 1000}s
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(6, 8, 16, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>
            LIFECYCLE TICKS
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#00e5ff', fontWeight: 700, marginTop: '0.2rem' }}>
            {tickCount} cycles
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(6, 8, 16, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>
            MEMORY LEAK GUARD
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle2 size={14} />
            <span>CLEAN (clearInterval)</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(6, 8, 16, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>
            STREAM BUFFER SIZE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#f0f2f5', fontWeight: 700, marginTop: '0.2rem' }}>
            {packets.length} packets
          </div>
        </div>
      </div>

      {/* Live Stream Table */}
      <div style={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(10, 14, 24, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
              <th style={{ padding: '0.6rem 1rem' }}>TIMESTAMP</th>
              <th style={{ padding: '0.6rem 1rem' }}>OPCODE</th>
              <th style={{ padding: '0.6rem 1rem' }}>TELEMETRY PAYLOAD</th>
              <th style={{ padding: '0.6rem 1rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {packets.map((pkt, idx) => (
              <tr
                key={pkt.id}
                style={{
                  backgroundColor: idx === 0 ? 'rgba(0, 229, 255, 0.04)' : idx % 2 === 0 ? 'rgba(6, 8, 16, 0.6)' : 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '0.65rem 1rem', color: '#94a3b8' }}>{pkt.time}</td>
                <td style={{ padding: '0.65rem 1rem', color: '#00e5ff', fontWeight: 600 }}>{pkt.opcode}</td>
                <td style={{ padding: '0.65rem 1rem', color: '#f0f2f5' }}>
                  {Object.entries(pkt)
                    .filter(([k]) => !['id', 'time', 'opcode', 'status'].includes(k))
                    .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                    .join(' | ')}
                </td>
                <td style={{ padding: '0.65rem 1rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: pkt.status === 'NOMINAL' || pkt.status === 'ACTIVE' || pkt.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 229, 255, 0.15)',
                      color: pkt.status === 'NOMINAL' || pkt.status === 'ACTIVE' || pkt.status === 'VERIFIED' ? '#34d399' : '#00e5ff',
                      fontWeight: 600,
                    }}
                  >
                    {pkt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
