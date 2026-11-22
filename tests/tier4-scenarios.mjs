/**
 * SomaiyaSat E2E Test Suite — Tier 4: Real-World Application Scenarios
 * 
 * Verifies complete, multi-step end-to-end user journeys simulating real-world usage:
 * - Scenario 4.1: First-Time Visitor Deep-Space Exploration Journey
 * - Scenario 4.2: Ground Station Operator Pass Window Monitoring Journey
 * - Scenario 4.3: Amateur Radio Operator Technical Specification Audit Journey
 * - Scenario 4.4: Autonomous Decision-Making Stress Simulation Journey
 * - Scenario 4.5: Mobile Ground Operator Responsive Field Access Journey
 */

import {
  describe,
  test,
  expect,
  getSource,
  testContext,
  evaluateAiScheduler,
  simulateOrbitTimerCountdown,
  createMockAuthContext,
  countSentences,
  extractParagraphTexts
} from './test-utils.mjs';

export function registerTier4Tests() {
  testContext.setTier('Tier 4', 'Real-World Application Scenarios & Complete User Journeys');

  describe('Tier 4 End-to-End User Journeys', () => {
    // --------------------------------------------------------------------------
    // Scenario 4.1: First-Time Visitor Deep-Space Exploration Journey
    // --------------------------------------------------------------------------
    test('J4.1: First-Time Visitor Deep-Space Exploration Journey', () => {
      // Step 1: User arrives at landing page (Home.jsx) with 4 streamlined chapters
      const homeSrc = getSource('src/pages/Home.jsx');
      expect(homeSrc).toMatch(/<Hero\s*\/>/);
      expect(homeSrc).toMatch(/<MissionBrief\s*\/>/);
      expect(homeSrc).toMatch(/<TechCapabilities\s*\/>/);
      expect(homeSrc).toMatch(/<MissionTimeline\s*\/>/);

      // Step 2: Hero section loads with clean cinematic canvas & single CTA
      const heroSrc = getSource('src/components/Hero.jsx');
      expect(heroSrc).toMatch(/StarfieldCanvas/);
      expect(heroSrc).toMatch(/to=['"]\/telemetry['"]/);
      // Verify no cluttered corner telemetry
      expect(heroSrc).not.toContain('telemetry-tl');

      // Step 3: User reads concise MissionBrief overview
      const briefSrc = getSource('src/components/MissionBrief.jsx');
      expect(briefSrc).toMatch(/PocketQube/i);

      // Step 4: Technical architecture flow verified
      const techSrc = getSource('src/components/TechCapabilities.jsx');
      expect(techSrc).toMatch(/Transceiver|Sensor Bus/i);
      expect(techSrc).toMatch(/Autonomous AI Router|AI Router/i);
    }, { scenario: 'First-Time Visitor Journey', milestone: 'M2' });

    // --------------------------------------------------------------------------
    // Scenario 4.2: Ground Station Operator Pass Window Monitoring Journey
    // --------------------------------------------------------------------------
    test('J4.2: Ground Station Operator Pass Window Monitoring Journey', () => {
      // Step 1: Operator accesses Top Navbar and verifies Ground Station dropdown
      const navSrc = getSource('src/components/Navbar.jsx');
      expect(navSrc).toMatch(/to=['"]\/telemetry['"]/);
      expect(navSrc).toMatch(/to=['"]\/(uplink|command)['"]/);
      expect(navSrc).toMatch(/to=['"]\/(gateway|node-server)['"]/);

      // Step 2: Operator inspects Orbit Pass Visualization in Chapter 06
      const orbitSrc = getSource('src/components/OrbitVisualization.jsx');
      expect(orbitSrc).toMatch(/id=['"]orbit['"]/);
      expect(orbitSrc).toContain('SatelliteCanvas');

      // Step 3: Verify countdown transition logic (420s -> 0s -> 3600s)
      const simPass = simulateOrbitTimerCountdown(3, true, 3);
      expect(simPass.finalPassState).toBe(false);
      expect(simPass.finalTimer).toBe(3600);

      // Step 4: Verify out-of-pass countdown to next contact window
      const simOut = simulateOrbitTimerCountdown(2, false, 2);
      expect(simOut.finalPassState).toBe(true);
      expect(simOut.finalTimer).toBe(420);
    }, { scenario: 'Ground Station Pass Monitoring', milestone: 'M3' });

    // --------------------------------------------------------------------------
    // Scenario 4.3: Amateur Radio Operator Technical Specification Audit Journey
    // --------------------------------------------------------------------------
    test('J4.3: Amateur Radio Operator Technical Specification Audit Journey', () => {
      // Step 1: HAM operator navigates to Chapter 01 (MissionOverview)
      const ch1Src = getSource('src/components/MissionOverview.jsx');
      expect(ch1Src).toMatch(/437/);
      expect(ch1Src).toMatch(/MHz/);
      expect(ch1Src).toMatch(/2P\s*PocketQube/i);

      // Step 2: HAM operator checks technical specification drawer
      const hasDrawer = /(<details|<summary|isExpanded|isOpen|showSpecs|showDrawer)/.test(ch1Src);
      expect(hasDrawer).toBeTruthy();

      // Step 3: HAM operator visits Chapter 04 (CommunicationArchitecture)
      const ch4Src = getSource('src/components/CommunicationArchitecture.jsx');
      expect(ch4Src).toMatch(/AX\.25|APRS/);
      expect(ch4Src).toMatch(/Codec2/);
      expect(ch4Src).toMatch(/M17/);
      expect(ch4Src).toMatch(/SSTV/);

      // Step 4: Verify RF waveforms render with responsive viewports
      expect(ch4Src).toMatch(/<svg[^>]+viewBox=['"]0 0 300 30['"]/);
    }, { scenario: 'HAM Operator Spec Audit', milestone: 'M3' });

    // --------------------------------------------------------------------------
    // Scenario 4.4: Autonomous Decision-Making Stress Simulation Journey
    // --------------------------------------------------------------------------
    test('J4.4: Autonomous Decision-Making Stress Simulation Journey', () => {
      // Step 1: Normal pass condition (Battery=85%, SNR=80 dB)
      const nominal = evaluateAiScheduler(85, 80);
      expect(nominal.activeMode).toContain('SSTV');
      expect(nominal.bandwidth).toContain('FULL');
      expect(nominal.queueTop).toBe('sstv');

      // Step 2: Degrading RF link (Battery=85%, SNR=45 dB)
      const degradedLink = evaluateAiScheduler(85, 45);
      expect(degradedLink.activeMode).toContain('Codec2');
      expect(degradedLink.bandwidth).toContain('SQUEEZED');
      expect(degradedLink.queueTop).toBe('m17');

      // Step 3: Eclipse entry & critical power drop (Battery=25%, SNR=45 dB)
      const criticalPower = evaluateAiScheduler(25, 45);
      expect(criticalPower.activeMode).toContain('TT&C');
      expect(criticalPower.bandwidth).toContain('MINIMAL');
      expect(criticalPower.queueTop).toBe('ttc');

      // Step 4: Zero battery disaster recovery (Battery=0%, SNR=0 dB)
      const blackOut = evaluateAiScheduler(0, 0);
      expect(blackOut.activeMode).toContain('TT&C');
      expect(blackOut.queueTop).toBe('ttc');
    }, { scenario: 'AI Decision Stress Simulation', milestone: 'M3' });

    // --------------------------------------------------------------------------
    // Scenario 4.5: Mobile Ground Operator Responsive Field Access Journey
    // --------------------------------------------------------------------------
    test('J4.5: Mobile Ground Operator Responsive Field Access Journey', () => {
      // Step 1: Mobile device access (<900px)
      const css = getSource('src/index.css');
      expect(css).toMatch(/@media\s*\(\s*max-width:\s*900px\s*\)/);

      // Step 2: Mobile operator toggles hamburger menu in Navbar
      const navSrc = getSource('src/components/Navbar.jsx');
      expect(navSrc).toMatch(/className=['"]nav-hamburger['"]/);
      expect(navSrc).toMatch(/onClick=\{[^}]*setMobileOpen/);

      // Step 3: Mobile overlay displays categorized navigation links
      expect(navSrc).toMatch(/to=['"]\/dispatches['"]/);
      expect(navSrc).toMatch(/to=['"]\/telemetry['"]/);

      // Step 4: Selecting destination closes mobile menu and navigates
      expect(navSrc).toMatch(/setMobileOpen\(false\)/);
    }, { scenario: 'Mobile Field Operator Access', milestone: 'M1' });
  }, { code: 'T4' });
}
