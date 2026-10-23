import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Send,
  CheckCircle2,
  HardDrive,
  Cpu,
  Radio,
  Activity,
  Layers,
  Clock,
  ArrowRight,
  Server,
  FileText,
  Zap,
  Globe,
} from 'lucide-react';

export default function GroundSupport() {
  const navigate = useNavigate();

  // Inquiry Form State (Experiment 9 useNavigate)
  const [operatorCallsign, setOperatorCallsign] = useState('');
  const [inquiryType, setInquiryType] = useState('Operational Status');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }), []);
  const [submitStage, setSubmitStage] = useState(0); // 0: idle, 1: HTTP, 2: fs, 3: events, 4: complete
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // Active Lab Tab for Experiment 7 (Node.js Core Modules)
  const [activeTab, setActiveTab] = useState('http'); // 'http' | 'fs' | 'events' | 'os' | 'loop'

  // Virtual File System State
  const [fsLog, setFsLog] = useState([
    { timestamp: '2026-09-23T08:00:12Z', file: '/var/log/ground.log', bytes: 142, content: 'BOOT: Ground Node initialized on port 8080' },
    { timestamp: '2026-09-23T08:15:30Z', file: '/var/log/ground.log', bytes: 88, content: 'AUTH: Operator W3XYZ logged in via session token' },
  ]);

  // Virtual Event Bus State
  const [eventLogs, setEventLogs] = useState([
    { id: 1, event: 'node:ready', time: 'T-00:05', payload: '{ port: 8080, protocol: "HTTP/1.1" }' },
    { id: 2, event: 'telemetry:poll', time: 'T-00:02', payload: '{ packets: 24, snr: "18.4 dB" }' },
  ]);

  // Form Submission Handler (simulates Node.js pipeline & triggers useNavigate)
  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setSubmitStage(1); // Stage 1: HTTP

    // Stage 1: HTTP Request Simulation
    timers.current.push(setTimeout(() => {
      setSubmitStage(2); // Stage 2: fs.appendFile
      const newEntry = {
        timestamp: new Date().toISOString(),
        file: '/var/log/inquiries.log',
        bytes: 64 + message.length,
        content: 'INQUIRY [' + (operatorCallsign || 'GUEST') + ']: ' + message.slice(0, 45) + '...',
      };
      setFsLog((prev) => [newEntry, ...prev]);

      // Stage 3: EventEmitter
      timers.current.push(setTimeout(() => {
        setSubmitStage(3);
        setEventLogs((prev) => [
          {
            id: Date.now(),
            event: 'ground:inquiry:received',
            time: 'NOW',
            payload: JSON.stringify({ from: operatorCallsign || 'ANONYMOUS', type: inquiryType }),
          },
          ...prev,
        ]);

        // Stage 4: Success & Countdown to useNavigate()
        timers.current.push(setTimeout(() => {
          setSubmitStage(4);
          let count = 3;
          setRedirectCountdown(count);
          const interval = setInterval(() => {
            count -= 1;
            setRedirectCountdown(count);
            if (count <= 0) {
              clearInterval(interval);
              // Programmatic navigation to dispatches
              navigate('/dispatches');
            }
          }, 1000);
          timers.current.push(interval);
        }, 800));
      }, 800));
    }, 800));
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3.5rem 1.5rem 6rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: '#00e5ff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            NODE.JS GATEWAY
          </span>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            ROUTER HOOK: useNavigate()
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', color: '#f0f2f5', marginBottom: '0.85rem' }}>
          GROUND SUPPORT &amp; NODE.JS GATEWAY CONSOLE
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '820px', lineHeight: 1.6 }}>
          Submit mission inquiries through a simulated Node.js HTTP server. Under the hood, this terminal orchestrates the HTTP request-response cycle, writes audit records to a virtual file system via fs, emits telemetry bus events, and uses programmatic navigation to redirect to live dispatches.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '2rem' }}>
        {/* Left Column: Command & Inquiry Dispatcher Form */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            backgroundColor: '#0a0e18',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
            <Terminal size={22} color="#00e5ff" />
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5' }}>Ground Inquiry Dispatcher</h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#64748b' }}>
                Simulated Node.js Gateway Pipeline
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Operator Callsign / Station
              </label>
              <input
                type="text"
                value={operatorCallsign}
                onChange={(e) => setOperatorCallsign(e.target.value)}
                placeholder="e.g. VU2SOM or GroundStation-Alpha"
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

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Inquiry Category
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
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
              >
                <option value="Operational Status">Operational Status &amp; Link Health</option>
                <option value="SSTV Pass Schedule">SSTV Pass Schedule Request</option>
                <option value="M17 Voice Beacon">M17 Digital Voice Beacon Confirmation</option>
                <option value="General Technical Inquiry">General Technical Inquiry</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Inquiry / Telecommand Transmission
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter technical query or operator pass report..."
                required
                rows={4}
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
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Pipeline Stage Visualizer during submission */}
            {submitting && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(6, 8, 16, 0.9)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: submitStage >= 1 ? '#00e5ff' : '#64748b' }}>
                    [1] HTTP POST /api/inquiry (Status: {submitStage >= 1 ? '200 OK' : 'Pending'})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: submitStage >= 2 ? '#10b981' : '#64748b' }}>
                    [2] fs.appendFile('/var/log/inquiries.log') ({submitStage >= 2 ? 'COMMITTED' : 'Waiting'})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: submitStage >= 3 ? '#f59e0b' : '#64748b' }}>
                    [3] EventEmitter.emit('ground:inquiry:received') ({submitStage >= 3 ? 'DISPATCHED' : 'Waiting'})
                  </span>
                </div>
                {submitStage === 4 && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '4px', color: '#34d399', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} />
                    <span>Inquiry processed! Redirecting via useNavigate() in {redirectCountdown}s...</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '0.5rem',
                padding: '0.9rem',
                backgroundColor: '#00e5ff',
                border: 'none',
                borderRadius: '8px',
                color: '#04060a',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(0, 229, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              <Send size={16} />
              <span>{submitting ? 'TRANSMITTING VIA GATEWAY...' : 'DISPATCH THROUGH NODE.JS GATEWAY'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Node.js Core Modules Interactive Lab */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            backgroundColor: '#0a0e18',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Module Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem', overflowX: 'auto', gap: '0.5rem' }}>
            {[
              { id: 'http', label: 'HTTP Server', icon: Server },
              { id: 'fs', label: 'fs (Filesystem)', icon: HardDrive },
              { id: 'events', label: 'EventEmitter', icon: Zap },
              { id: 'os', label: 'os (System)', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 0.85rem',
                    background: activeTab === tab.id ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #00e5ff' : '2px solid transparent',
                    color: activeTab === tab.id ? '#00e5ff' : '#94a3b8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: HTTP Workbench */}
          {activeTab === 'http' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#64748b' }}>
                Node.js http.createServer((req, res) =&gt; ...) Request Lifecycle
              </div>
              <div
                style={{
                  backgroundColor: '#060810',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: '#00e5ff' }}>&gt; HTTP/1.1 200 OK</div>
                <div style={{ color: '#94a3b8' }}>Content-Type: application/json</div>
                <div style={{ color: '#94a3b8' }}>X-Powered-By: Node.js/v20.x</div>
                <div style={{ color: '#94a3b8' }}>X-Ground-Gateway: SomaiyaSat-LEO-01</div>
                <div style={{ color: '#34d399', marginTop: '0.5rem' }}>
                  {JSON.stringify({ status: 'ACK', mode: 'UHF-437.5MHz', packetsInQueue: 3 }, null, 2)}
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Demonstrates asynchronous request parsing, status headers, chunked streaming, and JSON serialization.
              </p>
            </div>
          )}

          {/* Tab 2: fs (Filesystem) */}
          {activeTab === 'fs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#64748b' }}>
                Simulated fs.appendFile() Virtual Audit Stream
              </div>
              <div
                style={{
                  backgroundColor: '#060810',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {fsLog.map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '4px',
                      borderLeft: '2px solid #00e5ff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                      <span>{log.file}</span>
                      <span>{log.bytes} B</span>
                    </div>
                    <div style={{ color: '#f0f2f5', marginTop: '0.2rem' }}>{log.content}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Writes telecommands and inquiries to non-volatile local disk storage using asynchronous streams.
              </p>
            </div>
          )}

          {/* Tab 3: EventEmitter */}
          {activeTab === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#64748b' }}>
                events.EventEmitter Active Broadcast Pipeline
              </div>
              <div
                style={{
                  backgroundColor: '#060810',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {eventLogs.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(245, 158, 11, 0.06)',
                      borderRadius: '4px',
                      borderLeft: '2px solid #f59e0b',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
                      <span>EMIT: {ev.event}</span>
                      <span>{ev.time}</span>
                    </div>
                    <div style={{ color: '#94a3b8', marginTop: '0.2rem', wordBreak: 'break-all' }}>{ev.payload}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Custom event bus decoupling incoming UDP/TCP packets from database storage and telemetry dashboards.
              </p>
            </div>
          )}

          {/* Tab 4: OS Diagnostics */}
          {activeTab === 'os' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#64748b' }}>
                Node.js os Module Host Diagnostics
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ padding: '0.75rem', backgroundColor: '#060810', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#64748b' }}>os.platform()</div>
                  <div style={{ color: '#00e5ff', fontWeight: 600 }}>linux (aarch64)</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#060810', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#64748b' }}>os.uptime()</div>
                  <div style={{ color: '#10b981', fontWeight: 600 }}>314,290 sec</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#060810', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#64748b' }}>os.totalmem()</div>
                  <div style={{ color: '#f0f2f5', fontWeight: 600 }}>16.0 GB RAM</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#060810', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#64748b' }}>os.loadavg()</div>
                  <div style={{ color: '#f59e0b', fontWeight: 600 }}>[0.18, 0.22, 0.15]</div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Monitors system load and telemetry memory utilization to prevent ground station buffer overruns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
