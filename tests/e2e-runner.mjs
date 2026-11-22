#!/usr/bin/env node
/**
 * SomaiyaSat Ground Station Web Platform — Master E2E Test Runner
 * 
 * Executes the complete opaque-box E2E test suite across Tiers 1 through 4:
 * - Tier 1: Feature Coverage (R1, R2, R3, R4 >= 5 tests per feature)
 * - Tier 2: Boundary & Corner Cases (>= 5 tests per boundary)
 * - Tier 3: Cross-Feature Combinations (pairwise interactions)
 * - Tier 4: Real-World Application Scenarios (complete user journeys)
 * 
 * Usage:
 *   node tests/e2e-runner.mjs
 *   node tests/e2e-runner.mjs --tier=1
 *   node tests/e2e-runner.mjs --milestone=M1
 *   node tests/e2e-runner.mjs --json
 *   node tests/e2e-runner.mjs --bail
 */

import { testContext, COLORS } from './test-utils.mjs';
import { registerTier1Tests } from './tier1-features.mjs';
import { registerTier2Tests } from './tier2-boundaries.mjs';
import { registerTier3Tests } from './tier3-interactions.mjs';
import { registerTier4Tests } from './tier4-scenarios.mjs';

// Parse CLI Arguments
const args = process.argv.slice(2);
const options = {
  tier: null,
  milestone: null,
  bail: false,
  json: false,
  summaryOnly: false,
  help: false
};

for (const arg of args) {
  if (arg === '--help' || arg === '-h') {
    options.help = true;
  } else if (arg.startsWith('--tier=')) {
    options.tier = arg.split('=')[1];
  } else if (arg === '-t' && args[args.indexOf(arg) + 1]) {
    options.tier = args[args.indexOf(arg) + 1];
  } else if (arg.startsWith('--milestone=')) {
    options.milestone = arg.split('=')[1].toUpperCase();
  } else if (arg === '-m' && args[args.indexOf(arg) + 1]) {
    options.milestone = args[args.indexOf(arg) + 1].toUpperCase();
  } else if (arg === '--bail' || arg === '-b') {
    options.bail = true;
  } else if (arg === '--json') {
    options.json = true;
  } else if (arg === '--summary') {
    options.summaryOnly = true;
  }
}

if (options.help) {
  console.log(`
${COLORS.bold}${COLORS.cyan}SOMAIYASAT GROUND STATION E2E TEST RUNNER${COLORS.reset}

${COLORS.bold}USAGE:${COLORS.reset}
  node tests/e2e-runner.mjs [options]

${COLORS.bold}OPTIONS:${COLORS.reset}
  --tier=<1|2|3|4>        Run only tests from the specified tier
  -t <1|2|3|4>            Short alias for --tier
  --milestone=<M1|M2|M3|M4> Filter tests by target implementation milestone
  -m <M1|M2|M3|M4>        Short alias for --milestone
  --bail, -b              Abort immediately on first test failure
  --json                  Output test results in JSON format
  --summary               Print summary statistics only
  --help, -h              Display this help message
`);
  process.exit(0);
}

// Register all Tier Suites
registerTier1Tests();
registerTier2Tests();
registerTier3Tests();
registerTier4Tests();

// Filter tests based on options
let testsToRun = testContext.tests;

if (options.tier) {
  const tierSearch = `Tier ${options.tier}`;
  testsToRun = testsToRun.filter(t => t.tier.toLowerCase().includes(tierSearch.toLowerCase()));
}

if (options.milestone) {
  testsToRun = testsToRun.filter(t => t.milestone === options.milestone);
}

// Banner Header
if (!options.json) {
  console.log(`
${COLORS.bold}${COLORS.cyan}================================================================================${COLORS.reset}
${COLORS.bold}${COLORS.cyan}     SOMAIYASAT GROUND STATION OVERHAUL — E2E TEST VERIFICATION HARNESS         ${COLORS.reset}
${COLORS.bold}${COLORS.cyan}================================================================================${COLORS.reset}
${COLORS.gray}Framework: Node.js ES Modules | Target: SomaiyaSat React SPA | Total Tests: ${testsToRun.length}${COLORS.reset}
${options.tier ? `${COLORS.yellow}Filter: Tier ${options.tier}${COLORS.reset} ` : ''}${options.milestone ? `${COLORS.yellow}Filter: Milestone ${options.milestone}${COLORS.reset}` : ''}
`);
}

