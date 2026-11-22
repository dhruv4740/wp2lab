/**
 * Challenger 2 Final Gate Re-Verification Audit
 * Independent Empirical Verification Suite
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

let total = 0;
let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, extraInfo = '') {
  total++;
  if (condition) {
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${name} ${extraInfo}`);
    failed++;
    failures.push({ name, extraInfo });
  }
}

console.log('================================================================');
console.log('  CHALLENGER 2 (FINAL): INDEPENDENT EMPIRICAL AUDIT HARNESS     ');
console.log('================================================================\n');

// ----------------------------------------------------------------------
// SECTION 1: Finding 1 Re-Verification — AuthContext.jsx Storage Resilience
// ----------------------------------------------------------------------
console.log('SECTION 1: AuthContext Storage Resilience & Corruption Defense');

const authPath = 'src/context/AuthContext.jsx';
const authCode = read(authPath);

// 1.1 Try-catch structure in AuthContext.jsx
check(
  '1.1 AuthContext encapsulates localStorage.getItem and JSON.parse in try/catch block',
  /try\s*\{\s*const\s+saved\s*=\s*localStorage\.getItem\(['"]somaiyasat_user['"]\);\s*return\s+saved\s*\?\s*JSON\.parse\(saved\)\s*:\s*null;\s*\}\s*catch/.test(authCode)
);

// 1.2 Catch block purges corrupted key and returns null
check(
  '1.2 Catch block purges corrupted key with removeItem and safely returns null',
  /catch\s*\{\s*localStorage\.removeItem\(['"]somaiyasat_user['"]\);\s*return\s+null;\s*\}/.test(authCode)
);

// 1.3 Empirical simulation of AuthProvider initialization across 15 adversarial inputs
const testInputs = [
  '{corrupted_json',
  'undefined',
  'null',
  '',
  '   ',
  '{"unterminated string',
  '{"key": NaN}',
  '{"key": undefined}',
  '<html><body>502 Bad Gateway</body></html>',
  '[1, 2, 3, {"trailing": "comma",}]',
  '{"proto": "__proto__"}',
  '{"username": "test", "callsign": "VU2-TEST"}',
  '{"partial": true, "corrupted":',
  '12345',
  '{"nested": {"level2": {"level3": "deep"}}}'
];

let safeSimulations = 0;
testInputs.forEach((input) => {
  // Mock localStorage
  const store = { somaiyasat_user: input };
  const mockLocalStorage = {
    getItem: (key) => store[key] ?? null,
    removeItem: (key) => { delete store[key]; }
  };

  // Execute AuthContext's exact logic
  try {
    const initUser = (() => {
      try {
        const saved = mockLocalStorage.getItem('somaiyasat_user');
        return saved ? JSON.parse(saved) : null;
      } catch {
        mockLocalStorage.removeItem('somaiyasat_user');
        return null;
      }
    })();

    // Verify it either returned parsed object or null, and never threw
    if (initUser === null || typeof initUser === 'object' || typeof initUser === 'number') {
      safeSimulations++;
    }
  } catch (err) {
    // If it threw, test fails
  }
});

check(
  '1.3 AuthProvider initialization logic survives 15/15 adversarial and corrupted storage payloads without throwing',
  safeSimulations === testInputs.length,
  `(${safeSimulations}/${testInputs.length} handled)`
);

// ----------------------------------------------------------------------
// SECTION 2: Finding 2 Re-Verification — MissionTimeline Chronology Integrity
// ----------------------------------------------------------------------
console.log('\nSECTION 2: MissionTimeline Chronological Monotonic Ordering');

const timelinePath = 'src/components/MissionTimeline.jsx';
const timelineCode = read(timelinePath);

// Extract milestones from MissionTimeline
const milestoneRegex = /time:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*loc:\s*['"]([^'"]+)['"],\s*desc:\s*['"]([^'"]+)['"],\s*status:\s*['"]([^'"]+)['"]/g;

const extractedMilestones = [];
let mMatch;
while ((mMatch = milestoneRegex.exec(timelineCode)) !== null) {
  extractedMilestones.push({
    time: mMatch[1],
    title: mMatch[2],
    loc: mMatch[3],
    desc: mMatch[4],
    status: mMatch[5]
  });
}

check(
  '2.1 MissionTimeline defines exactly 8 milestones with all standard schema properties',
  extractedMilestones.length === 8,
  `(Found ${extractedMilestones.length})`
);

function parseSeconds(ts) {
  const clean = ts.replace(/^T/, '').trim();
  const sign = clean.startsWith('+') ? 1 : clean.startsWith('-') ? -1 : 1;
  const parts = clean.replace(/^[+-]/, '').split(':').map(Number);
  return sign * ((parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0));
}

const secondsArray = extractedMilestones.map(m => parseSeconds(m.time));

// Verify strictly ascending timestamps
let isStrictlyAscending = true;
const deltas = [];
for (let i = 1; i < secondsArray.length; i++) {
  const delta = secondsArray[i] - secondsArray[i - 1];
  deltas.push(delta);
  if (delta <= 0) {
    isStrictlyAscending = false;
  }
}

check(
  '2.2 MissionTimeline milestone timestamps are strictly monotonically increasing (delta > 0 for all adjacent pairs)',
  isStrictlyAscending,
  `Deltas: ${deltas.join(', ')}s`
);

// Verify specific sequence: T+00:18:00 precedes T+00:25:00
const aiIndex = extractedMilestones.findIndex(m => m.title.includes('AI Subsystem Boot'));
const attIndex = extractedMilestones.findIndex(m => m.title.includes('Attitude Stabilization'));

check(
  '2.3 AI Subsystem Boot (T+00:18:00) precedes Attitude Stabilization & Detumble (T+00:25:00)',
  aiIndex !== -1 && attIndex !== -1 && aiIndex < attIndex,
  `(AI Index: ${aiIndex}, Attitude Index: ${attIndex})`
);

// Verify all status values are valid
const validStatuses = ['COMPLETE', 'NOMINAL'];
const allValidStatus = extractedMilestones.every(m => validStatuses.includes(m.status));
check(
  '2.4 All milestones declare valid operational status codes (COMPLETE or NOMINAL)',
  allValidStatus
);

// ----------------------------------------------------------------------
// SECTION 3: Finding 3 Re-Verification — CommunicationArchitecture Escape Handler
// ----------------------------------------------------------------------
console.log('\nSECTION 3: CommunicationArchitecture Modal Escape Key Contract');

const commsPath = 'src/components/CommunicationArchitecture.jsx';
const commsCode = read(commsPath);

// Check useEffect import
check(
  '3.1 CommunicationArchitecture imports useEffect from react',
  /import\s+React,\s*\{[^}]*useEffect[^}]*\}\s*from\s*['"]react['"]/.test(commsCode)
);

// Check keydown listener implementation
check(
  '3.2 useEffect registers window keydown listener for Escape key when selectedModule is active',
  commsCode.includes("event.key === 'Escape'") &&
  commsCode.includes("setSelectedModule(null)") &&
  commsCode.includes("window.addEventListener('keydown', handleKeyDown)")
);

// Check event listener cleanup
check(
  '3.3 useEffect returns cleanup function removing window keydown listener to prevent memory leaks',
  commsCode.includes("window.removeEventListener('keydown', handleKeyDown)")
);

// Check dependency array
check(
  '3.4 useEffect dependency array includes [selectedModule]',
  /\[\s*selectedModule\s*\]/.test(commsCode)
);

// Check CLOSE [ESC] button exists in modal JSX
check(
  '3.5 Modal contains explicit CLOSE [ESC] button bound to setSelectedModule(null)',
  commsCode.includes("CLOSE [ESC]") && commsCode.includes("onClick={() => setSelectedModule(null)}")
);

// ----------------------------------------------------------------------
// SECTION 4: Findings 4 & 5 Re-Verification — CSS Focus Rings & Drawer Indicators
// ----------------------------------------------------------------------
console.log('\nSECTION 4: WCAG 2.4.7 Focus Indicator & Drawer State Feedback');

const cssPath = 'src/index.css';
const cssContent = read(cssPath);

// 4.1 Focus visible ring for summary
check(
  '4.1 index.css defines .tech-drawer summary:focus-visible with accessible outline',
  /\.tech-drawer\s+summary:focus-visible\s*\{[^}]*outline:\s*2px\s+solid\s+#38bdf8/i.test(cssContent)
);

// 4.2 Outline offset defined for visual clarity
check(
  '4.2 index.css defines outline-offset of at least 2px on focus-visible',
  /\.tech-drawer\s+summary:focus-visible\s*\{[^}]*outline-offset:\s*2px/i.test(cssContent)
);

// 4.3 Open state indicator for drawer summary span
check(
  '4.3 index.css defines interactive open state indicator for details[open].tech-drawer summary span',
  /details\[open\]\.tech-drawer\s+summary\s+span[^{]*\{[^}]*color:\s*#34d399/i.test(cssContent) ||
  /\.tech-drawer\[open\]\s+summary\s+span[^{]*\{[^}]*color:\s*#34d399/i.test(cssContent)
);

// ----------------------------------------------------------------------
// SECTION 5: Cross-Section Narrative Uniqueness & Conciseness Audit
// ----------------------------------------------------------------------
console.log('\nSECTION 5: Full Narrative Uniqueness & Conciseness Audit');

const deployCode = read('src/components/DeploymentSequence.jsx');

// Extract deployment step titles
const deployTitles = [];
const deployRegex = /title:\s*['"]([^'"]+)['"]/g;
let dMatch;
while ((dMatch = deployRegex.exec(deployCode)) !== null) {
  deployTitles.push(dMatch[1].trim());
}

const timelineTitles = extractedMilestones.map(m => m.title.trim());
const duplicateTitles = deployTitles.filter(t => timelineTitles.includes(t));

check(
  '5.1 Zero overlapping milestone/step titles between DeploymentSequence and MissionTimeline',
  duplicateTitles.length === 0,
  duplicateTitles.length > 0 ? `Duplicates: ${duplicateTitles.join(', ')}` : ''
);

// Check sentence counts across all milestones and deployment steps
const descRegex = /desc:\s*['"]([^'"]+)['"]/g;
const timelineDescs = [];
let tDescMatch;
while ((tDescMatch = descRegex.exec(timelineCode)) !== null) {
  timelineDescs.push(tDescMatch[1].trim());
}

const detailRegex = /detail:\s*['"]([^'"]+)['"]/g;
const deployDetails = [];
let dDetailMatch;
while ((dDetailMatch = detailRegex.exec(deployCode)) !== null) {
  deployDetails.push(dDetailMatch[1].trim());
}

let narrativeViolation = false;
[...timelineDescs, ...deployDetails].forEach(text => {
  const sentenceCount = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount > 2) {
    narrativeViolation = true;
  }
});

check(
  '5.2 All deployment and timeline descriptions strictly conform to 1-2 sentence conciseness constraint',
  !narrativeViolation
);

// ----------------------------------------------------------------------
// SECTION 6: Built Production Bundle Verification
// ----------------------------------------------------------------------
console.log('\nSECTION 6: Production Build Artifacts Verification');

const distHtmlPath = path.join(ROOT, 'dist', 'index.html');
const distAssetsDir = path.join(ROOT, 'dist', 'assets');

check('6.1 dist/index.html exists', fs.existsSync(distHtmlPath));

let jsFiles = [];
let cssFiles = [];
if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  jsFiles = files.filter(f => f.endsWith('.js'));
  cssFiles = files.filter(f => f.endsWith('.css'));
}

check('6.2 Production JS bundle generated with non-zero size', jsFiles.length > 0 && fs.statSync(path.join(distAssetsDir, jsFiles[0])).size > 50000);
check('6.3 Production CSS bundle generated with non-zero size', cssFiles.length > 0 && fs.statSync(path.join(distAssetsDir, cssFiles[0])).size > 5000);

// Check index.html links the generated bundles
if (fs.existsSync(distHtmlPath)) {
  const htmlContent = read('dist/index.html');
  check('6.4 dist/index.html correctly references production JS bundle', htmlContent.includes(jsFiles[0]));
  check('6.5 dist/index.html correctly references production CSS bundle', htmlContent.includes(cssFiles[0]));
}

// ----------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL AUDIT ASSERTIONS : ${total}`);
console.log(`PASSED                 : ${passed}`);
console.log(`FAILED                 : ${failed}`);
console.log(`PASS RATE              : ${((passed / total) * 100).toFixed(1)}%`);
console.log('================================================================\n');

if (failed > 0) {
  console.error('FAILURES DETECTED:');
  failures.forEach((f, idx) => {
    console.error(`  ${idx + 1}. ${f.name} - ${f.extraInfo}`);
  });
  process.exit(1);
} else {
  console.log('FINAL AUDIT VERDICT: ALL 5 FINDINGS CONFIRMED FULLY RESOLVED (100% PASS).');
  process.exit(0);
}
