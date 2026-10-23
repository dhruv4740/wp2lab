import React, { useState, useRef } from 'react';
import { Rocket, Cpu, CheckCircle, Zap, Layers, Code2, Copy, ExternalLink } from 'lucide-react';

const box = { backgroundColor: '#04060a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '1.25rem' };
const mono = { fontFamily: 'JetBrains Mono, monospace' };
const inputStyle = { width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', backgroundColor: '#020408', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#ffffff', fontSize: '0.88rem', outline: 'none', marginBottom: '0.75rem', ...mono };
const outputStyle = { backgroundColor: '#020408', padding: '0.65rem', borderRadius: '6px', fontSize: '0.75rem', ...mono };
const bodyText = { color: '#9ca3af', fontSize: '0.82rem', lineHeight: '1.6' };

const CONTROLLED_CODE = `// Controlled React Component
const [callsign, setCallsign] = useState('');
<input value={callsign} onChange={(e) => setCallsign(e.target.value)} />

// Uncontrolled Component
const packetRef = useRef(null);
<input type="text" ref={packetRef} />`;

const LOGIN_CODE = `import React, { useState } from 'react';

export default function OperatorLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Operator ID and Passcode are required.');
      return;
    }
    setError('');
    console.log('Operator Authenticated:', { username });
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input placeholder="Operator ID" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Passcode" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Sign In</button>
    </form>
  );
}`;

const SATELLITE_SPECS = [
  'Form Factor: 1PQ PocketQube (5 cm × 5 cm × 5 cm)',
  'Power Budget: < 1W sub-watt average orbital power',
  'Multi-Mode Payloads: M17, Codec2, SSTV, TT&C / Housekeeping',
  'Microcontroller: Low-Power SoC with Onboard AI Inference',
];

const DEPLOYER_SPECS = [
  'Controlled orbital insertion & spring-loaded release',
  'Redundant separation switches & deployment telemetry beacon',
  'RF deployment verification handshake protocol',
  'Compatible with ISRO PSLV / SSLV deployer racks',
];

const LIFECYCLE = [
  <>1. Attach <code>onSubmit</code> handler</>,
  <>2. Execute <code>e.preventDefault()</code></>,
  '3. Validate constraints (regex/@, length ≥ 6)',
  '4. Dispatch telemetry to orbital node',
  '5. Receive ACK & log transmission',
];

function SpecCard({ title, titleColor, iconColor, items }) {
  return (
    <div style={box}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: titleColor, marginBottom: '0.75rem' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((text) => (
          <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color={iconColor} /> {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// One protocol card; if `code` is given it shows a Copy button.
function Protocol({ title, color, code, children }) {
  // useState: remembers whether the Copy button was just pressed
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ ...box, borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: '700', color, fontSize: '0.92rem' }}>{title}</span>
        {code && (
          <button onClick={copy} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
            <Copy size={13} /> {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Company() {
  // useState: controlled input, React state is the single source of truth
  const [controlledBuffer, setControlledBuffer] = useState('CMD_TELEMETRY_SYNC');
  const [renderCount, setRenderCount] = useState(0);
  // useRef: uncontrolled input, the value is read from the DOM only when needed
  const rawInputRef = useRef(null);
  const [dmaValue, setDmaValue] = useState('');

  const handleControlledChange = (e) => {
    setControlledBuffer(e.target.value);
    setRenderCount((count) => count + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rocket size={20} /> SomaiyaPod Deployer &amp; SomaiyaSat Payload Architecture
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Developed in collaboration with <strong>ReOrbit (Finland)</strong> for autonomous LEO PocketQube deployment and multi-mode amateur communication.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
          <SpecCard title="SomaiyaSat 1PQ Specifications" titleColor="#38bdf8" iconColor="#34d399" items={SATELLITE_SPECS} />
          <SpecCard title="SomaiyaPod Deployer Mechanism" titleColor="#a7f3d0" iconColor="#a7f3d0" items={DEPLOYER_SPECS} />
        </div>
      </div>

      <div style={{ ...box, padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Cpu size={22} color="#38bdf8" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>Ground Station Command Software &amp; State Architecture</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              React Virtual DOM and Single Source of Truth architecture for real-time telemetry validation and command uplink.
            </p>
          </div>
        </div>

        {/* Controlled vs uncontrolled input, side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', margin: '1.25rem 0 2rem' }}>
          <div style={box}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem' }}>
                <Zap size={16} /> Controlled State Buffer (useState)
              </div>
              <span style={{ ...mono, fontSize: '0.72rem', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Sync Updates: {renderCount}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Every keystroke updates React state (Single Source of Truth), executing real-time sanitization and input validation.
            </p>
            <input type="text" value={controlledBuffer} onChange={handleControlledChange} style={inputStyle} />
            <div style={{ ...outputStyle, color: '#a5f3fc' }}>
              <div>Buffer Length: {controlledBuffer.length} bytes</div>
              <div>Normalized Hex: {controlledBuffer.toUpperCase().slice(0, 24)}...</div>
            </div>
          </div>

          <div style={box}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: '700', fontSize: '0.92rem' }}>
                <Layers size={16} /> Direct DMA Stream (useRef)
              </div>
              <span style={{ ...mono, fontSize: '0.72rem', color: '#c084fc', backgroundColor: 'rgba(168, 85, 247, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Raw Hardware Stream
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Direct DOM buffer for high-frequency raw telemetry streaming without triggering component re-renders.
            </p>
            <input type="text" ref={rawInputRef} defaultValue="RAW_DMA_PACKET_STREAM" style={inputStyle} />
            <button
              type="button"
              onClick={() => setDmaValue(rawInputRef.current.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #00f0ff', backgroundColor: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', marginBottom: '0.75rem' }}
            >
              Read Raw Stream via inputRef.current.value
            </button>
            <div style={{ ...outputStyle, color: '#e9d5ff' }}>Captured Value: "{dmaValue || 'Click read button above'}"</div>
          </div>
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={18} color="#34d399" /> Ground Command Developer Protocols &amp; Specifications
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <Protocol title="PROTOCOL 01 // Controlled vs Uncontrolled Component Architecture" color="#38bdf8" code={CONTROLLED_CODE}>
            <p style={bodyText}>
              Controlled components keep input data strictly synchronized in React state (Single Source of Truth), ensuring instant validation and predictable data flow. Uncontrolled components maintain state internally in the DOM and are queried on-demand using <code>useRef</code>.
            </p>
          </Protocol>

          <Protocol title="PROTOCOL 02 // Operator Authentication Gateway Reference Implementation" color="#34d399" code={LOGIN_CODE}>
            <p style={bodyText}>
              Reference React component demonstrating controlled username and password validation with <code>event.preventDefault()</code> and instant error feedback.
            </p>
          </Protocol>

          <Protocol title="PROTOCOL 03 // 5-Stage Telemetry Submission Lifecycle" color="#c084fc">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              {LIFECYCLE.map((step, i) => (
                <div key={i} style={{ backgroundColor: '#020408', padding: '8px', borderRadius: '6px' }}>{step}</div>
              ))}
            </div>
          </Protocol>

          <Protocol title="PROTOCOL 04 // Advantages of Controlled State Architecture in Critical Space Applications" color="#f59e0b">
            <p style={bodyText}>
              Guarantees zero discrepancies between UI and memory, enables instant input validation, supports dynamic parameter formatting, and simplifies telemetry streaming into React Context.
            </p>
          </Protocol>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div>ITU Amateur Radio Open Access &bull; Dreamtech Web Technologies Reference &bull; React 18 Architecture</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[['React Forms API', 'https://legacy.reactjs.org/docs/forms.html'], ['React Hook Form', 'https://react-hook-form.com/']].map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
