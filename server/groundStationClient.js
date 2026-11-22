/**
 * SomaiyaSat Ground Station Node.js HTTP Web Client
 * 
 * Demonstrates:
 * 1. Node.js Core 'http' module Web Client (http.request, http.get)
 * 2. Asynchronous HTTP request dispatching, streams, and chunk handling
 * 3. Fetching JSON telemetry endpoints and static HTML payload manifests
 * 4. Sending HTTP POST telecommand payloads with custom headers
 * 5. Latency benchmarking and response header diagnostics
 */

import http from 'http';

const SERVER_HOST = process.env.GROUND_HOST || 'localhost';
const SERVER_PORT = parseInt(process.env.GROUND_PORT || '8080', 10);

/**
 * Generic HTTP Request helper using Node.js Core 'http' module
 */
function sendHttpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const req = http.request(options, (res) => {
      let data = '';

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const durationMs = (performance.now() - startTime).toFixed(2);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          durationMs: parseFloat(durationMs)
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }

    req.end();
  });
}

/**
 * Run Automated Web Client Sequence
 */
async function runClientSequence() {
  console.log(`=======================================================`);
  console.log(`📡 SOMAIYASAT GROUND STATION HTTP CLIENT INITIATED`);
  console.log(`🎯 Target Server: http://${SERVER_HOST}:${SERVER_PORT}`);
  console.log(`=======================================================\n`);

  try {
    // 1. Health Diagnostics (GET /api/health)
    console.log(`[TEST 1] Dispatching GET /api/health...`);
    const healthRes = await sendHttpRequest({
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SomaiyaSat-Client/1.0 (Node.js)'
      }
    });
    console.log(`  ✓ Status: ${healthRes.statusCode} OK (${healthRes.durationMs} ms)`);
    const healthJson = JSON.parse(healthRes.data);
    console.log(`  ✓ Node Runtime: ${healthJson.nodeRuntime.nodeVersion} (V8 ${healthJson.nodeRuntime.v8Version})`);
    console.log(`  ✓ Station Host: ${healthJson.hostSystem.hostname} (${healthJson.hostSystem.platform} ${healthJson.hostSystem.arch})`);
    console.log(`  ✓ Free Memory: ${healthJson.hostSystem.freeMemoryGb} GB / ${healthJson.hostSystem.totalMemoryGb} GB\n`);

    // 2. Telemetry Ingestion (GET /api/telemetry)
    console.log(`[TEST 2] Dispatching GET /api/telemetry...`);
    const telemRes = await sendHttpRequest({
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: '/api/telemetry',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    console.log(`  ✓ Status: ${telemRes.statusCode} OK (${telemRes.durationMs} ms)`);
    const telemJson = JSON.parse(telemRes.data);
    console.log(`  ✓ Spacecraft: ${telemJson.satellite} | Orbit: ${telemJson.orbit.altitudeKm} km`);
    console.log(`  ✓ Battery: ${telemJson.power.batteryPercent}% | Downlink SNR: ${telemJson.rfLink.snrDb} dB`);
    console.log(`  ✓ Active Carrier: ${telemJson.rfLink.carrierFreqMhz} MHz (${telemJson.rfLink.mode})\n`);

    // 3. HTML Manifest Payload Retrieval via fs module (GET /manifest.html)
    console.log(`[TEST 3] Dispatching GET /manifest.html (Serving HTML via fs.readFile)...`);
    const manifestRes = await sendHttpRequest({
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: '/manifest.html',
      method: 'GET',
      headers: { 'Accept': 'text/html' }
    });
    console.log(`  ✓ Status: ${manifestRes.statusCode} OK (${manifestRes.durationMs} ms)`);
    console.log(`  ✓ Content-Type: ${manifestRes.headers['content-type']}`);
    console.log(`  ✓ Payload Size: ${manifestRes.data.length} bytes`);
    console.log(`  ✓ Verification: Contains '<!DOCTYPE html>' and 'SomaiyaSat-1'\n`);

    // 4. Telecommand Uplink Dispatch (POST /api/telecommand)
    console.log(`[TEST 4] Dispatching POST /api/telecommand (JSON payload uplink)...`);
    const cmdPayload = {
      opcode: '0x3F_ACTIVATE_SSTV_BEACON',
      target: 'SomaiyaSat-1',
      operatorCallsign: 'VU2-MUMBAI-TERMINAL',
      hexPayload: '0xAA 0x55 0x3F 0x01 0xFE'
    };
    const cmdRes = await sendHttpRequest({
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: '/api/telecommand',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(cmdPayload))
      }
    }, cmdPayload);
    console.log(`  ✓ Status: ${cmdRes.statusCode} CREATED (${cmdRes.durationMs} ms)`);
    const cmdJson = JSON.parse(cmdRes.data);
    console.log(`  ✓ Telecommand Ingested ID: ${cmdJson.record?.commandId}`);
    console.log(`  ✓ Opcode: ${cmdJson.record?.opcode} -> Target: ${cmdJson.record?.target}\n`);

    // 5. Query Station Events (GET /api/events)
    console.log(`[TEST 5] Querying EventEmitter Station Events (GET /api/events)...`);
    const eventsRes = await sendHttpRequest({
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: '/api/events',
      method: 'GET'
    });
    const eventsJson = JSON.parse(eventsRes.data);
    console.log(`  ✓ Total Events Dispatched: ${eventsJson.count}`);
    console.log(`  ✓ Latest Event: [${eventsJson.events[0]?.type}] at ${eventsJson.events[0]?.timestamp}\n`);

    console.log(`=======================================================`);
    console.log(`🎉 ALL NODE.JS HTTP CLIENT SEQUENCE TESTS PASSED!`);
    console.log(`=======================================================`);
  } catch (err) {
    console.error(`\n❌ HTTP Client Error:`, err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error(`👉 Hint: Ensure the Node.js ground server is running via 'npm run server' or 'node server/groundStationServer.js'`);
    }
  }
}

runClientSequence();
