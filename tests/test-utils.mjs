/**
 * SomaiyaSat E2E Test Suite — Core Utilities & Assertion Engine
 * 
 * Provides assertions, source code inspection helpers, UI/state simulation harnesses,
 * and test runner lifecycle hooks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '..');

// ANSI Color Tokens
export const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m'
};

// Global Test Registry
class TestSuiteContext {
  constructor() {
    this.tests = [];
    this.currentTier = null;
    this.currentFeature = null;
    this.currentMilestone = 'CURRENT';
    this.results = [];
    this.escalations = [];
    this.startTime = 0;
    this.endTime = 0;
  }

  setTier(tierName, description) {
    this.currentTier = { name: tierName, description };
  }

  setFeature(featureCode, featureTitle, milestone = 'CURRENT') {
    this.currentFeature = { code: featureCode, title: featureTitle, milestone };
    this.currentMilestone = milestone;
  }

  registerTest(name, fn, meta = {}) {
    this.tests.push({
      id: `T${this.tests.length + 1}`,
      name,
      fn,
      tier: this.currentTier?.name || 'Tier 1',
      tierDesc: this.currentTier?.description || '',
      featureCode: this.currentFeature?.code || meta.featureCode || 'GEN',
      featureTitle: this.currentFeature?.title || meta.featureTitle || 'General',
      milestone: meta.milestone || this.currentMilestone || 'CURRENT',
      boundary: meta.boundary || null,
      interaction: meta.interaction || null,
      scenario: meta.scenario || null,
      tags: meta.tags || []
    });
  }
}

export const testContext = new TestSuiteContext();

// Test Registration DSL
export function describe(featureTitle, fn, options = {}) {
  const code = options.code || (featureTitle.match(/^[A-Z0-9.-]+/)?.[0] || 'FEAT');
  const milestone = options.milestone || 'CURRENT';
  testContext.setFeature(code, featureTitle, milestone);
  fn();
}

export function test(testName, fn, meta = {}) {
  testContext.registerTest(testName, fn, meta);
}

export const it = test;

// Assertion Library
class Expectation {
  constructor(actual, isNot = false) {
    this.actual = actual;
    this.isNot = isNot;
  }

  get not() {
    return new Expectation(this.actual, !this.isNot);
  }

  toBe(expected) {
    const pass = Object.is(this.actual, expected);
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(
        `Assertion failed: expected ${JSON.stringify(this.actual)} ${this.isNot ? 'NOT to be' : 'to be'} ${JSON.stringify(expected)}`
      );
    }
  }

  toEqual(expected) {
    const actualStr = JSON.stringify(this.actual);
    const expectedStr = JSON.stringify(expected);
    const pass = actualStr === expectedStr;
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(
        `Assertion failed: expected deeply equal:\n  Actual:   ${actualStr}\n  Expected: ${expectedStr}`
      );
    }
  }

  toBeTruthy() {
    const pass = Boolean(this.actual);
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(`Assertion failed: expected ${this.actual} ${this.isNot ? 'NOT to be truthy' : 'to be truthy'}`);
    }
  }

  toBeFalsy() {
    const pass = !Boolean(this.actual);
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(`Assertion failed: expected ${this.actual} ${this.isNot ? 'NOT to be falsy' : 'to be falsy'}`);
    }
  }

  toContain(item) {
    let pass = false;
    if (typeof this.actual === 'string') {
      pass = this.actual.includes(item);
    } else if (Array.isArray(this.actual)) {
      pass = this.actual.includes(item);
    } else if (this.actual && typeof this.actual === 'object') {
      pass = item in this.actual;
    }
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(
        `Assertion failed: expected container ${this.isNot ? 'NOT to contain' : 'to contain'} ${JSON.stringify(item)}`
      );
    }
  }

  toMatch(regex) {
    const pass = regex.test(String(this.actual));
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(
        `Assertion failed: expected "${String(this.actual).slice(0, 100)}" ${this.isNot ? 'NOT to match' : 'to match'} ${regex}`
      );
    }
  }

  toBeGreaterThan(expected) {
    const pass = Number(this.actual) > Number(expected);
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(`Assertion failed: expected ${this.actual} ${this.isNot ? 'NOT to be >' : 'to be >'} ${expected}`);
    }
  }

  toBeLessThan(expected) {
    const pass = Number(this.actual) < Number(expected);
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(`Assertion failed: expected ${this.actual} ${this.isNot ? 'NOT to be <' : 'to be <'} ${expected}`);
    }
  }

  toBeGreaterThanOrEqual(expected) {
    const pass = Number(this.actual) >= Number(expected);
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(`Assertion failed: expected ${this.actual} ${this.isNot ? 'NOT to be >=' : 'to be >='} ${expected}`);
    }
  }

  toBeLessThanOrEqual(expected) {
    const pass = Number(this.actual) <= Number(expected);
    const ok = this.isNot ? !pass : pass;
    if (!ok) {
      throw new Error(`Assertion failed: expected ${this.actual} ${this.isNot ? 'NOT to be <=' : 'to be <='} ${expected}`);
    }
  }
}

export function expect(actual) {
  return new Expectation(actual);
}

// File System / Source Code Inspection Helpers
const sourceCache = new Map();

export function getSource(relPath) {
  const fullPath = path.resolve(PROJECT_ROOT, relPath);
  if (sourceCache.has(fullPath)) {
    return sourceCache.get(fullPath);
  }
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Target file does not exist: ${relPath}`);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  sourceCache.set(fullPath, content);
  return content;
}

export function fileExists(relPath) {
  return fs.existsSync(path.resolve(PROJECT_ROOT, relPath));
}

// Paragraph sentence counter
export function countSentences(text) {
  if (!text) return 0;
  const clean = text.replace(/&[a-z0-9]+;/gi, ' ').trim();
  // Split on sentence boundary periods, exclamation, questions followed by space or end
  const matches = clean.match(/[^.!?]+[.!?]+(\s|$)/g);
  return matches ? matches.length : (clean.length > 0 ? 1 : 0);
}

// Scan for invalid CSS declarations
export function findInvalidCssDeclarations(source) {
  const invalidMatches = [];
  // Match `1px stroke` or `stroke ...` used as CSS border value
  const regex = /border:\s*['"][^'"]*stroke[^'"]*['"]/gi;
  let match;
  while ((match = regex.exec(source)) !== null) {
    invalidMatches.push({ match: match[0], index: match.index });
  }
  return invalidMatches;
}

// Extract JSX text contents inside paragraph elements
export function extractParagraphTexts(source) {
  const paragraphs = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(source)) !== null) {
    const clean = match[1]
      .replace(/<[^>]+>/g, '') // remove inner HTML tags
      .replace(/\s+/g, ' ')
      .trim();
    if (clean.length > 0) {
      paragraphs.push(clean);
    }
  }
  return paragraphs;
}

// Inspect collapsible details or accordions in JSX
export function extractCollapsibleDrawers(source) {
  const drawers = [];
  // Match <details> or motion accordion patterns
  const detailsRegex = /<details[\s\S]*?<\/details>/gi;
  let dMatch;
  while ((dMatch = detailsRegex.exec(source)) !== null) {
    drawers.push({ type: 'details', content: dMatch[0] });
  }
  // Also match custom accordion/drawer state patterns
  const accordionRegex = /(isExpanded|isOpen|showSpecs|showDrawer|expanded|toggleDrawer)/gi;
  let aMatch;
  while ((aMatch = accordionRegex.exec(source)) !== null) {
    drawers.push({ type: 'custom_state', identifier: aMatch[0] });
  }
  return drawers;
}

// Orbit Pass Timer State Machine Simulator
export function simulateOrbitTimerCountdown(initialSeconds, initialPassState, ticks = 1) {
  let timer = initialSeconds;
  let passState = initialPassState;
  const history = [{ timer, passState }];

  for (let i = 0; i < ticks; i++) {
    // Check if wasIn bug exists
    if (timer <= 1) {
      // In correct implementation:
      passState = !passState;
      timer = passState ? 420 : 3600;
    } else {
      timer -= 1;
    }
    history.push({ timer, passState });
  }

  return { finalTimer: timer, finalPassState: passState, history };
}

// Autonomous Decision AI State Logic Evaluator
export function evaluateAiScheduler(battery, snr) {
  if (snr > 75 && battery > 50) {
    return {
      activeMode: 'SSTV Image Transmission',
      activePriority: 'Priority 2 (High Bandwidth)',
      bandwidth: 'FULL (12.5 kHz)',
      primaryPacketType: 'IMAGE',
      queueTop: 'sstv',
      reason: 'Optimal link SNR (>75 dB) and strong battery (>50%) permit high-bandwidth SSTV downlink.'
    };
  } else if (snr > 40 && battery > 35) {
    return {
      activeMode: 'M17 / Codec2 Digital Voice',
      activePriority: 'Priority 3 (Medium Bandwidth)',
      bandwidth: 'SQUEEZED (3.2 kHz)',
      primaryPacketType: 'VOICE',
      queueTop: 'm17',
      reason: 'Moderate SNR (>40 dB). Squeezing transmission to low-bitrate Codec2 digital voice.'
    };
  } else {
    return {
      activeMode: 'TT&C Housekeeping (Safe Priority)',
      activePriority: 'Priority 1 (Failsafe)',
      bandwidth: 'MINIMAL (300 bps)',
      primaryPacketType: 'TELEMETRY',
      queueTop: 'ttc',
      reason: 'Low link quality or battery depletion. Falling back to TT&C housekeeping beacon only.'
    };
  }
}

// Auth State Machine Simulator
export function createMockAuthContext(initialUser = null) {
  let user = initialUser;
  let isLoggedIn = Boolean(initialUser);
  const listeners = new Set();

  return {
    getUser: () => user,
    getIsLoggedIn: () => isLoggedIn,
    login: (callsign, role = 'HAM Radio Operator') => {
      user = { callsign, role, timestamp: Date.now() };
      isLoggedIn = true;
      listeners.forEach(cb => cb({ user, isLoggedIn }));
    },
    logout: () => {
      user = null;
      isLoggedIn = false;
      listeners.forEach(cb => cb({ user, isLoggedIn }));
    },
    subscribe: (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    }
  };
}

// Three.js Scene Validator
export function validateThreeJsScene(source) {
  const hasScene = /new THREE\.Scene\(/.test(source);
  const hasCamera = /new THREE\.PerspectiveCamera\(/.test(source);
  const hasRenderer = /new THREE\.WebGLRenderer\(/.test(source);
  const hasEarth = /SphereGeometry/.test(source);
  const hasStars = /BufferGeometry/.test(source) && /Points/.test(source);
  const hasAnimation = /requestAnimationFrame/.test(source);
  const hasCleanup = /cancelAnimationFrame/.test(source) && /dispose\(\)/.test(source);

  return {
    hasScene,
    hasCamera,
    hasRenderer,
    hasEarth,
    hasStars,
    hasAnimation,
    hasCleanup,
    isComplete: hasScene && hasCamera && hasRenderer && hasEarth && hasStars && hasAnimation && hasCleanup
  };
}
