import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  Cpu,
  Terminal,
  Activity,
  Radio,
  FileCode,
  HardDrive,
  Clock,
  Play,
  Square,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  Layers,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Wifi,
  Database,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NodeServerConsole() {
  const { user } = useAuth();

  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState('http'); // 'http' | 'fs' | 'events' | 'os' | 'loop'

  // --- Server State ---
  const [serverOnline, setServerOnline] = useState(true);
  const [serverPort, setServerPort] = useState(8080);
  const [uptimeSeconds, setUptimeSeconds] = useState(1420);
  const [requestCount, setRequestCount] = useState(84);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // --- HTTP Client Workbench State ---
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/telemetry');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [postPayload, setPostPayload] = useState(JSON.stringify({
    opcode: '0x3F_ACTIVATE_SSTV_BEACON',
    target: 'SomaiyaSat-1',
    operatorCallsign: 'VU2-SOMI-CONSOLE',
    hexPayload: '0xAA 0x55 0x3F 0x01 0xFE'
  }, null, 2));

  const [clientLoading, setClientLoading] = useState(false);
  const [clientResponse, setClientResponse] = useState({
    statusCode: 200,
    statusText: 'OK',
    durationMs: 4.2,
    contentType: 'application/json',
    sizeBytes: 642,
    headers: {
      'content-type': 'application/json',
      'x-node-module': 'http + fs (async)',
      'x-powered-by': 'Node.js V8 Engine'
    },
    data: {
      satellite: 'SomaiyaSat-1 (1PQ)',
      deployer: 'SomaiyaPod',
      timestamp: new Date().toISOString(),
      orbit: { altitudeKm: 550, inclinationDeg: 97.4, orbitalPeriodMin: 94.2 },
      power: { batteryPercent: 88, solarVoltageV: '4.24', busCurrentMa: 195 },
      rfLink: { carrierFreqMhz: 437.0000, mode: 'M17 / Codec2 / SSTV / TT&C', snrDb: '18.4', rssiDbm: -94 }
    }
  });

  // --- Event Loop Visualizer State ---
  const [callStack, setCallStack] = useState([]);
  const [threadPool, setThreadPool] = useState([]);
  const [microtasks, setMicrotasks] = useState([]);
  const [eventQueue, setEventQueue] = useState([]);
  const [loopActivePhase, setLoopActivePhase] = useState('Poll (I/O)');
  const [isSimulatingLoop, setIsSimulatingLoop] = useState(false);

  // --- File System (fs) State ---
  const [selectedFile, setSelectedFile] = useState('public/flight_manifest.html');
  const [logEntries, setLogEntries] = useState([
    `[${new Date(Date.now() - 360000).toISOString()}] SAT=SomaiyaSat-1 BAT=92% SNR=18.4dB VOLT=4.22V`,
    `[${new Date(Date.now() - 240000).toISOString()}] SAT=SomaiyaSat-1 BAT=90% SNR=17.9dB VOLT=4.20V`,
    `[${new Date(Date.now() - 120000).toISOString()}] SAT=SomaiyaSat-1 BAT=89% SNR=18.1dB VOLT=4.19V`,
    `[${new Date().toISOString()}] SAT=SomaiyaSat-1 BAT=88% SNR=18.4dB VOLT=4.24V`
  ]);
  const [fsOpStatus, setFsOpStatus] = useState('');

  // --- EventEmitter State ---
  const [stationEventsLog, setStationEventsLog] = useState([
    { id: 'EVT-101', type: 'station:start', detail: 'Node.js HTTP Gateway initialized on port 8080', time: '12:00:00 UTC' },
    { id: 'EVT-102', type: 'telemetry:logged', detail: 'SomaiyaSat-1 orbital packet written to telemetry.log (BAT: 88%)', time: '12:05:12 UTC' },
    { id: 'EVT-103', type: 'manifest:accessed', detail: 'Static HTML flight manifest streamed via fs.readFile', time: '12:08:44 UTC' }
  ]);

  // --- Server Terminal Logs ---
  const [terminalLogs, setTerminalLogs] = useState([
    '[INIT] Node.js runtime active (v20.11.0, V8 12.0.267.17)',
    `[HTTP] Server listening on http://localhost:8080`,
    '[FS] Initialized log stream directory /logs/telemetry.log',
    '[EVENT] station:start listener registered',
    '[ROUTER] Mounted endpoints: /manifest.html, /api/telemetry, /api/health, /api/telecommand',
    `[READY] Ground Station Node.js Daemon running nominal`
  ]);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Uptime counter
  useEffect(() => {
    const timer = setInterval(() => {
      if (serverOnline) {
        setUptimeSeconds(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [serverOnline]);

  const formatUptime = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addTerminalLog = (text) => {
    setTerminalLogs(prev => [...prev.slice(-40), `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  // -------------------------------------------------------------------------
  // HTTP Client Request Dispatcher
  // -------------------------------------------------------------------------
  const executeHttpClientRequest = async () => {
    if (!serverOnline) {
      alert('Node.js Ground Station Server is currently OFFLINE. Please start the server first.');
      return;
    }

    setClientLoading(true);
    const startTime = performance.now();
    setRequestCount(prev => prev + 1);

    addTerminalLog(`HTTP CLIENT -> ${httpMethod} ${selectedEndpoint}`);

    // Push into Event Loop Visualizer Call Stack
    triggerEventLoopTask(`http.${httpMethod.toLowerCase()}('${selectedEndpoint}')`, 'HTTP_IO');

    try {
      // First try fetching from live local server if running
      let isLive = false;
      let data = null;
      let headersObj = {};
      let status = 200;
      let statusText = 'OK';

      try {
        const fetchUrl = selectedEndpoint === '/manifest.html' 
          ? '/flight_manifest.html' 
          : selectedEndpoint;
        
        const res = await fetch(`http://localhost:${serverPort}${selectedEndpoint}`, {
          method: httpMethod,
          headers: httpMethod === 'POST' ? { 'Content-Type': 'application/json' } : {},
          body: httpMethod === 'POST' ? postPayload : undefined
        });

        if (res.ok || res.status === 201) {
          isLive = true;
          status = res.status;
          statusText = res.statusText || (status === 201 ? 'Created' : 'OK');
          res.headers.forEach((val, key) => { headersObj[key] = val; });
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await res.json();
          } else {
            data = await res.text();
          }
        }
      } catch (e) {
        // Fallback to simulated high-fidelity Node response if standalone daemon is not running locally
      }

      const duration = Math.round(performance.now() - startTime) + 3;

      if (!isLive) {
        // Simulated Node Server Internal Logic (exact mirror of groundStationServer.js)
        if (selectedEndpoint === '/manifest.html' || selectedEndpoint === '/') {
          status = 200;
          statusText = 'OK';
          headersObj = {
            'content-type': 'text/html; charset=utf-8',
            'x-node-module': 'fs.readFile + http.createServer',
            'x-payload-type': 'SomaiyaSat-Flight-Manifest',
            'x-powered-by': 'Node.js V8 Engine'
          };
          data = `<!DOCTYPE html>\n<html>\n  <head><title>SomaiyaSat-1 Orbital Flight Manifest</title></head>\n  <body>\n    <h1>SOMAIYASAT-1 ORBITAL FLIGHT MANIFEST</h1>\n    <p>Served via Node.js fs.readFile()</p>\n    <p>Target Orbit: 550 km SSO | Frequency: 437.0000 MHz</p>\n  </body>\n</html>`;
        } else if (selectedEndpoint === '/api/telemetry') {
          status = 200;
          statusText = 'OK';
          headersObj = {
            'content-type': 'application/json',
            'x-node-module': 'http + fs.appendFile (async)',
            'x-event-dispatched': 'telemetry:logged'
          };
          data = {
            satellite: 'SomaiyaSat-1 (1PQ)',
            deployer: 'SomaiyaPod',
            timestamp: new Date().toISOString(),
            orbit: { altitudeKm: 550, inclinationDeg: 97.4, orbitalPeriodMin: 94.2, velocityKmh: 27500 },
            power: { batteryPercent: Math.floor(82 + Math.random() * 12), solarVoltageV: (4.18 + Math.random() * 0.1).toFixed(2), busCurrentMa: 192 },
            rfLink: { carrierFreqMhz: 437.0000, mode: 'M17 / Codec2 / SSTV / TT&C', snrDb: (17.5 + Math.random() * 3).toFixed(1), rssiDbm: -96 }
          };
          // Append log
          const newEntry = `[${data.timestamp}] SAT=${data.satellite} BAT=${data.power.batteryPercent}% SNR=${data.rfLink.snrDb}dB VOLT=${data.power.solarVoltageV}V`;
          setLogEntries(prev => [...prev.slice(-15), newEntry]);
        } else if (selectedEndpoint === '/api/health') {
          status = 200;
          statusText = 'OK';
          headersObj = { 'content-type': 'application/json' };
          data = {
            station: 'SomaiyaSat Ground Terminal Alpha',
            callsign: 'VU2-SOMI',
            status: 'HEALTHY',
            timestamp: new Date().toISOString(),
            nodeRuntime: {
              nodeVersion: 'v20.11.0',
              v8Version: '12.0.267.17',
              uptimeSeconds: uptimeSeconds,
              memoryUsageMb: { rss: '38.45', heapTotal: '18.20', heapUsed: '12.44' },
              pid: 14892
            },
            hostSystem: {
              platform: 'win32',
              arch: 'x64',
              hostname: 'ground-station-node-01',
              cpusCount: 8,
              totalMemoryGb: '16.00',
              freeMemoryGb: '8.42'
            }
          };
        } else if (selectedEndpoint === '/api/telecommand') {
          status = 201;
          statusText = 'Created';
          headersObj = { 'content-type': 'application/json' };
          let parsedBody = {};
          try { parsedBody = JSON.parse(postPayload); } catch (err) { parsedBody = {}; }
          data = {
            success: true,
            message: 'Telecommand ingested via Node.js stream and appended to telecommands.log',
            record: {
              commandId: `CMD-${Date.now()}`,
              opcode: parsedBody.opcode || '0x01_PING',
              target: parsedBody.target || 'SomaiyaSat-1',
              operatorCallsign: parsedBody.operatorCallsign || (user?.callsign || 'VU2-OPERATOR'),
              timestamp: new Date().toISOString(),
              status: 'DISPATCHED_TO_UPLINK_QUEUE'
            }
          };
          addStationEvent('telecommand:received', `Telecommand ${data.record.opcode} queued for satellite`);
        } else if (selectedEndpoint === '/api/events') {
          status = 200;
          statusText = 'OK';
          headersObj = { 'content-type': 'application/json' };
          data = { count: stationEventsLog.length, events: stationEventsLog };
        } else if (selectedEndpoint === '/api/logs') {
          status = 200;
          statusText = 'OK';
          headersObj = { 'content-type': 'application/json' };
          data = { file: 'telemetry.log', linesCount: logEntries.length, entries: logEntries };
        }
      }

      setClientResponse({
        statusCode: status,
        statusText: statusText,
        durationMs: duration,
        contentType: headersObj['content-type'] || 'application/json',
        sizeBytes: typeof data === 'string' ? data.length : JSON.stringify(data).length,
        headers: headersObj,
        data: data
      });

      addTerminalLog(`HTTP SERVER 200 OK (${duration}ms) - Content-Type: ${headersObj['content-type'] || 'application/json'}`);
    } catch (err) {
      addTerminalLog(`[ERROR] HTTP Request failed: ${err.message}`);
    } finally {
      setClientLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Event Loop Interactive Simulation
  // -------------------------------------------------------------------------
  const triggerEventLoopTask = (label, type) => {
    setIsSimulatingLoop(true);
    setCallStack(prev => [...prev, { id: Date.now(), label, type }]);

    setTimeout(() => {
      // Move from Call stack to Libuv Thread Pool or Microtask
      setCallStack(prev => prev.filter(item => item.label !== label));

      if (type === 'FS_READ' || type === 'HTTP_IO') {
        setThreadPool(prev => [...prev, { id: Date.now(), label: `Libuv Worker: ${label}`, status: 'Executing I/O' }]);
        setLoopActivePhase('Poll Phase (Libuv I/O)');

        setTimeout(() => {
          setThreadPool(prev => prev.slice(1));
          setEventQueue(prev => [...prev, { id: Date.now(), label: `Callback: onComplete(${label})` }]);

          setTimeout(() => {
            setLoopActivePhase('Check Phase (setImmediate)');
            setEventQueue(prev => prev.slice(1));
            setIsSimulatingLoop(false);
          }, 600);
        }, 800);
      } else if (type === 'PROMISE') {
        setMicrotasks(prev => [...prev, { id: Date.now(), label: `Microtask: Promise.then(${label})` }]);
        setTimeout(() => {
          setMicrotasks(prev => prev.slice(1));
          setIsSimulatingLoop(false);
        }, 500);
      } else {
        setIsSimulatingLoop(false);
      }
    }, 400);
  };

  // -------------------------------------------------------------------------
  // EventEmitter Helper
  // -------------------------------------------------------------------------
  const addStationEvent = (type, detail) => {
    const newEvt = {
      id: `EVT-${Date.now()}`,
      type,
      detail,
      time: new Date().toLocaleTimeString() + ' UTC'
    };
    setStationEventsLog(prev => [newEvt, ...prev.slice(0, 19)]);
    addTerminalLog(`[EVENT EMITTED] ${type} -> ${detail}`);
  };

  // -------------------------------------------------------------------------
  // File System (fs) Operations Simulation
  // -------------------------------------------------------------------------
  const triggerFsOperation = (opType) => {
    triggerEventLoopTask(`fs.${opType}()`, 'FS_READ');
    if (opType === 'readFile') {
      setFsOpStatus(`Asynchronously read ${selectedFile} (Size: 3.4 KB, Mode: UTF-8) via fs.readFile()`);
      addTerminalLog(`[FS] fs.readFile("${selectedFile}", "utf8", callback) executed non-blocking`);
    } else if (opType === 'appendFile') {
      const line = `[${new Date().toISOString()}] SAT=SomaiyaSat-1 BAT=89% SNR=18.6dB OP=MANUAL_APPEND`;
      setLogEntries(prev => [...prev, line]);
      setFsOpStatus(`Appended 1 line to telemetry.log via fs.appendFile()`);
      addTerminalLog(`[FS] fs.appendFile("telemetry.log", data, callback) completed successfully`);
    } else if (opType === 'createReadStream') {
      setFsOpStatus(`Opened high-throughput readable stream via fs.createReadStream() (Chunk size: 64KB)`);
      addTerminalLog(`[FS] Stream piped to HTTP Response: readStream.pipe(res)`);
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', color: '#f8fafc', minHeight: '100vh', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* ================================================================= */}
        {/* 1. TOP HEADER & OPERATIONAL STATUS STRIP */}
        {/* ================================================================= */}
        <div style={{
          backgroundColor: '#080b12',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#04060a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: '#00f0ff'
              }}>
                <Server size={26} color="#f0f9ff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h1 style={{ margin: 0, fontSize: '1.45rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700', color: '#f8fafc' }}>
                    GROUND STATION <span style={{ color: '#38bdf8' }}>NODE.JS</span> GATEWAY
                  </h1>
                  <span style={{
                    backgroundColor: serverOnline ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: serverOnline ? '#34d399' : '#f87171',
                    border: serverOnline ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: serverOnline ? '#34d399' : '#f87171',
                      boxShadow: serverOnline ? '0 0 8px #34d399' : '0 0 8px #f87171'
                    }}></span>
                    {serverOnline ? 'DAEMON ONLINE' : 'DAEMON STOPPED'}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  Event-Driven Microservices &bull; Non-Blocking V8 Runtime &bull; Native <code style={{ color: '#38bdf8' }}>http</code>, <code style={{ color: '#34d399' }}>fs</code>, <code style={{ color: '#c084fc' }}>events</code> &amp; <code style={{ color: '#f59e0b' }}>os</code> Modules
                </p>
              </div>
            </div>

            {/* Server Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Globe size={14} color="#38bdf8" />
                <span>Port:</span>
                <strong style={{ color: '#38bdf8' }}>{serverPort}</strong>
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={14} color="#34d399" />
                <span>Uptime:</span>
                <strong style={{ color: '#34d399' }}>{formatUptime(uptimeSeconds)}</strong>
              </div>

              <button
                onClick={() => {
                  setServerOnline(!serverOnline);
                  addTerminalLog(serverOnline ? '[STATE] Server stopped by operator' : `[STATE] Server started on port ${serverPort}`);
                }}
                style={{
                  backgroundColor: serverOnline ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                  border: serverOnline ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(52, 211, 153, 0.4)',
                  color: serverOnline ? '#f87171' : '#34d399',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {serverOnline ? <Square size={14} /> : <Play size={14} />}
                {serverOnline ? 'Stop Server' : 'Start Server'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>V8 JavaScript Engine</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>v12.0.267.17</div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>HTTP Requests Served</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>{requestCount} reqs</div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Event Loop Status</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#c084fc', fontFamily: 'JetBrains Mono, monospace' }}>0.4ms tick latency</div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Node.js Memory (RSS)</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>38.4 MB</div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. NAVIGATION TABS FOR NODE.JS MODULES & EVENT LOOP */}
        {/* ================================================================= */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
          {[
            { id: 'http', label: 'HTTP Server & Client', icon: Globe, color: '#38bdf8' },
            { id: 'fs', label: 'File System (fs) & HTML', icon: HardDrive, color: '#34d399' },
            { id: 'loop', label: 'Event Loop & V8 Visualizer', icon: Cpu, color: '#c084fc' },
            { id: 'events', label: 'EventEmitter Hub', icon: Zap, color: '#f59e0b' },
            { id: 'os', label: 'OS & Path Diagnostics', icon: Layers, color: '#ec4899' }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: active ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  border: active ? `1px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  color: active ? tab.color : '#94a3b8',
                  borderRadius: '8px',
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: active ? `0 0 14px ${tab.color}33` : 'none'
                }}
              >
                <Icon size={16} color={active ? tab.color : '#64748b'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* 3. TAB 1: HTTP WEB SERVER & CLIENT WORKBENCH */}
        {/* ================================================================= */}
        {activeTab === 'http' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            
            {/* Left: HTTP Client Request Dispatcher */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={18} color="#38bdf8" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                    Node.js HTTP Client Dispatcher
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  http.request() &bull; http.get()
                </span>
              </div>

              {/* Endpoint Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Target Mission Endpoint
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={httpMethod}
                    onChange={(e) => setHttpMethod(e.target.value)}
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: httpMethod === 'POST' ? '#c084fc' : '#38bdf8',
                      borderRadius: '8px',
                      padding: '0.6rem 0.8rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>

                  <select
                    value={selectedEndpoint}
                    onChange={(e) => {
                      const ep = e.target.value;
                      setSelectedEndpoint(ep);
                      if (ep === '/api/telecommand') setHttpMethod('POST');
                      else setHttpMethod('GET');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      padding: '0.6rem 0.8rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="/api/telemetry">/api/telemetry (Live Spacecraft Telemetry)</option>
                    <option value="/manifest.html">/manifest.html (HTML Flight Manifest via fs)</option>
                    <option value="/api/health">/api/health (Ground Node Health via os)</option>
                    <option value="/api/telecommand">/api/telecommand (Uplink Command Buffer)</option>
                    <option value="/api/events">/api/events (EventEmitter Log)</option>
                    <option value="/api/logs">/api/logs (Telemetry Log Stream)</option>
                  </select>
                </div>
              </div>

              {/* POST Payload Editor (if POST) */}
              {httpMethod === 'POST' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    JSON Request Body (Telecommand Frame)
                  </label>
                  <textarea
                    value={postPayload}
                    onChange={(e) => setPostPayload(e.target.value)}
                    rows={6}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#c084fc',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.8rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              )}

              {/* Trigger Button */}
              <button
                onClick={executeHttpClientRequest}
                disabled={clientLoading}
                style={{
                  backgroundColor: '#00f0ff',
                  color: '#04060a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                {clientLoading ? (
                  <Activity size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {clientLoading ? 'Executing Async Node.js Request...' : 'Send HTTP Request to Ground Server'}
              </button>

              {/* Distributed Node Multi-Client Simulator */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wifi size={14} color="#34d399" />
                  <strong>Distributed Ground Station Relays (Web Client Cluster)</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setSelectedEndpoint('/api/telemetry');
                      executeHttpClientRequest();
                      addStationEvent('relay:sync', 'Tromsø Node (Norway) synchronized orbital ephemeris');
                    }}
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#38bdf8',
                      padding: '0.45rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    Tromsø Node (NO)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEndpoint('/manifest.html');
                      executeHttpClientRequest();
                      addStationEvent('relay:sync', 'Kiruna Station (Sweden) downloaded flight certificate');
                    }}
                    style={{
                      background: 'rgba(52, 211, 153, 0.08)',
                      border: '1px solid rgba(52, 211, 153, 0.25)',
                      color: '#34d399',
                      padding: '0.45rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    Kiruna Node (SE)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEndpoint('/api/health');
                      executeHttpClientRequest();
                      addStationEvent('relay:sync', 'Mumbai Terminal (IN) checked Node.js daemon health');
                    }}
                    style={{
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      color: '#c084fc',
                      padding: '0.45rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    Mumbai Terminal
                  </button>
                </div>
              </div>
            </div>

            {/* Right: HTTP Response Inspector & Payload Output */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={18} color="#34d399" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                    HTTP Server Response &amp; Headers
                  </h3>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(typeof clientResponse.data === 'string' ? clientResponse.data : JSON.stringify(clientResponse.data, null, 2));
                    setCopiedResponse(true);
                    setTimeout(() => setCopiedResponse(false), 2000);
                  }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedResponse ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  {copiedResponse ? 'Copied' : 'Copy Payload'}
                </button>
              </div>

              {/* Status Header Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>HTTP Status</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: clientResponse.statusCode < 300 ? '#34d399' : '#f87171', fontFamily: 'JetBrains Mono, monospace' }}>
                    {clientResponse.statusCode} {clientResponse.statusText}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Roundtrip Latency</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>
                    {clientResponse.durationMs} ms
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Transfer Size</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#c084fc', fontFamily: 'JetBrains Mono, monospace' }}>
                    {clientResponse.sizeBytes} bytes
                  </div>
                </div>
              </div>

              {/* Response Body Box */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
                  Content-Type: <span style={{ color: '#38bdf8' }}>{clientResponse.contentType}</span>
                </div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#070a13',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.8rem',
                  color: '#e2e8f0',
                  overflowY: 'auto',
                  maxHeight: '340px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.45'
                }}>
                  {typeof clientResponse.data === 'string'
                    ? clientResponse.data
                    : JSON.stringify(clientResponse.data, null, 2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. TAB 2: FILE SYSTEM (fs) & HTML SERVING */}
        {/* ================================================================= */}
        {activeTab === 'fs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            
            {/* Left: FS Operation Workbench */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HardDrive size={18} color="#34d399" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                    Node.js File System (<code style={{ color: '#34d399' }}>fs</code>) Operations
                  </h3>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  Non-blocking Async I/O
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                The Ground Station daemon manages satellite manifests, mission certificates, and orbital pass records via Node's native <code style={{ color: '#38bdf8' }}>fs</code> module using asynchronous callbacks and readable streams.
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <button
                  onClick={() => triggerFsOperation('readFile')}
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileCode size={16} /> fs.readFile() Manifest
                </button>

                <button
                  onClick={() => triggerFsOperation('appendFile')}
                  style={{
                    backgroundColor: 'rgba(52, 211, 153, 0.12)',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    color: '#34d399',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Activity size={16} /> fs.appendFile() Telemetry
                </button>

                <button
                  onClick={() => triggerFsOperation('createReadStream')}
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    color: '#c084fc',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={16} /> fs.createReadStream()
                </button>
              </div>

              {fsOpStatus && (
                <div style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{fsOpStatus}</span>
                </div>
              )}

              {/* Telemetry Log File View */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Live File: <code style={{ color: '#38bdf8' }}>logs/telemetry.log</code> ({logEntries.length} records)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Asynchronously Appended</span>
                </div>
                <div style={{
                  backgroundColor: '#070a13',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: '#cbd5e1',
                  maxHeight: '180px',
                  overflowY: 'auto'
                }}>
                  {logEntries.map((line, idx) => (
                    <div key={idx} style={{ padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live HTML Manifest Preview (Accessed via Node.js fs) */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} color="#38bdf8" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                    Served HTML Flight Manifest Payload
                  </h3>
                </div>
                <a
                  href="/flight_manifest.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.75rem',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                >
                  Open in New Tab <ExternalLink size={12} />
                </a>
              </div>

              <div style={{
                flex: 1,
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#070a13',
                minHeight: '380px'
              }}>
                <iframe
                  src="/flight_manifest.html"
                  title="SomaiyaSat-1 Flight Manifest"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '380px',
                    border: 'none',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. TAB 3: EVENT LOOP & V8 ARCHITECTURE VISUALIZER */}
        {/* ================================================================= */}
        {activeTab === 'loop' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '12px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={20} color="#c084fc" />
                  Node.js V8 Engine &amp; Single-Threaded Event Loop Visualizer
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                  Demonstrating asynchronous non-blocking I/O, Libuv thread pool delegation, and microtask/macrotask queue resolution.
                </p>
              </div>

              {/* Task Trigger Controls */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => triggerEventLoopTask("fs.readFile('manifest.html')", 'FS_READ')}
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + Async File Read (Libuv)
                </button>
                <button
                  onClick={() => triggerEventLoopTask("http.get('/api/telemetry')", 'HTTP_IO')}
                  style={{
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    color: '#34d399',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + Async HTTP Request
                </button>
                <button
                  onClick={() => triggerEventLoopTask("Promise.resolve('Orbital Sync')", 'PROMISE')}
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    color: '#c084fc',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + Microtask (Promise)
                </button>
              </div>
            </div>

            {/* Architecture Flow Diagram (Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              
              {/* 1. Call Stack (V8 Engine) */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '180px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>1. V8 Call Stack</span>
                  <span>Single Thread</span>
                </div>
                {callStack.length === 0 ? (
                  <div style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
                    Call Stack Idle (Ready for next synchronous frame)
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {callStack.map(item => (
                      <div key={item.id} style={{
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid #38bdf8',
                        color: '#f0f9ff',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Libuv Thread Pool (Async I/O Delegation) */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '180px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>2. Libuv Thread Pool</span>
                  <span>4 Worker Threads</span>
                </div>
                {threadPool.length === 0 ? (
                  <div style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
                    Workers Idle (I/O operations delegated here)
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {threadPool.map(item => (
                      <div key={item.id} style={{
                        background: 'rgba(52, 211, 153, 0.2)',
                        border: '1px solid #34d399',
                        color: '#f0fdf4',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Microtask Queue (process.nextTick, Promises) */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '180px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>3. Microtask Queue</span>
                  <span>High Priority</span>
                </div>
                {microtasks.length === 0 ? (
                  <div style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
                    Empty (process.nextTick &amp; Promises execute first)
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {microtasks.map(item => (
                      <div key={item.id} style={{
                        background: 'rgba(168, 85, 247, 0.2)',
                        border: '1px solid #c084fc',
                        color: '#faf5ff',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Event Queue (Timers, Poll, Check) */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '180px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>4. Event / Callback Queue</span>
                  <span>Event Loop Ticks</span>
                </div>
                {eventQueue.length === 0 ? (
                  <div style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
                    Callbacks dispatched when Call Stack is clear
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {eventQueue.map(item => (
                      <div key={item.id} style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid #f59e0b',
                        color: '#fffbeb',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Event Loop Phases Bar */}
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Event Loop Tick Lifecycle Phases
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['1. Timers (setTimeout)', '2. Pending Callbacks (I/O)', '3. Idle / Prepare', '4. Poll Phase (fs & net)', '5. Check (setImmediate)', '6. Close Callbacks'].map((phase, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: idx === 3 ? '#34d399' : '#cbd5e1',
                    fontWeight: idx === 3 ? '700' : '500'
                  }}>
                    {phase}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 6. TAB 4: EVENTEMITTER HUB */}
        {/* ================================================================= */}
        {activeTab === 'events' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            
            {/* Left: Event Dispatcher */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                  Node.js <code style={{ color: '#f59e0b' }}>events.EventEmitter</code> Control
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                Emit real-time satellite orbital events across the mission control pipeline using Node.js event-driven listeners.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => addStationEvent('satellite:pass_acquired', 'AOS: SomaiyaSat-1 acquired at 68° max elevation')}
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Emit <code style={{ color: '#f8fafc' }}>satellite:pass_acquired</code></span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => addStationEvent('battery:low_safe_mode', 'Battery dropped <25% — Switched AI Router to TT&C only')}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Emit <code style={{ color: '#f8fafc' }}>battery:low_safe_mode</code></span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => addStationEvent('rf:carrier_lock', 'UHF Demodulator locked onto 437.0000 MHz carrier (SNR: +18.4 dB)')}
                  style={{
                    backgroundColor: 'rgba(52, 211, 153, 0.12)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    color: '#34d399',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Emit <code style={{ color: '#f8fafc' }}>rf:carrier_lock</code></span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => addStationEvent('deployer:pod_released', 'SomaiyaPod deployment switch confirmed release of SomaiyaSat 1PQ')}
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#c084fc',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Emit <code style={{ color: '#f8fafc' }}>deployer:pod_released</code></span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right: Event Log Stream */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                  Live EventEmitter Stream ({stationEventsLog.length})
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>
                  stationEvents.on()
                </span>
              </div>

              <div style={{
                flex: 1,
                backgroundColor: '#070a13',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.85rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                maxHeight: '340px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {stationEventsLog.map((evt) => (
                  <div key={evt.id} style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: '3px solid #f59e0b',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontWeight: '700', marginBottom: '2px' }}>
                      <span>{evt.type}</span>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{evt.time}</span>
                    </div>
                    <div style={{ color: '#cbd5e1' }}>{evt.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. TAB 5: OS & PATH DIAGNOSTICS */}
        {/* ================================================================= */}
        {activeTab === 'os' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(236, 72, 153, 0.25)',
            borderRadius: '12px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#ec4899" />
                Ground Station Host Diagnostics (<code style={{ color: '#ec4899' }}>os</code> &amp; <code style={{ color: '#38bdf8' }}>path</code> Modules)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                Low-level operating system telemetry and cross-platform path resolution via Node.js core modules.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Host Platform (os.platform())</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>win32 (Windows)</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>CPU Architecture (os.arch())</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>x64 (8 Physical Cores)</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Total System RAM (os.totalmem())</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#c084fc', fontFamily: 'JetBrains Mono, monospace' }}>16.00 GB (8.42 GB Free)</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Resolved Log Path (path.join())</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ec4899', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
                  /server/../logs/telemetry.log
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. LIVE SERVER STDOUT / STDERR TERMINAL LOG STREAM */}
        {/* ================================================================= */}
        <div style={{
          background: 'rgba(7, 10, 19, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', fontFamily: 'Space Grotesk, sans-serif' }}>
                GROUND STATION DAEMON STDOUT / STDERR LOG STREAM
              </span>
            </div>
            <button
              onClick={() => setTerminalLogs([`[CLEAR] Terminal log buffer cleared at ${new Date().toLocaleTimeString()}`])}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Clear Logs
            </button>
          </div>

          <div style={{
            backgroundColor: '#030509',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '1rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            color: '#38bdf8',
            maxHeight: '160px',
            overflowY: 'auto',
            lineHeight: '1.5'
          }}>
            {terminalLogs.map((log, idx) => (
              <div key={idx} style={{
                color: log.includes('ERROR') ? '#f87171' : log.includes('200') || log.includes('READY') ? '#34d399' : log.includes('EVENT') ? '#f59e0b' : '#94a3b8'
              }}>
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
