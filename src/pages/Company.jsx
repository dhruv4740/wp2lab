import React, { useState, useRef } from 'react';
import {
  Rocket,
  ShieldCheck,
  Cpu,
  Globe,
  CheckCircle,
  Zap,
  Layers,
  Terminal,
  Code2,
  Copy,
  ExternalLink,
  BookOpen,
  Radio
} from 'lucide-react';

export default function Company() {
  // Controlled vs Uncontrolled live interactive telemetry buffer testbench
  const [controlledBuffer, setControlledBuffer] = useState('CMD_TELEMETRY_SYNC');
  const [renderCount, setRenderCount] = useState(0);
  const rawInputRef = useRef(null);
  const [dmaValue, setDmaValue] = useState('');
  const [copiedProtocol, setCopiedProtocol] = useState(null);

  const handleControlledChange = (e) => {
    setControlledBuffer(e.target.value);
    setRenderCount(prev => prev + 1);
  };

  const handleReadDma = () => {
    if (rawInputRef.current) {
      setDmaValue(rawInputRef.current.value);
    }
  };

  const copyCode = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedProtocol(key);
    setTimeout(() => setCopiedProtocol(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Deployer & Spacecraft Hardware Architecture */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rocket size={20} /> SomaiyaPod Deployer &amp; SomaiyaSat Payload Architecture
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Developed in collaboration with <strong>ReOrbit (Finland)</strong> for autonomous LEO PocketQube deployment and multi-mode amateur communication.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: '#04060a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#38bdf8', marginBottom: '0.75rem' }}>
              SomaiyaSat 1PQ Specifications
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#34d399" /> Form Factor: 1PQ PocketQube (5 cm &times; 5 cm &times; 5 cm)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#34d399" /> Power Budget: &lt; 1W sub-watt average orbital power
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#34d399" /> Multi-Mode Payloads: M17, Codec2, SSTV, TT&amp;C / Housekeeping
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#34d399" /> Microcontroller: Low-Power SoC with Onboard AI Inference
              </li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#04060a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#a7f3d0', marginBottom: '0.75rem' }}>
              SomaiyaPod Deployer Mechanism
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#a7f3d0" /> Controlled orbital insertion &amp; spring-loaded release
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#a7f3d0" /> Redundant separation switches &amp; deployment telemetry beacon
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#a7f3d0" /> RF deployment verification handshake protocol
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} color="#a7f3d0" /> Compatible with ISRO PSLV / SSLV deployer racks
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ground Station Command Software & State Architecture */}
      <div style={{
        backgroundColor: '#04060a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Cpu size={22} color="#38bdf8" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
              Ground Station Command Software &amp; State Architecture
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              React Virtual DOM and Single Source of Truth architecture for real-time telemetry validation and command uplink.
            </p>
          </div>
        </div>

        {/* Controlled vs Uncontrolled Interactive Telemetry Buffer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Controlled Buffer */}
          <div style={{
            backgroundColor: '#04060a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem' }}>
                <Zap size={16} /> Controlled State Buffer (useState)
              </div>
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                Sync Updates: {renderCount}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Every keystroke updates React state (Single Source of Truth), executing real-time sanitization and input validation.
            </p>
            <input
              type="text"
              value={controlledBuffer}
              onChange={handleControlledChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: '#020408',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: '0.75rem'
              }}
            />
            <div style={{
              backgroundColor: '#020408',
              padding: '0.65rem',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#a5f3fc'
            }}>
              <div>Buffer Length: {controlledBuffer.length} bytes</div>
              <div>Normalized Hex: {controlledBuffer.toUpperCase().slice(0, 24)}...</div>
            </div>
          </div>

          {/* Uncontrolled Buffer */}
          <div style={{
            backgroundColor: '#04060a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: '700', fontSize: '0.92rem' }}>
                <Layers size={16} /> Direct DMA Stream (useRef)
              </div>
              <span style={{ fontSize: '0.72rem', color: '#c084fc', backgroundColor: 'rgba(168, 85, 247, 0.15)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                Raw Hardware Stream
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Direct DOM buffer for high-frequency raw telemetry streaming without triggering component re-renders.
            </p>
            <input
              type="text"
              ref={rawInputRef}
              defaultValue="RAW_DMA_PACKET_STREAM"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: '#020408',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: '0.75rem'
              }}
            />
            <button
              type="button"
              onClick={handleReadDma}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #00f0ff',
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                color: '#00f0ff',
                fontWeight: '700',
                fontSize: '0.78rem',
                cursor: 'pointer',
                marginBottom: '0.75rem'
              }}
            >
              Read Raw Stream via inputRef.current.value
            </button>
            <div style={{
              backgroundColor: '#020408',
              padding: '0.65rem',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#e9d5ff'
            }}>
              Captured Value: "{dmaValue || 'Click read button above'}"
            </div>
          </div>
        </div>

        {/* Developer Command Protocols & Specifications */}
        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={18} color="#34d399" /> Ground Command Developer Protocols &amp; Specifications
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {/* Protocol 01 */}
          <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.92rem' }}>
                PROTOCOL 01 // Controlled vs Uncontrolled Component Architecture
              </span>
              <button
                onClick={() => copyCode(`// Controlled React Component\nconst [callsign, setCallsign] = useState('');\n<input value={callsign} onChange={(e) => setCallsign(e.target.value)} />\n\n// Uncontrolled Component\nconst packetRef = useRef(null);\n<input type="text" ref={packetRef} />`, 'p1')}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
              >
                <Copy size={13} /> {copiedProtocol === 'p1' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: '1.6' }}>
              Controlled components keep input data strictly synchronized in React state (Single Source of Truth), ensuring instant validation and predictable data flow. Uncontrolled components maintain state internally in the DOM and are queried on-demand using <code>useRef</code>.
            </p>
          </div>

          {/* Protocol 02 */}
          <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '700', color: '#34d399', fontSize: '0.92rem' }}>
                PROTOCOL 02 // Operator Authentication Gateway Reference Implementation
              </span>
              <button
                onClick={() => copyCode(`import React, { useState } from 'react';\n\nexport default function OperatorLogin() {\n  const [username, setUsername] = useState('');\n  const [password, setPassword] = useState('');\n  const [error, setError] = useState('');\n\n  const handleLogin = (e) => {\n    e.preventDefault();\n    if (!username.trim() || !password.trim()) {\n      setError('Operator ID and Passcode are required.');\n      return;\n    }\n    setError('');\n    console.log('Operator Authenticated:', { username });\n  };\n\n  return (\n    <form onSubmit={handleLogin}>\n      {error && <div style={{ color: 'red' }}>{error}</div>}\n      <input placeholder="Operator ID" value={username} onChange={e => setUsername(e.target.value)} />\n      <input type="password" placeholder="Passcode" value={password} onChange={e => setPassword(e.target.value)} />\n      <button type="submit">Sign In</button>\n    </form>\n  );\n}`, 'p2')}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
              >
                <Copy size={13} /> {copiedProtocol === 'p2' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: '1.6' }}>
              Reference React component demonstrating controlled username and password validation with <code>event.preventDefault()</code> and instant error feedback.
            </p>
          </div>

          {/* Protocol 03 */}
          <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.25rem' }}>
            <span style={{ fontWeight: '700', color: '#c084fc', fontSize: '0.92rem', display: 'block', marginBottom: '0.5rem' }}>
              PROTOCOL 03 // 5-Stage Telemetry Submission Lifecycle
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <div style={{ backgroundColor: '#020408', padding: '8px', borderRadius: '6px' }}>1. Attach <code>onSubmit</code> handler</div>
              <div style={{ backgroundColor: '#020408', padding: '8px', borderRadius: '6px' }}>2. Execute <code>e.preventDefault()</code></div>
              <div style={{ backgroundColor: '#020408', padding: '8px', borderRadius: '6px' }}>3. Validate constraints (regex/@, length &ge; 6)</div>
              <div style={{ backgroundColor: '#020408', padding: '8px', borderRadius: '6px' }}>4. Dispatch telemetry to orbital node</div>
              <div style={{ backgroundColor: '#020408', padding: '8px', borderRadius: '6px' }}>5. Receive ACK &amp; log transmission</div>
            </div>
          </div>

          {/* Protocol 04 */}
          <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.25rem' }}>
            <span style={{ fontWeight: '700', color: '#f59e0b', fontSize: '0.92rem', display: 'block', marginBottom: '0.5rem' }}>
              PROTOCOL 04 // Advantages of Controlled State Architecture in Critical Space Applications
            </span>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: '1.6' }}>
              Guarantees zero discrepancies between UI and memory, enables instant input validation, supports dynamic parameter formatting, and simplifies telemetry streaming into React Context.
            </p>
          </div>
        </div>

        {/* Technical Standards & Compliance Links */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            ITU Amateur Radio Open Access &bull; Dreamtech Web Technologies Reference &bull; React 18 Architecture
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://legacy.reactjs.org/docs/forms.html" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              React Forms API <ExternalLink size={12} />
            </a>
            <a href="https://react-hook-form.com/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              React Hook Form <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