// Execution Loop
testContext.startTime = performance.now();
let passedCount = 0;
let failedCount = 0;
let lastTier = null;
let lastFeature = null;

const runResults = [];

for (const t of testsToRun) {
  // Print Tier Header if changed
  if (!options.json && !options.summaryOnly && t.tier !== lastTier) {
    console.log(`\n${COLORS.bold}${COLORS.blue}┌──────────────────────────────────────────────────────────────────────────────┐${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.blue}│  ${t.tier.toUpperCase()} — ${t.tierDesc.padEnd(70)}│${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.blue}└──────────────────────────────────────────────────────────────────────────────┘${COLORS.reset}`);
    lastTier = t.tier;
    lastFeature = null;
  }

  // Print Feature Header if changed
  if (!options.json && !options.summaryOnly && t.featureTitle !== lastFeature) {
    console.log(`\n  ${COLORS.bold}${COLORS.magenta}▶ ${t.featureCode} — ${t.featureTitle}${COLORS.reset}`);
    lastFeature = t.featureTitle;
  }

  const startT = performance.now();
  let status = 'PASS';
  let errorMsg = null;

  try {
    t.fn();
    passedCount++;
  } catch (err) {
    status = 'FAIL';
    failedCount++;
    errorMsg = err.message || String(err);
    
    testContext.escalations.push({
      testId: t.id,
      testName: t.name,
      tier: t.tier,
      featureCode: t.featureCode,
      milestone: t.milestone,
      error: errorMsg
    });
  }
  const duration = (performance.now() - startT).toFixed(2);

  runResults.push({
    id: t.id,
    name: t.name,
    tier: t.tier,
    featureCode: t.featureCode,
    featureTitle: t.featureTitle,
    milestone: t.milestone,
    status,
    durationMs: duration,
    error: errorMsg
  });

  if (!options.json && !options.summaryOnly) {
    const badge = status === 'PASS'
      ? `${COLORS.green}[PASS]${COLORS.reset}`
      : `${COLORS.red}[FAIL]${COLORS.reset}`;
    const msStr = `${COLORS.gray}(${duration}ms)${COLORS.reset}`;
    console.log(`    ${badge} ${t.name} ${msStr}`);

    if (status === 'FAIL') {
      console.log(`      ${COLORS.red}↳ Error: ${errorMsg}${COLORS.reset}`);
      console.log(`      ${COLORS.yellow}↳ Target Implementation Milestone: ${t.milestone}${COLORS.reset}`);
    }
  }

  if (status === 'FAIL' && options.bail) {
    console.log(`\n${COLORS.red}Bailing early after first failure (--bail specified).${COLORS.reset}`);
    break;
  }
}

testContext.endTime = performance.now();
const totalTime = ((testContext.endTime - testContext.startTime) / 1000).toFixed(2);

// JSON Output Mode
if (options.json) {
  const jsonOutput = {
    summary: {
      total: testsToRun.length,
      passed: passedCount,
      failed: failedCount,
      passRate: `${((passedCount / (testsToRun.length || 1)) * 100).toFixed(1)}%`,
      durationSeconds: totalTime
    },
    results: runResults,
    escalations: testContext.escalations
  };
  console.log(JSON.stringify(jsonOutput, null, 2));
  process.exit(failedCount > 0 ? 1 : 0);
}

// Console Summary Dashboard
console.log(`
${COLORS.bold}${COLORS.cyan}================================================================================${COLORS.reset}
${COLORS.bold}${COLORS.cyan}                         E2E TEST EXECUTION SUMMARY                             ${COLORS.reset}
${COLORS.bold}${COLORS.cyan}================================================================================${COLORS.reset}
  Total Tests Run : ${COLORS.bold}${testsToRun.length}${COLORS.reset}
  Passed          : ${COLORS.bold}${COLORS.green}${passedCount}${COLORS.reset}
  Failed          : ${COLORS.bold}${failedCount > 0 ? COLORS.red : COLORS.green}${failedCount}${COLORS.reset}
  Pass Rate       : ${COLORS.bold}${((passedCount / (testsToRun.length || 1)) * 100).toFixed(1)}%${COLORS.reset}
  Total Duration  : ${COLORS.bold}${totalTime}s${COLORS.reset}

${COLORS.bold}TIER BREAKDOWN:${COLORS.reset}`);

