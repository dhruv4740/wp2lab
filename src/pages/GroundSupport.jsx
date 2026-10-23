import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Send, CheckCircle2, AlertCircle } from 'lucide-react';

// Node.js ground-station server (plain http module)
const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080/api';

// Shared styles
const label = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' };
const field = { width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(6, 8, 16, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '6px', color: '#f0f2f5', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' };
const panel = { padding: '2rem', backgroundColor: '#0a0e18', borderRadius: '16px' };
const note = { fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 };
const logBox = { backgroundColor: '#060810', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' };
const logRow = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', borderLeft: '2px solid #00e5ff' };

const TABS = [
  { id: 'http', label: 'HTTP Server' },
  { id: 'fs', label: 'fs (Filesystem)' },
  { id: 'events', label: 'EventEmitter' },
];

export default function GroundSupport() {
  const navigate = useNavigate();

  // Controlled form inputs
  const [callsign, setCallsign] = useState('');
  const [category, setCategory] = useState('Operational Status');
  const [message, setMessage] = useState('');

  // 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle');
  const [countdown, setCountdown] = useState(3);

  const [activeTab, setActiveTab] = useState('http');
  const [health, setHealth] = useState(null); // reply of GET /api/health
  const [records, setRecords] = useState([]); // replies of POST /api/telecommand

  // useEffect: runs once on load and asks the Node server for its health (http module)
  useEffect(() => {
    fetch(GATEWAY + '/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  // useEffect: after a successful send, counts down once per second, then navigates
  useEffect(() => {
    if (status !== 'sent') return;
    if (countdown === 0) {
      navigate('/dispatches'); // useNavigate: change page from code
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [status, countdown, navigate]);

  // POST the form to the Node server, which appends it to a log file with fs.appendFile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(GATEWAY + '/telecommand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opcode: category,
          operatorCallsign: callsign || 'GUEST',
          hexPayload: message,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setRecords((prev) => [data.record, ...prev]);
      setCountdown(3);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const busy = status === 'sending' || status === 'sent';

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00e5ff', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
          NODE.JS GATEWAY
        </span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', color: '#f0f2f5', margin: '0.6rem 0 0.85rem' }}>
          Ground Support Gateway
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '820px', lineHeight: 1.6 }}>
          This form sends a real HTTP request to our Node.js server on port 8080. The server writes it to a log file with fs, announces it with an EventEmitter, and replies in JSON. React then redirects with useNavigate.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '2rem' }}>
        {/* Left: inquiry form */}
        <div className="glass-panel" style={{ ...panel, border: '1px solid rgba(0, 229, 255, 0.25)' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={22} color="#00e5ff" />
            <span>Ground Inquiry Dispatcher</span>
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={label}>Operator Callsign / Station</label>
              <input type="text" value={callsign} onChange={(e) => setCallsign(e.target.value)} placeholder="e.g. VU2SOM" style={field} />
            </div>

            <div>
              <label style={label}>Inquiry Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={field}>
                <option>Operational Status</option>
                <option>SSTV Pass Schedule</option>
                <option>M17 Voice Beacon</option>
                <option>General Technical Inquiry</option>
              </select>
            </div>

            <div>
              <label style={label}>Inquiry / Telecommand Transmission</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter technical query or pass report..." required rows={4} style={{ ...field, resize: 'vertical' }} />
            </div>

            {status === 'sent' && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>Server replied 201. Redirecting to dispatches in {countdown}s...</span>
              </div>
            )}
            {status === 'error' && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(244, 63, 94, 0.12)', borderRadius: '6px', color: '#fb7185', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>Could not reach the Node server on port 8080. Run: npm run server</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              style={{ padding: '0.9rem', backgroundColor: '#00e5ff', border: 'none', borderRadius: '8px', color: '#04060a', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Send size={16} />
              <span>{status === 'sending' ? 'SENDING...' : 'SEND TO NODE.JS GATEWAY'}</span>
            </button>
          </form>
        </div>

        {/* Right: what the Node server does, one tab per core module */}
        <div className="glass-panel" style={{ ...panel, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{ padding: '0.65rem 0.85rem', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #00e5ff' : '2px solid transparent', color: activeTab === tab.id ? '#00e5ff' : '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeTab === 'http' && (
              <>
                <div style={{ ...logBox, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#34d399', whiteSpace: 'pre-wrap' }}>
                  {health ? 'GET /api/health\n' + JSON.stringify(health, null, 2) : 'Server on port 8080 is not reachable.'}
                </div>
                <p style={note}>http.createServer reads the request and writes a status code and a JSON body.</p>
              </>
            )}

            {activeTab === 'fs' && (
              <>
                <div style={logBox}>
                  {records.length === 0 && <div style={{ ...note, fontFamily: 'var(--font-mono)' }}>No inquiries sent yet.</div>}
                  {records.map((r) => (
                    <div key={r.commandId} style={logRow}>
                      <div style={{ color: '#64748b' }}>{r.timestamp}</div>
                      <div style={{ color: '#f0f2f5' }}>{r.commandId} / {r.operatorCallsign}: {r.hexPayload}</div>
                    </div>
                  ))}
                </div>
                <p style={note}>Each reply below was appended to the server's command log with fs.appendFile.</p>
              </>
            )}

            {activeTab === 'events' && (
              <>
                <div style={logBox}>
                  {records.length === 0 && <div style={{ ...note, fontFamily: 'var(--font-mono)' }}>No events yet.</div>}
                  {records.map((r) => (
                    <div key={r.commandId} style={{ ...logRow, borderLeftColor: '#f59e0b', color: '#f59e0b' }}>
                      EMIT telecommand:received ({r.opcode})
                    </div>
                  ))}
                </div>
                <p style={note}>The server calls emit() for every request; other parts of the server listen with on().</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
