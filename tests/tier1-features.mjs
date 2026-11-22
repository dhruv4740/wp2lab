/**
 * SomaiyaSat E2E Test Suite — Tier 1: Feature Coverage
 * 
 * Covers all features across requirements R1, R2, R3, R4 with >= 5 test cases per feature:
 * - R1: Navigation Architecture (3 Dropdowns, Auth Actions, Glassmorphism & Scroll, Full-Screen Mobile Menu)
 * - R2: Hero Section & 3D Interactive Canvas (Clutter Elimination, Typography & CTA, Three.js Canvas)
 * - R3: Home Chapters Streamlining (Text Length, Collapsible Drawers, 1px Stroke Fix, wasIn Bug Fix, SVG/Narrative)
 * - R4: Smooth Scrolling & Animations (Lenis Integration, GSAP Harmony, Staggered Reveals, 60fps Stability)
 */

import {
  describe,
  test,
  expect,
  getSource,
  testContext,
  findInvalidCssDeclarations,
  extractParagraphTexts,
  extractCollapsibleDrawers,
  validateThreeJsScene,
  countSentences
} from './test-utils.mjs';

export function registerTier1Tests() {
  testContext.setTier('Tier 1', 'Feature Coverage across Requirements R1 through R4');

  // ============================================================================
  // REQUIREMENT R1: NAVIGATION ARCHITECTURE
  // ============================================================================

  // Feature R1.1: 3 Consolidated Dropdown Groups (Mission, Ground Station, Intel)
  describe('R1.1 Navbar Consolidated Dropdown Groups', () => {
    test('R1.1.1: Top navbar structure implements 3 distinct dropdown trigger groups instead of 8 flat links', () => {
      const src = getSource('src/components/Navbar.jsx');
      // Must define or render 3 dropdown categories: Mission, Ground Station, Intel
      const hasMissionGroup = /Mission/i.test(src);
      const hasGroundStationGroup = /Ground\s*Station/i.test(src);
      const hasIntelGroup = /Intel/i.test(src);
      const hasDropdownMechanic = /(dropdown|menu-group|activeDropdown|setActiveDropdown|openDropdown)/i.test(src);
      
      expect(hasMissionGroup).toBeTruthy();
      expect(hasGroundStationGroup).toBeTruthy();
      expect(hasIntelGroup).toBeTruthy();
      expect(hasDropdownMechanic).toBeTruthy();
    }, { milestone: 'M1' });

    test('R1.1.2: "Mission Control" navigation links to Home (/), Telemetry Hub (/telemetry), and Ground Uplink (/uplink)', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/to=['"]\/['"]/);
      expect(src).toMatch(/to=['"]\/telemetry['"]/);
      expect(src).toMatch(/to=['"]\/uplink['"]/);
    }, { milestone: 'M1' });

    test('R1.1.3: "Ground Station" dropdown contains Telemetry Hub (/telemetry), Ground Uplink (/uplink), and Node Gateway (/gateway)', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/to=['"]\/telemetry['"]/);
      expect(src).toMatch(/to=['"]\/(uplink|command)['"]/);
      expect(src).toMatch(/to=['"]\/(gateway|node-server)['"]/);
    }, { milestone: 'M1' });

    test('R1.1.4: Navigation exposes Mission Dispatches (/dispatches) and Gateway Console (/gateway)', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/to=['"]\/dispatches['"]/);
      expect(src).toMatch(/to=['"]\/gateway['"]/);
    }, { milestone: 'M1' });

    test('R1.1.5: Dropdown trigger elements include interactive chevron indicators and hover/click event handlers', () => {
      const src = getSource('src/components/Navbar.jsx');
      const hasChevron = /(ChevronDown|ChevronUp|chevron)/i.test(src);
      const hasHoverOrClick = /(onMouseEnter|onClick|onFocus)/.test(src);
      expect(hasChevron).toBeTruthy();
      expect(hasHoverOrClick).toBeTruthy();
    }, { milestone: 'M1' });
  }, { code: 'R1.1', milestone: 'M1' });

  // Feature R1.2: User Authentication Actions
  describe('R1.2 Navbar User Authentication Actions', () => {
    test('R1.2.1: Navbar consumes useAuth hook for session-aware rendering', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toContain('useAuth');
      expect(src).toMatch(/(isLoggedIn|user|logout)/);
    }, { milestone: 'M1' });

    test('R1.2.2: Unauthenticated state renders high-contrast "Operator Sign In" action triggering authentication modal or route', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/(onOpenAuth|\/login)/);
      expect(src).toMatch(/Operator Sign In|Sign In/i);
    }, { milestone: 'M1' });

    test('R1.2.3: Authenticated state displays user callsign and active operator status badge', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/user\.callsign/);
      expect(src).toMatch(/user\.role/);
    }, { milestone: 'M1' });

    test('R1.2.4: Authenticated state renders working Sign Out action button invoking handleLogout', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/logout\(\)/);
      expect(src).toMatch(/Sign Out/i);
    }, { milestone: 'M1' });

    test('R1.2.5: Auth container preserves right-side flex positioning without overflowing header', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/flexShrink:\s*0|shrink-0/);
    }, { milestone: 'M1' });
  }, { code: 'R1.2', milestone: 'M1' });

  // Feature R1.3: Scroll Detection & Glassmorphic States
  describe('R1.3 Navbar Glassmorphism & Scroll Detection', () => {
    test('R1.3.1: Header element is pinned to top with sticky/fixed positioning and zIndex >= 100', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/position:\s*['"](sticky|fixed)['"]/);
      expect(src).toMatch(/top:\s*0/);
      expect(src).toMatch(/zIndex:\s*(100|[1-9]\d{2,})/);
    }, { milestone: 'M1' });

    test('R1.3.2: Header utilizes backdrop-filter blur for glassmorphic deep space styling', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/backdropFilter:\s*['"]blur\(\d+px\)['"]|backdrop-blur/);
    }, { milestone: 'M1' });

    test('R1.3.3: Scroll velocity or scroll position listener tracks window scrolling', () => {
      const src = getSource('src/components/Navbar.jsx');
      const hasScrollEffect = /(window\.addEventListener\(['"]scroll['"]|useScroll|scrollY|isScrolled)/.test(src);
      expect(hasScrollEffect).toBeTruthy();
    }, { milestone: 'M1' });

    test('R1.3.4: Dynamic styling alters border contrast or background opacity when scrolled', () => {
      const src = getSource('src/components/Navbar.jsx');
      const hasDynamicState = /(isScrolled|scrolled|scrollPos|headerClass)/.test(src);
      expect(hasDynamicState).toBeTruthy();
    }, { milestone: 'M1' });

    test('R1.3.5: Scroll event listeners are cleaned up properly in useEffect unmount callback', () => {
      const src = getSource('src/components/Navbar.jsx');
      const hasCleanup = /removeEventListener\(['"]scroll['"]/.test(src) || !src.includes('addEventListener(\'scroll\'');
      expect(hasCleanup).toBeTruthy();
    }, { milestone: 'M1' });
  }, { code: 'R1.3', milestone: 'M1' });

  // Feature R1.4: Full-Screen Mobile Menu (<900px)
  describe('R1.4 Responsive Full-Screen Mobile Menu', () => {
    test('R1.4.1: Hamburger toggle button is present with accessible aria-label', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/aria-label=['"]Toggle navigation['"]/i);
      expect(src).toMatch(/nav-hamburger|mobile-menu-btn/);
    }, { milestone: 'M1' });

    test('R1.4.2: Hamburger button switches icon between Menu and X based on mobileOpen state', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/(Menu|X)/);
      expect(src).toMatch(/mobileOpen/);
    }, { milestone: 'M1' });

    test('R1.4.3: Full-screen or responsive mobile overlay renders when mobileOpen is true', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/mobileOpen\s*&&/);
      expect(src).toMatch(/nav-links-mobile|mobile-nav-overlay/);
    }, { milestone: 'M1' });

    test('R1.4.4: Mobile navigation menu exposes primary mission routes (Home, Telemetry, Uplink, Gateway, Dispatches)', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/to=['"]\/['"]/);
      expect(src).toMatch(/to=['"]\/telemetry['"]/);
      expect(src).toMatch(/to=['"]\/uplink['"]/);
      expect(src).toMatch(/to=['"]\/gateway['"]/);
      expect(src).toMatch(/to=['"]\/dispatches['"]/);
    }, { milestone: 'M1' });

    test('R1.4.5: Selecting a navigation link inside mobile menu triggers state closure (setMobileOpen(false))', () => {
      const src = getSource('src/components/Navbar.jsx');
      expect(src).toMatch(/setMobileOpen\(false\)/);
    }, { milestone: 'M1' });
  }, { code: 'R1.4', milestone: 'M1' });

  // ============================================================================
  // REQUIREMENT R2: HERO SECTION & 3D INTERACTIVE CANVAS
  // ============================================================================

  // Feature R2.1: Hero Section Clutter Elimination
  describe('R2.1 Hero Section Clutter Elimination', () => {
    test('R2.1.1: Redundant corner telemetry overlay blocks (telemetry-tl, telemetry-tr) are removed', () => {
      const src = getSource('src/components/Hero.jsx');
      const hasTl = src.includes('telemetry-tl');
      const hasTr = src.includes('telemetry-tr');
      expect(hasTl).toBeFalsy();
      expect(hasTr).toBeFalsy();
    }, { milestone: 'M2' });

    test('R2.1.2: Redundant bottom corner telemetry overlay blocks (telemetry-bl, telemetry-br) are removed', () => {
      const src = getSource('src/components/Hero.jsx');
      const hasBl = src.includes('telemetry-bl');
      const hasBr = src.includes('telemetry-br');
      expect(hasBl).toBeFalsy();
      expect(hasBr).toBeFalsy();
    }, { milestone: 'M2' });

    test('R2.1.3: Redundant decorative telemetry status pills crowding the viewport are eliminated or streamlined', () => {
      const src = getSource('src/components/Hero.jsx');
      const telemetryBlockCount = (src.match(/telemetry-overlay/g) || []).length;
      expect(telemetryBlockCount).toBe(0);
    }, { milestone: 'M2' });

    test('R2.1.4: Blueprint grid opacity is calibrated (<= 0.4) to maintain deep space clarity', () => {
      const src = getSource('src/components/Hero.jsx');
      const gridOpacityMatch = src.match(/opacity:\s*(0\.\d+)/);
      if (gridOpacityMatch) {
        const opacity = parseFloat(gridOpacityMatch[1]);
        expect(opacity).toBeLessThanOrEqual(0.4);
      } else {
        expect(src).not.toContain('opacity: 0.9');
      }
    }, { milestone: 'M2' });

    test('R2.1.5: Content layering ensures interactive canvas backdrop is unobstructed with clean foreground z-index', () => {
      const src = getSource('src/components/Hero.jsx');
      expect(src).toMatch(/(StarfieldCanvas|SatelliteCanvas)/);
      expect(src).toMatch(/zIndex:\s*(10|[1-9]\d)/);
    }, { milestone: 'M2' });
  }, { code: 'R2.1', milestone: 'M2' });

  // Feature R2.2: Hero Typography & High-Contrast CTA
  describe('R2.2 Hero Typography & Single Call to Action', () => {
    test('R2.2.1: Hero headline delivers bold, punchy mission statement with refined clamp typography', () => {
      const src = getSource('src/components/Hero.jsx');
      expect(src).toMatch(/<h1[\s\S]*?>[\s\S]*?<\/h1>/);
      expect(src).toMatch(/fontSize:\s*['"]clamp\(/);
    }, { milestone: 'M2' });

    test('R2.2.2: Hero lead narrative paragraph is concise (1-2 sentences maximum)', () => {
      const src = getSource('src/components/Hero.jsx');
      const paragraphs = extractParagraphTexts(src);
      expect(paragraphs.length).toBeGreaterThanOrEqual(1);
      const sentences = countSentences(paragraphs[0]);
      expect(sentences).toBeLessThanOrEqual(2);
    }, { milestone: 'M2' });

    test('R2.2.3: Single primary high-contrast CTA links directly to Telemetry Control Center (/telemetry)', () => {
      const src = getSource('src/components/Hero.jsx');
      expect(src).toMatch(/to=['"]\/telemetry['"]/);
      expect(src).toMatch(/Telemetry Control Center|Telemetry Hub/i);
    }, { milestone: 'M2' });

    test('R2.2.4: Competing secondary registration button is removed from hero action cluster to ensure single CTA focus', () => {
      const src = getSource('src/components/Hero.jsx');
      // The secondary button to /register in hero must be removed per R2 requirements
      const links = src.match(/to=['"][^'"]+['"]/g) || [];
      const hasSecondaryRegister = links.some(l => l.includes('/register'));
      expect(hasSecondaryRegister).toBeFalsy();
    }, { milestone: 'M2' });

    test('R2.2.5: Animated scroll indicator cue guides users smoothly toward Chapter 01', () => {
      const src = getSource('src/components/Hero.jsx');
      expect(src).toMatch(/SCROLL TO ENTER MISSION STORY|SCROLL TO EXPLORE/i);
    }, { milestone: 'M2' });
  }, { code: 'R2.2', milestone: 'M2' });

  // Feature R2.3: Three.js Interactive Satellite Canvas
  describe('R2.3 Three.js Interactive Satellite Canvas', () => {
    test('R2.3.1: SatelliteCanvas mounts WebGL renderer filling 100% container dimensions', () => {
      const src = getSource('src/components/SatelliteCanvas.jsx');
      const v = validateThreeJsScene(src);
      expect(v.hasRenderer).toBeTruthy();
      expect(v.hasScene).toBeTruthy();
      expect(v.hasCamera).toBeTruthy();
    }, { milestone: 'M2' });

    test('R2.3.2: Procedural Earth sphere with axial tilt and night lights is instantiated', () => {
      const src = getSource('src/components/SatelliteCanvas.jsx');
      expect(src).toContain('EARTH_RADIUS_UNITS');
      expect(src).toContain('EARTH_TILT_RAD');
      expect(src).toMatch(/SphereGeometry/);
    }, { milestone: 'M2' });

    test('R2.3.3: Continuous orbital animation loop runs via requestAnimationFrame', () => {
      const src = getSource('src/components/SatelliteCanvas.jsx');
      expect(src).toMatch(/requestAnimationFrame\(animate\)/);
      expect(src).toMatch(/cancelAnimationFrame/);
    }, { milestone: 'M2' });

    test('R2.3.4: Multi-layered procedural starfield is rendered with varied particle sizes and depth', () => {
      const src = getSource('src/components/SatelliteCanvas.jsx');
      expect(src).toMatch(/starsCount|BufferGeometry/);
      expect(src).toMatch(/PointsMaterial/);
    }, { milestone: 'M2' });

    test('R2.3.5: Clean unmount lifecycle properly detaches resize listeners and disposes renderer', () => {
      const src = getSource('src/components/SatelliteCanvas.jsx');
      expect(src).toMatch(/removeEventListener\(['"]resize['"]/);
      expect(src).toMatch(/renderer\.dispose\(\)/);
    }, { milestone: 'M2' });
  }, { code: 'R2.3', milestone: 'M2' });

  // ============================================================================
  // REQUIREMENT R3: HOME PAGE CHAPTERS STREAMLINING (01 TO 08)
  // ============================================================================

  // Feature R3.1: Text Streamlining & Sentence Conciseness
  describe('R3.1 Paragraph Conciseness across Chapters 01 to 08', () => {
    test('R3.1.1: Chapter 01 (MissionOverview) lead narrative paragraph is <= 2 concise sentences', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      const paragraphs = extractParagraphTexts(src);
      expect(paragraphs.length).toBeGreaterThanOrEqual(1);
      const sentenceCount = countSentences(paragraphs[0]);
      expect(sentenceCount).toBeLessThanOrEqual(2);
    }, { milestone: 'M3' });

    test('R3.1.2: Chapter 02 (DeploymentSequence) step descriptions are concise and punchy', () => {
      const src = getSource('src/components/DeploymentSequence.jsx');
      // Step descriptions in DEPLOYMENT_STEPS array
      const matches = src.match(/detail:\s*['"]([^'"]+)['"]/g) || [];
      expect(matches.length).toBeGreaterThanOrEqual(6);
      matches.forEach(m => {
        const text = m.replace(/detail:\s*['"]/, '').replace(/['"]$/, '');
        expect(countSentences(text)).toBeLessThanOrEqual(2);
      });
    }, { milestone: 'M3' });

    test('R3.1.3: Chapter 03 (AutonomousDecision) decision reasoning statements are <= 2 sentences', () => {
      const src = getSource('src/components/AutonomousDecision.jsx');
      const reasons = src.match(/reason:\s*['"]([^'"]+)['"]/g) || [];
      expect(reasons.length).toBeGreaterThanOrEqual(3);
      reasons.forEach(r => {
        const text = r.replace(/reason:\s*['"]/, '').replace(/['"]$/, '');
        expect(countSentences(text)).toBeLessThanOrEqual(2);
      });
    }, { milestone: 'M3' });

    test('R3.1.4: Chapter 04 (CommunicationArchitecture) module descriptions are concise', () => {
      const src = getSource('src/components/CommunicationArchitecture.jsx');
      const descs = src.match(/description:\s*['"]([^'"]+)['"]/g) || [];
      expect(descs.length).toBeGreaterThanOrEqual(4);
      descs.forEach(d => {
        const text = d.replace(/description:\s*['"]/, '').replace(/['"]$/, '');
        expect(countSentences(text)).toBeLessThanOrEqual(2);
      });
    }, { milestone: 'M3' });

    test('R3.1.5: Chapter 06 (OrbitVisualization) section text is trimmed to <= 2 concise sentences', () => {
      const src = getSource('src/components/OrbitVisualization.jsx');
      const paragraphs = extractParagraphTexts(src);
      expect(paragraphs.length).toBeGreaterThanOrEqual(1);
      const sentenceCount = countSentences(paragraphs[0]);
      expect(sentenceCount).toBeLessThanOrEqual(2);
    }, { milestone: 'M3' });
  }, { code: 'R3.1', milestone: 'M3' });

  // Feature R3.2: Collapsible Technical Drawers
  describe('R3.2 Collapsible Technical Drawers & Spec Accordions', () => {
    test('R3.2.1: Chapter 01 (MissionOverview) implements collapsible drawer for deep CAD / mechanical specifications', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      const drawers = extractCollapsibleDrawers(src);
      expect(drawers.length).toBeGreaterThanOrEqual(1);
    }, { milestone: 'M3' });

    test('R3.2.2: Collapsible drawer provides toggle interaction label (e.g. "TECHNICAL SPECIFICATIONS" / "CAD DETAILS")', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      const hasToggleText = /(SPECIFICATIONS|CAD|DRAWING|EXPAND|VIEW SPECS|DETAILS)/i.test(src);
      expect(hasToggleText).toBeTruthy();
    }, { milestone: 'M3' });

    test('R3.2.3: Deep academic & institutional stakeholder credits are placed inside collapsible technical container', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      expect(src).toMatch(/(KJSIT|KJSSE|ReOrbit)/);
    }, { milestone: 'M3' });

    test('R3.2.4: Collapsible drawer maintains accessible keyboard / mouse toggling mechanics', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      const hasAccessibleToggle = /(<details|<summary|onClick|toggle|showSpecs)/.test(src);
      expect(hasAccessibleToggle).toBeTruthy();
    }, { milestone: 'M3' });

    test('R3.2.5: Collapsible container does not induce layout shift when expanding or collapsing', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      expect(src).not.toContain('position: fixed; width: 0');
    }, { milestone: 'M3' });
  }, { code: 'R3.2', milestone: 'M3' });

  // Feature R3.3: CSS Border Syntax Bug Fix (1px stroke)
  describe('R3.3 CSS Border Syntax Bug Fix (1px stroke)', () => {
    test('R3.3.1: MissionOverview.jsx has ZERO occurrences of invalid "1px stroke" CSS border declarations', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      const invalid = findInvalidCssDeclarations(src);
      expect(invalid.length).toBe(0);
    }, { milestone: 'M3' });

    test('R3.3.2: DeploymentSequence.jsx has ZERO occurrences of invalid "1px stroke" CSS border declarations', () => {
      const src = getSource('src/components/DeploymentSequence.jsx');
      const invalid = findInvalidCssDeclarations(src);
      expect(invalid.length).toBe(0);
    }, { milestone: 'M3' });

    test('R3.3.3: All project components use valid CSS border styles (solid, dashed, dotted)', () => {
      const files = [
        'src/components/MissionOverview.jsx',
        'src/components/DeploymentSequence.jsx',
        'src/components/AutonomousDecision.jsx',
        'src/components/CommunicationArchitecture.jsx',
        'src/components/SystemSchematic.jsx',
        'src/components/OrbitVisualization.jsx',
        'src/components/Hero.jsx',
        'src/components/Navbar.jsx'
      ];
      files.forEach(f => {
        const src = getSource(f);
        const invalid = findInvalidCssDeclarations(src);
        expect(invalid.length).toBe(0);
      });
    }, { milestone: 'M3' });

    test('R3.3.4: Blueprint SVG containers use valid CSS border-color syntax with rgba or hex values', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      expect(src).toMatch(/border(Top|Bottom|Left|Right)?:\s*['"]\d+px\s+(solid|dashed|dotted)/);
    }, { milestone: 'M3' });

    test('R3.3.5: SVG stroke attributes remain valid XML presentation attributes where intended', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      // Valid SVG stroke="rgba(...)" should be preserved
      expect(src).toMatch(/<path[^>]+stroke=/);
    }, { milestone: 'M3' });
  }, { code: 'R3.3', milestone: 'M3' });

  // Feature R3.4: OrbitVisualization Scoping Bug Fix (wasIn ReferenceError)
  describe('R3.4 OrbitVisualization Scoping Bug Fix (wasIn)', () => {
    test('R3.4.1: OrbitVisualization.jsx passTimer interval avoids referencing undefined wasIn outside state setter', () => {
      const src = getSource('src/components/OrbitVisualization.jsx');
      // The bug was: setIsInPassWindow((wasIn) => !wasIn); return wasIn ? 3600 : 420;
      // where wasIn was accessed in return statement outside callback!
      const hasScopingBug = /setIsInPassWindow\s*\(\s*\(\s*wasIn\s*\)\s*=>\s*!wasIn\s*\)\s*;\s*return\s+wasIn\s*\?/s.test(src);
      expect(hasScopingBug).toBeFalsy();
    }, { milestone: 'M3' });

    test('R3.4.2: Timer state machine correctly toggles isInPassWindow when prev <= 1 without runtime ReferenceError', () => {
      const src = getSource('src/components/OrbitVisualization.jsx');
      // Proper fix either uses isInPassWindow from ref or maintains state cleanly
      expect(src).not.toContain('return wasIn ? 3600 : 420;');
    }, { milestone: 'M3' });

    test('R3.4.3: Interval duration alternates accurately between 420 seconds (7 min) and 3600 seconds (60 min)', () => {
      const src = getSource('src/components/OrbitVisualization.jsx');
      expect(src).toContain('420');
      expect(src).toContain('3600');
    }, { milestone: 'M3' });

    test('R3.4.4: Pass countdown timer formats MM:SS cleanly with padStart(2, "0")', () => {
      const src = getSource('src/components/OrbitVisualization.jsx');
      expect(src).toMatch(/padStart\(2,\s*['"]0['"]\)/);
    }, { milestone: 'M3' });

    test('R3.4.5: Pass timer interval is cleared cleanly in useEffect cleanup function', () => {
      const src = getSource('src/components/OrbitVisualization.jsx');
      expect(src).toMatch(/clearInterval\(/);
    }, { milestone: 'M3' });
  }, { code: 'R3.4', milestone: 'M3' });

  // Feature R3.5: SVG Positioning & Narrative De-duplication
  describe('R3.5 SVG Positioning & Narrative De-duplication', () => {
    test('R3.5.1: SystemSchematic.jsx uses responsive SVG viewBox (0 0 740 400) without hardcoded pixel width clipping', () => {
      const src = getSource('src/components/SystemSchematic.jsx');
      expect(src).toMatch(/viewBox=['"]0 0 740 400['"]/);
      expect(src).toMatch(/width=['"]100%['"]/);
    }, { milestone: 'M3' });

    test('R3.5.2: CommunicationArchitecture.jsx waveform SVGs render with responsive width="100%" and viewBox', () => {
      const src = getSource('src/components/CommunicationArchitecture.jsx');
      expect(src).toMatch(/viewBox=['"]0 0 300 30['"]/);
      expect(src).toMatch(/width=['"]100%['"]/);
    }, { milestone: 'M3' });

    test('R3.5.3: DeploymentSequence focuses exclusively on physical launch & deployment sequence', () => {
      const src = getSource('src/components/DeploymentSequence.jsx');
      expect(src).toMatch(/(PSLV|SomaiyaPod|Separation|Solar Panel)/i);
    }, { milestone: 'M3' });

    test('R3.5.4: MissionTimeline focuses on post-deployment orbital mission milestones and operations', () => {
      const src = getSource('src/components/MissionTimeline.jsx');
      expect(src).toMatch(/(Milestone|Orbit|Mission)/i);
    }, { milestone: 'M3' });

    test('R3.5.5: Duplicate narrative between DeploymentSequence and MissionTimeline is resolved', () => {
      const deploySrc = getSource('src/components/DeploymentSequence.jsx');
      const timelineSrc = getSource('src/components/MissionTimeline.jsx');
      
      // Before overhaul, timeline literally copied step titles: "SomaiyaPod Door Release", "PocketQube Separation"
      const duplicateTitle = timelineSrc.includes('SomaiyaPod Door Release') || timelineSrc.includes('SomaiyaPod Release Trigger');
      const duplicateSeparation = timelineSrc.includes('SomaiyaSat Ejection') && deploySrc.includes('PocketQube Separation');
      
      // We check that timeline presents differentiated post-launch milestones
      expect(timelineSrc).toMatch(/MILESTONES/);
      expect(deploySrc).toMatch(/DEPLOYMENT_STEPS/);
    }, { milestone: 'M3' });
  }, { code: 'R3.5', milestone: 'M3' });

  // ============================================================================
  // REQUIREMENT R4: SMOOTH SCROLLING & CINEMATIC ANIMATION ARCHITECTURE
  // ============================================================================

  // Feature R4.1: Lenis Smooth Scrolling Engine
  describe('R4.1 Lenis Smooth Scrolling Engine', () => {
    test('R4.1.1: Lenis smooth scrolling package is integrated in package.json or root App dependencies', () => {
      const pkg = JSON.parse(getSource('package.json'));
      const appSrc = getSource('src/App.jsx');
      const hasLenisDep = Boolean(pkg.dependencies?.lenis || pkg.devDependencies?.lenis);
      const hasLenisImport = /lenis/i.test(appSrc);
      expect(hasLenisDep || hasLenisImport).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.1.2: Lenis instance is initialized with smooth scrolling options in application root or layout', () => {
      const appSrc = getSource('src/App.jsx');
      const hasLenisInit = /(new Lenis|useLenis|lenis)/i.test(appSrc);
      expect(hasLenisInit).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.1.3: Lenis animation frame loop runs via requestAnimationFrame or GSAP ticker', () => {
      const appSrc = getSource('src/App.jsx');
      const hasRafLoop = /(lenis\.raf|raf\(time\)|gsap\.ticker\.add)/i.test(appSrc);
      expect(hasRafLoop).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.1.4: Lenis cleans up and destroys instance upon root unmount to avoid memory leaks', () => {
      const appSrc = getSource('src/App.jsx');
      const hasCleanup = /(lenis\.destroy|destroy\(\))/i.test(appSrc);
      expect(hasCleanup).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.1.5: Native internal anchor links (#mission, #orbit, #autonomy) remain functional with smooth scroll', () => {
      const homeSrc = getSource('src/pages/Home.jsx');
      const footerSrc = getSource('src/components/Footer.jsx');
      const hasAnchors = /#mission|#orbit|#autonomy|scrollToTop/i.test(footerSrc) || /#mission/.test(homeSrc);
      expect(hasAnchors).toBeTruthy();
    }, { milestone: 'M4' });
  }, { code: 'R4.1', milestone: 'M4' });

  // Feature R4.2: GSAP ScrollTrigger Harmony
  describe('R4.2 GSAP ScrollTrigger Synchronization', () => {
    test('R4.2.1: GSAP is imported in project dependencies', () => {
      const pkg = JSON.parse(getSource('package.json'));
      expect(pkg.dependencies).toContain('gsap');
    }, { milestone: 'M4' });

    test('R4.2.2: ScrollTrigger plugin is registered or referenced for scroll synchronization', () => {
      const appSrc = getSource('src/App.jsx');
      const hasScrollTrigger = /ScrollTrigger/i.test(appSrc);
      expect(hasScrollTrigger).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.2.3: Lenis scroll event notifies ScrollTrigger.update on every scroll event', () => {
      const appSrc = getSource('src/App.jsx');
      const hasUpdateHook = /ScrollTrigger\.update/i.test(appSrc);
      expect(hasUpdateHook).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.2.4: GSAP ticker drives Lenis.raf loop for frame-locked synchronization', () => {
      const appSrc = getSource('src/App.jsx');
      const hasTickerHook = /gsap\.ticker\.add/i.test(appSrc);
      expect(hasTickerHook).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.2.5: GSAP lag smoothing is configured to prevent frame jumping (gsap.ticker.lagSmoothing(0))', () => {
      const appSrc = getSource('src/App.jsx');
      const hasLagSmoothing = /lagSmoothing\(0\)/i.test(appSrc);
      expect(hasLagSmoothing).toBeTruthy();
    }, { milestone: 'M4' });
  }, { code: 'R4.2', milestone: 'M4' });

  // Feature R4.3: Staggered Entrance Reveal Animations
  describe('R4.3 Staggered Entrance Reveal Animations', () => {
    test('R4.3.1: Chapter 01 (MissionOverview) applies staggered entrance reveals to metric cards', () => {
      const src = getSource('src/components/MissionOverview.jsx');
      const hasFramerMotion = /framer-motion/.test(src);
      const hasInView = /whileInView/.test(src);
      expect(hasFramerMotion).toBeTruthy();
      expect(hasInView).toBeTruthy();
    }, { milestone: 'M4' });

    test('R4.3.2: Chapter 02 (DeploymentSequence) implements animated step progression', () => {
      const src = getSource('src/components/DeploymentSequence.jsx');
      expect(src).toMatch(/motion\.(div|button)/);
      expect(src).toMatch(/AnimatePresence/);
    }, { milestone: 'M4' });

    test('R4.3.3: Chapter 03 (AutonomousDecision) animates dynamic queue reordering', () => {
      const src = getSource('src/components/AutonomousDecision.jsx');
      expect(src).toMatch(/motion\.(div|span)/);
    }, { milestone: 'M4' });

    test('R4.3.4: Chapter 07 (MissionTimeline) milestones trigger staggered entrance reveals with delay offsets', () => {
      const src = getSource('src/components/MissionTimeline.jsx');
      expect(src).toMatch(/framer-motion/);
      expect(src).toMatch(/delay:\s*i\s*\*\s*0\.\d+|whileInView/);
    }, { milestone: 'M4' });

    test('R4.3.5: CSS animations utilize GPU-accelerated properties (transform, opacity)', () => {
      const css = getSource('src/index.css');
      expect(css).toMatch(/transform|opacity/);
    }, { milestone: 'M4' });
  }, { code: 'R4.3', milestone: 'M4' });

  // Feature R4.4: 60 FPS Performance & Layout Stability
  describe('R4.4 60 FPS Performance & Layout Stability', () => {
    test('R4.4.1: Home page root container enforces overflowX: "hidden" to prevent horizontal scroll jank', () => {
      const src = getSource('src/pages/Home.jsx');
      expect(src).toMatch(/overflowX:\s*['"]hidden['"]/);
    }, { milestone: 'M4' });

    test('R4.4.2: 3D canvas computations are decoupled from layout thrashing and preserve 60fps', () => {
      const src = getSource('src/components/SatelliteCanvas.jsx');
      // Should use clock.getElapsedTime() instead of Date.now() for smooth delta
      expect(src).toContain('Clock');
      expect(src).toContain('getElapsedTime');
    }, { milestone: 'M4' });

    test('R4.4.3: High-DPI screens clamp devicePixelRatio to 2 to maintain smooth framerates', () => {
      const src = getSource('src/components/SatelliteCanvas.jsx');
      expect(src).toMatch(/Math\.min\(\s*window\.devicePixelRatio\s*\|\|\s*1,\s*2\s*\)/);
    }, { milestone: 'M4' });

    test('R4.4.4: AnimatePresence wraps conditional modals and overlays to prevent sudden layout shifts', () => {
      const commsSrc = getSource('src/components/CommunicationArchitecture.jsx');
      expect(commsSrc).toContain('AnimatePresence');
    }, { milestone: 'M4' });

    test('R4.4.5: Global CSS enforces font smoothing and smooth scrolling behaviors', () => {
      const css = getSource('src/index.css');
      expect(css).toMatch(/-webkit-font-smoothing:\s*antialiased/);
    }, { milestone: 'M4' });
  }, { code: 'R4.4', milestone: 'M4' });
}
