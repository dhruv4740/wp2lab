/**
 * SomaiyaSat ground station server (Exp 5: core Node.js, no Express).
 *
 * Shows: http (server + routing), url, fs (async readFile / appendFile), os + process (health),
 * events (EventEmitter), JSON parsing and HTTP error codes.
 *
 * Endpoints:  GET /  ·  GET /api/telemetry  ·  GET /api/health  ·  POST /api/telecommand
 *             GET /api/events  ·  GET /api/logs  ·  POST /api/events/trigger
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import EventEmitter from 'events';

// ES modules have no __dirname, so build it from the file URL.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration: port (from environment or 8080) and the files this server reads and writes.
const PORT = parseInt(process.env.PORT || process.env.GROUND_PORT || '8080', 10);
const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const TELEMETRY_LOG = path.join(LOG_DIR, 'telemetry.log');
const COMMAND_LOG = path.join(LOG_DIR, 'telecommands.log');
const MANIFEST_HTML_PATH = path.join(__dirname, '..', '..', 'public', 'flight_manifest.html');

// Create the log folder once at startup (synchronous is fine before the server starts listening).
fs.mkdirSync(LOG_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Helpers used by every route
// ---------------------------------------------------------------------------

// Send a JSON reply with a status code.
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// Add one line to a log file without blocking; the callback only reports failures.
function appendLog(file, line) {
  fs.appendFile(file, line + '\n', 'utf8', (err) => {
    if (err) console.error('Could not write log:', err.message);
  });
}

// A request body arrives in chunks (a stream): collect them on 'data', parse the whole text on 'end'.
// Invalid JSON makes JSON.parse throw, and we reply 400 Bad Request.
function readJsonBody(req, res, onBody) {
  let text = '';
  req.on('data', (chunk) => { text += chunk; });
  req.on('end', () => {
    try {
      onBody(JSON.parse(text || '{}'));
    } catch (err) {
      sendJson(res, 400, { success: false, error: 'Invalid JSON body', details: err.message });
    }
  });
}

// ---------------------------------------------------------------------------
// Events (EventEmitter): routes emit an event, one listener logs it and stores it
// ---------------------------------------------------------------------------
const stationEvents = new EventEmitter();
const recentEvents = []; // newest first, at most 50, returned by GET /api/events

function recordEvent(type, payload) {
  const entry = { id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`, type, payload, timestamp: new Date().toISOString() };
  recentEvents.unshift(entry);
  if (recentEvents.length > 50) recentEvents.pop();
  return entry;
}

for (const type of ['station:start', 'telemetry:logged', 'telecommand:received', 'manifest:accessed']) {
  stationEvents.on(type, (data) => {
    console.log(`[EVENT] ${type}`);
    recordEvent(type, data);
  });
}

// ---------------------------------------------------------------------------
// Data builders
// ---------------------------------------------------------------------------

// Simulated telemetry: fixed orbit values plus random power and radio numbers.
function makeTelemetry() {
  return {
    satellite: 'SomaiyaSat-1 (1PQ)',
    deployer: 'SomaiyaPod',
    timestamp: new Date().toISOString(),
    orbit: { altitudeKm: 550, inclinationDeg: 97.4, orbitalPeriodMin: 94.2 },
    power: {
      batteryPercent: Math.floor(75 + Math.random() * 20),
      solarVoltageV: (4.1 + Math.random() * 0.4).toFixed(2),
    },
    rfLink: {
      carrierFreqMhz: 437.0,
      mode: 'M17 / Codec2 / SSTV / TT&C',
      snrDb: (14.5 + Math.random() * 8).toFixed(1),
      rssiDbm: Math.floor(-102 + Math.random() * 15),
    },
    aiRouter: { status: 'NOMINAL_AUTONOMOUS', priorityQueueDepth: 4 },
  };
}

// Real server health: values come from the process and os core modules.
function makeHealth() {
  const mb = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
  const memory = process.memoryUsage();
  return {
    station: 'SomaiyaSat Ground Terminal Alpha',
    callsign: 'VU2-SOMI',
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    nodeRuntime: {
      nodeVersion: process.version,
      v8Version: process.versions.v8,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: { rss: mb(memory.rss), heapUsed: mb(memory.heapUsed) },
      pid: process.pid,
    },
    hostSystem: {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpusCount: os.cpus().length,
      totalMemoryGb: (os.totalmem() / 1024 ** 3).toFixed(2),
      freeMemoryGb: (os.freemem() / 1024 ** 3).toFixed(2),
    },
  };
}

// ---------------------------------------------------------------------------
// HTTP server and routing
// ---------------------------------------------------------------------------
// The callback runs once per request; routes are chosen by comparing URL path and HTTP method.
const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const route = `${req.method} ${pathname}`;

  // CORS headers let the React front end (a different port) call this server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Browsers send an OPTIONS "preflight" request first; answer 204 No Content.
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // GET / : serve the static HTML manifest. The file is read asynchronously and the reply is sent in the callback.
  if (route === 'GET /' || route === 'GET /manifest.html') {
    return fs.readFile(MANIFEST_HTML_PATH, 'utf8', (err, html) => {
      if (err) return sendJson(res, 500, { error: 'Could not read manifest', details: err.message });
      stationEvents.emit('manifest:accessed', { clientIp: req.socket.remoteAddress });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
  }

  // GET /api/telemetry : simulated reading; also appended to a log file and announced as an event.
  if (route === 'GET /api/telemetry') {
    const data = makeTelemetry();
    appendLog(TELEMETRY_LOG, `[${data.timestamp}] BAT=${data.power.batteryPercent}% SNR=${data.rfLink.snrDb}dB`);
    stationEvents.emit('telemetry:logged', { battery: data.power.batteryPercent, snr: data.rfLink.snrDb });
    return sendJson(res, 200, data);
  }

  // GET /api/health : real server health.
  if (route === 'GET /api/health') return sendJson(res, 200, makeHealth());

  // POST /api/telecommand : accept a JSON command, log it, reply 201 Created.
  if (route === 'POST /api/telecommand') {
    return readJsonBody(req, res, (body) => {
      const record = {
        commandId: `CMD-${Date.now()}`,
        opcode: body.opcode || '0x01_BEACON_PING',
        target: body.target || 'SomaiyaSat-1',
        operatorCallsign: body.operatorCallsign || 'VU2-OPERATOR',
        hexPayload: body.hexPayload || '0xAA 0x55 0x01 0xFF',
        timestamp: new Date().toISOString(),
        status: 'DISPATCHED_TO_UPLINK_QUEUE',
      };
      appendLog(COMMAND_LOG, `[${record.timestamp}] ID=${record.commandId} OP=${record.opcode} HEX=${record.hexPayload}`);
      stationEvents.emit('telecommand:received', record);
      sendJson(res, 201, { success: true, message: 'Telecommand queued for transmission.', record });
    });
  }

  // GET /api/events : the recent events recorded by the listeners above.
  if (route === 'GET /api/events') return sendJson(res, 200, { count: recentEvents.length, events: recentEvents });

  // GET /api/logs : the last 30 lines of the telemetry log file.
  if (route === 'GET /api/logs') {
    return fs.readFile(TELEMETRY_LOG, 'utf8', (err, text) => {
      // No log file yet: reply with an empty list instead of an error.
      const lines = err ? [] : text.trim().split('\n').filter(Boolean);
      sendJson(res, 200, { file: 'telemetry.log', linesCount: lines.length, entries: lines.slice(-30) });
    });
  }

  // POST /api/events/trigger : record a manual event from a JSON body.
  if (route === 'POST /api/events/trigger') {
    return readJsonBody(req, res, ({ eventType, payload }) => {
      sendJson(res, 200, { success: true, event: recordEvent(eventType || 'manual:trigger', payload || {}) });
    });
  }

  // No route matched: 404 Not Found.
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found', requestedPath: pathname }));
});

// Start listening, then emit the startup event.
server.listen(PORT, () => {
  console.log(`SomaiyaSat ground station server running at http://localhost:${PORT}`);
  stationEvents.emit('station:start', { port: PORT });
});

export default server;