const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];
for (const tr of tiers) {
  const trTests = runResults.filter(r => r.tier === tr);
  if (trTests.length === 0) continue;
  const p = trTests.filter(r => r.status === 'PASS').length;
  const f = trTests.filter(r => r.status === 'FAIL').length;
  const rate = ((p / trTests.length) * 100).toFixed(1);
  const color = f === 0 ? COLORS.green : COLORS.yellow;
  console.log(`  - ${tr.padEnd(8)}: ${color}${p}/${trTests.length} Passed (${rate}%)${COLORS.reset}`);
}

// Requirement Coverage Matrix
console.log(`\n${COLORS.bold}REQUIREMENTS COVERAGE MATRIX:${COLORS.reset}`);
const reqs = [
  { code: 'R1', name: 'Navigation Architecture (3 Dropdowns, Auth, Scroll, Mobile)', milestone: 'M1' },
  { code: 'R2', name: 'Hero Section & 3D Interactive Canvas (Clutter, Typography, CTA, Three.js)', milestone: 'M2' },
  { code: 'R3', name: 'Home Chapters Streamlining (Text Conciseness, Drawers, 1px Stroke, wasIn, SVG)', milestone: 'M3' },
  { code: 'R4', name: 'Smooth Scrolling & Cinematic Animations (Lenis, GSAP, Staggered, 60fps)', milestone: 'M4' }
];

for (const req of reqs) {
  const reqTests = runResults.filter(r => r.featureCode.startsWith(req.code));
  const p = reqTests.filter(r => r.status === 'PASS').length;
  const f = reqTests.filter(r => r.status === 'FAIL').length;
  const rate = reqTests.length > 0 ? ((p / reqTests.length) * 100).toFixed(1) : 'N/A';
  const color = f === 0 ? COLORS.green : (p > 0 ? COLORS.yellow : COLORS.red);
  console.log(`  • [${req.code}] ${req.name} (${req.milestone})`);
  console.log(`      Status: ${color}${p}/${reqTests.length} Passed (${rate}%)${COLORS.reset}`);
}

// Defect Escalation Report
if (testContext.escalations.length > 0) {
  console.log(`
${COLORS.bold}${COLORS.yellow}================================================================================${COLORS.reset}
${COLORS.bold}${COLORS.yellow}    IMPLEMENTATION DEFECT ESCALATION REPORT FOR WORKERS & ORCHESTRATOR         ${COLORS.reset}
${COLORS.bold}${COLORS.yellow}================================================================================${COLORS.reset}
${COLORS.gray}The following ${testContext.escalations.length} specification requirements failed and are escalated to implementing agents:${COLORS.reset}
`);

  // Group escalations by milestone
  const milestones = ['M1', 'M2', 'M3', 'M4', 'CURRENT'];
  for (const m of milestones) {
    const escList = testContext.escalations.filter(e => e.milestone === m);
    if (escList.length === 0) continue;
    console.log(`  ${COLORS.bold}${COLORS.cyan}[Milestone ${m}] — ${escList.length} Pending Requirement(s):${COLORS.reset}`);
    escList.slice(0, 8).forEach(e => {
      console.log(`    • ${COLORS.yellow}${e.testName}${COLORS.reset}`);
      console.log(`      ${COLORS.gray}Reason: ${e.error}${COLORS.reset}`);
    });
    if (escList.length > 8) {
      console.log(`      ${COLORS.gray}...and ${escList.length - 8} more tests for ${m}${COLORS.reset}`);
    }
    console.log('');
  }
} else {
  console.log(`
${COLORS.bold}${COLORS.green}================================================================================${COLORS.reset}
${COLORS.bold}${COLORS.green}     ALL TESTS PASSED! 100% SPECIFICATION AND ARCHITECTURAL COMPLIANCE         ${COLORS.reset}
${COLORS.bold}${COLORS.green}================================================================================${COLORS.reset}
`);
}

// Set Exit Code
if (failedCount > 0) {
  process.exitCode = 1;
} else {
  process.exitCode = 0;
}
