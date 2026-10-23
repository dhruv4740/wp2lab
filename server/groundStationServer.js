/**
 * SomaiyaSat Ground Station Node.js Telemetry Gateway & Server
 * 
 * Demonstrates:
 * 1. Node.js Core Modules: http, fs, path, os, url, events
 * 2. Event-Driven Architecture with EventEmitter
 * 3. Non-blocking Asynchronous File System operations (fs.readFile, fs.appendFile, fs.mkdir)
 * 4. Serving static HTML payloads (fs.readFile with text/html)
 * 5. High-throughput HTTP API Server for satellite telecommands and telemetry streams
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import EventEmitter from 'events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration: port (from environment or 8080) and the files this server reads and writes.
const PORT = parseInt(process.env.PORT || process.env.GROUND_PORT || '8080', 10);
const LOG_DIR = path.join(__dirname, '..', 'logs');
const TELEMETRY_LOG = path.join(LOG_DIR, 'telemetry.log');
const COMMAND_LOG = path.join(LOG_DIR, 'telecommands.log');
const MANIFEST_HTML_PATH = path.join(__dirname, '..', 'public', 'flight_manifest.html');

// Create the log folder once at startup (synchronous is fine before the server starts listening).
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// 1. EVENT-DRIVEN CORE (EventEmitter)
// ---------------------------------------------------------------------------
class GroundStationEventEmitter extends EventEmitter {}
const stationEvents = new GroundStationEventEmitter();

// Keep the 50 most recent events in memory (newest first) for GET /api/events.
const recentEvents = [];
function recordEvent(type, payload) {
  const eventEntry = {
    id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    payload,
    timestamp: new Date().toISOString()
  };
  recentEvents.unshift(eventEntry);
  if (recentEvents.length > 50) recentEvents.pop();
  return eventEntry;
}

// Listeners: each emit elsewhere in this file triggers the matching handler, which logs and records the event.
stationEvents.on('station:start', (data) => {
  console.log(`[EVENT] Ground station started on port ${data.port} at ${data.time}`);
  recordEvent('station:start', data);
});

stationEvents.on('telemetry:logged', (data) => {
  console.log(`[EVENT] Telemetry packet logged for ${data.satellite} (Battery: ${data.battery}%, SNR: ${data.snr}dB)`);
  recordEvent('telemetry:logged', data);
});

stationEvents.on('telecommand:received', (data) => {
  console.log(`[EVENT] Telecommand received: [${data.opcode}] -> ${data.target}`);
  recordEvent('telecommand:received', data);
});

stationEvents.on('manifest:accessed', (data) => {
  console.log(`[EVENT] Flight manifest HTML streamed to client from IP: ${data.clientIp}`);
  recordEvent('manifest:accessed', data);
});

// ---------------------------------------------------------------------------
// 2. HTTP SERVER CREATION & ROUTING
// ---------------------------------------------------------------------------
// The callback runs once per request; routes are chosen by comparing URL path and HTTP method.
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers let the React front end (a different port) call this server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Station-Node');

  // Browsers send an OPTIONS preflight request first; answer 204 No Content.
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route 1: serve the static HTML manifest. The file is read asynchronously and the reply is sent in the callback.
  if ((pathname === '/' || pathname === '/manifest.html') && method === 'GET') {
    fs.readFile(MANIFEST_HTML_PATH, 'utf8', (err, htmlContent) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Failed to read HTML manifest from file system',
          details: err.message
        }));
        return;
      }
      stationEvents.emit('manifest:accessed', {
        clientIp: req.socket.remoteAddress || '127.0.0.1',
        time: new Date().toISOString()
      });
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Powered-By': 'Node.js Core HTTP & FS Modules',
        'X-Payload-Type': 'SomaiyaSat-Flight-Manifest'
      });
      res.end(htmlContent);
    });
    return;
  }

  // Route 2: GET /api/telemetry - simulated telemetry as JSON; each reading is also appended to a log file.
  if (pathname === '/api/telemetry' && method === 'GET') {
    const telemetryData = {
      satellite: 'SomaiyaSat-1 (1PQ)',
      deployer: 'SomaiyaPod',
      timestamp: new Date().toISOString(),
      orbit: {
        altitudeKm: 550,
        inclinationDeg: 97.4,
        orbitalPeriodMin: 94.2,
        velocityKmh: 27500
      },
      power: {
        batteryPercent: Math.floor(75 + Math.random() * 20),
        solarVoltageV: (4.1 + Math.random() * 0.4).toFixed(2),
        busCurrentMa: Math.floor(180 + Math.random() * 40)
      },
      rfLink: {
        carrierFreqMhz: 437.0000,
        mode: 'M17 / Codec2 / SSTV / TT&C',
        snrDb: (14.5 + Math.random() * 8).toFixed(1),
        rssiDbm: Math.floor(-102 + Math.random() * 15),
        dopplerShiftHz: Math.floor(-1200 + Math.random() * 2400)
      },
      aiRouter: {
        status: 'NOMINAL_AUTONOMOUS',
        activeProfile: 'KJS-SRS-01',
        priorityQueueDepth: 4
      }
    };

    // Append one line to the log without blocking the response; the callback only reports failures.
    const logLine = `[${telemetryData.timestamp}] SAT=${telemetryData.satellite} BAT=${telemetryData.power.batteryPercent}% SNR=${telemetryData.rfLink.snrDb}dB VOLT=${telemetryData.power.solarVoltageV}V\n`;
    fs.appendFile(TELEMETRY_LOG, logLine, 'utf8', (err) => {
      if (err) console.error('Failed to append telemetry log:', err);
    });

    // Emit a custom event; the listener registered above logs it and stores it.
    stationEvents.emit('telemetry:logged', {
      satellite: telemetryData.satellite,
      battery: telemetryData.power.batteryPercent,
      snr: telemetryData.rfLink.snrDb
    });

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Node-Module': 'http + fs (async)'
    });
    res.end(JSON.stringify(telemetryData, null, 2));
    return;
  }

  // Route 3: GET /api/health - server health from the process and os core modules.
  if (pathname === '/api/health' && method === 'GET') {
    const healthData = {
      station: 'SomaiyaSat Ground Terminal Alpha',
      callsign: 'VU2-SOMI',
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      nodeRuntime: {
        nodeVersion: process.version,
        v8Version: process.versions.v8,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: {
          rss: (process.memoryUsage().rss / (1024 * 1024)).toFixed(2),
          heapTotal: (process.memoryUsage().heapTotal / (1024 * 1024)).toFixed(2),
          heapUsed: (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2)
        },
        pid: process.pid
      },
      hostSystem: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        cpusCount: os.cpus().length,
        cpuModel: os.cpus()[0]?.model || 'Generic CPU',
        totalMemoryGb: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2),
        freeMemoryGb: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2),
        systemUptimeSeconds: Math.floor(os.uptime()),
        loadAverage: os.loadavg()
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData, null, 2));
    return;
  }

  // Route 4: POST /api/telecommand - accept a JSON command. The request body arrives in chunks (stream),
  // so collect them on 'data' and process the whole text on 'end'.
  if (pathname === '/api/telecommand' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      // Invalid JSON throws, and the catch block below replies 400 Bad Request.
      try {
        const payload = JSON.parse(body || '{}');
        const commandRecord = {
          commandId: `CMD-${Date.now()}`,
          opcode: payload.opcode || '0x01_BEACON_PING',
          target: payload.target || 'SomaiyaSat-1',
          operatorCallsign: payload.operatorCallsign || 'VU2-OPERATOR',
          hexPayload: payload.hexPayload || '0xAA 0x55 0x01 0xFF',
          timestamp: new Date().toISOString(),
          status: 'DISPATCHED_TO_UPLINK_QUEUE'
        };

        // Log the command to a file (asynchronous append).
        const logEntry = `[${commandRecord.timestamp}] ID=${commandRecord.commandId} OP=${commandRecord.opcode} OP_CALL=${commandRecord.operatorCallsign} HEX=${commandRecord.hexPayload}\n`;
        fs.appendFile(COMMAND_LOG, logEntry, 'utf8', (err) => {
          if (err) console.error('Failed to append command log:', err);
        });

        stationEvents.emit('telecommand:received', commandRecord);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Telecommand ingested and queued for satellite transmission.',
          record: commandRecord
        }, null, 2));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid JSON telecommand payload format',
          details: err.message
        }));
      }
    });
    return;
  }

  // Route 5: GET /api/events - the recent events recorded by the EventEmitter listeners.
  if (pathname === '/api/events' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      count: recentEvents.length,
      events: recentEvents
    }, null, 2));
    return;
  }

  // Route 6: GET /api/logs - return the last 30 lines of the telemetry log file.
  if (pathname === '/api/logs' && method === 'GET') {
    fs.readFile(TELEMETRY_LOG, 'utf8', (err, logData) => {
      if (err) {
        // No log file yet (nothing written): reply with an empty list instead of an error.
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          file: 'telemetry.log',
          linesCount: 0,
          entries: []
        }));
        return;
      }
      const lines = logData.trim().split('\n').filter(Boolean);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        file: 'telemetry.log',
        linesCount: lines.length,
        entries: lines.slice(-30) // last 30 entries
      }, null, 2));
    });
    return;
  }

  // Route 7: POST /api/events/trigger - record a manual event from a JSON body.
  if (pathname === '/api/events/trigger' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { eventType, payload } = JSON.parse(body || '{}');
        const evt = recordEvent(eventType || 'manual:trigger', payload || {});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, event: evt }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // No route matched: reply 404 Not Found and list the available endpoints.
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Endpoint not found',
    requestedPath: pathname,
    availableEndpoints: [
      'GET /',
      'GET /manifest.html',
      'GET /api/telemetry',
      'GET /api/health',
      'POST /api/telecommand',
      'GET /api/events',
      'GET /api/logs'
    ]
  }));
});

// Start listening, then emit the startup event.
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛰️  SOMAIYASAT GROUND STATION NODE.JS SERVER ONLINE`);
  console.log(`=======================================================`);
  console.log(`📡 Server Address: http://localhost:${PORT}`);
  console.log(`📄 Flight Manifest: http://localhost:${PORT}/manifest.html`);
  console.log(`📊 Telemetry API:  http://localhost:${PORT}/api/telemetry`);
  console.log(`🩺 Health API:     http://localhost:${PORT}/api/health`);
  console.log(`💾 Log Directory:  ${LOG_DIR}`);
  console.log(`⚙️  Node Version:   ${process.version} (V8 ${process.versions.v8})`);
  console.log(`=======================================================`);

  stationEvents.emit('station:start', {
    port: PORT,
    host: 'localhost',
    time: new Date().toISOString()
  });
});

export default server;
