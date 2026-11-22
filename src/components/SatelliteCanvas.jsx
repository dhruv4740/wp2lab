import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const EARTH_RADIUS_UNITS = 2.2;
const ORBIT_ALT = 0.12;          // 350 km scaled: ~5.5% of Earth radius
const ORBIT_RADIUS = EARTH_RADIUS_UNITS + ORBIT_ALT;
const INCLINATION_RAD = (9.6 * Math.PI) / 180;
const EARTH_TILT_RAD = (23.5 * Math.PI) / 180;

// Mumbai ground station (lat 19.076° N, lon 72.877° E)
const MUMBAI_LAT = (19.076 * Math.PI) / 180;
const MUMBAI_LON = (72.877 * Math.PI) / 180;

// Geographically calibrated 3D coordinates matching NASA Blue Marble equirectangular projection
function geoToXyz(latRad, lonRad, r) {
  const latDeg = (latRad * 180) / Math.PI;
  const lonDeg = (lonRad * 180) / Math.PI;
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lonDeg + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// NASA / three-globe CDN textures
const TEX = {
  day:    'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
  night:  'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg',
  topo:   'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
  clouds: 'https://unpkg.com/three-globe@2.31.1/example/img/earth-clouds.png',
};

// Procedural Photorealistic Earth Fallback Texture Generator
function createProceduralEarthCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Deep oceanic blue gradient (True NASA space observation tones)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#040d1a');
  oceanGrad.addColorStop(0.3, '#081e3a');
  oceanGrad.addColorStop(0.5, '#0b2648');
  oceanGrad.addColorStop(0.7, '#081e3a');
  oceanGrad.addColorStop(1, '#040d1a');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Muted earthy continents (Eurasia, Africa, India, Americas)
  ctx.fillStyle = '#1e3223';
  
  // Eurasia / Africa landmass
  ctx.beginPath();
  ctx.ellipse(560, 190, 160, 90, 0, 0, Math.PI * 2);
  ctx.fill();

  // Indian Subcontinent
  ctx.fillStyle = '#2d3f28';
  ctx.beginPath();
  ctx.moveTo(700, 175);
  ctx.lineTo(740, 175);
  ctx.lineTo(720, 240);
  ctx.closePath();
  ctx.fill();

  // Americas
  ctx.fillStyle = '#1e3020';
  ctx.beginPath();
  ctx.ellipse(250, 190, 60, 100, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(320, 330, 50, 90, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Polar ice caps
  ctx.fillStyle = '#d8e5f2';
  ctx.fillRect(0, 0, 1024, 30);
  ctx.fillRect(0, 485, 1024, 27);

  return canvas;
}

// Rayleigh & Mie Fresnel Atmosphere Shaders
const VERT = /* glsl */`
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG_INNER = /* glsl */`
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.78 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
    gl_FragColor = vec4(0.05, 0.45, 0.90, 1.0) * intensity;
  }
`;

const FRAG_OUTER = /* glsl */`
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 5.0);
    gl_FragColor = vec4(0.08, 0.50, 0.98, 1.0) * (intensity * 0.4);
  }
`;

export default function SatelliteCanvas({
  mode = 'hero',
  cameraMode = 'orbit',
  isInPassWindow = true,
  dissectionExplode = 1.0,
  activeSubsystem = 'obc',
  onCameraChange = null,
  onThrusterFire = null
}) {
  const containerRef = useRef(null);
  const cameraModeRef = useRef(cameraMode);
  const explodeRef = useRef(dissectionExplode);
  const activeSubsystemRef = useRef(activeSubsystem);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    explodeRef.current = dissectionExplode;
  }, [dissectionExplode]);

  useEffect(() => {
    activeSubsystemRef.current = activeSubsystem;
  }, [activeSubsystem]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;

    let renderer, animId;

    try {
      // ── Scene & Camera ────────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, Math.max(width / (height || 1), 0.1), 0.01, 250);
      let camDistance = mode === 'hero' ? 8.5 : 10.5;
      camera.position.set(0, 1.2, camDistance);
      camera.lookAt(0, 0, 0);

      // ── Renderer ──────────────────────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // ── Space Lighting (Crisp High-Contrast Cinematic Illumination) ───────────
      const ambientLight = new THREE.AmbientLight(0x1a2638, 0.95);
      scene.add(ambientLight);
      
      // Direct Sun (Key Light)
      const sun = new THREE.DirectionalLight(0xffffff, 5.8);
      sun.position.set(10, 4, 6);
      scene.add(sun);
      
      // Earth Albedo Secondary Fill
      const fill = new THREE.DirectionalLight(0x183454, 1.4);
      fill.position.set(-8, -3, -5);
      scene.add(fill);

      const hemiLight = new THREE.HemisphereLight(0x5588cc, 0x0f1828, 0.6);
      scene.add(hemiLight);

      // Dedicated Camera Headlight (Ensures Sat Chaser cam NEVER looks black)
      const headlight = new THREE.PointLight(0xffffff, 3.2, 18);
      camera.add(headlight);
      scene.add(camera);

      // ── Earth group (carries axial tilt permanently) ───────────────────────────
      const earthGroup = new THREE.Group();
      earthGroup.rotation.z = EARTH_TILT_RAD;
      scene.add(earthGroup);

      // Earth Sphere with Natural NASA Color Fallback
      const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS_UNITS, 64, 64);
      const fallbackCanvas = createProceduralEarthCanvas();
      const fallbackTex = new THREE.CanvasTexture(fallbackCanvas);
      fallbackTex.colorSpace = THREE.SRGBColorSpace;

      const earthMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: fallbackTex,
        roughness: 0.70,
        metalness: 0.05
      });
      const earthMesh = new THREE.Mesh(earthGeo, earthMat);
      earthGroup.add(earthMesh);

      // Night Lights Layer
      const nightGeo = new THREE.SphereGeometry(EARTH_RADIUS_UNITS + 0.002, 64, 64);
      const nightMat = new THREE.MeshBasicMaterial({
        color: 0xffe6b0,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.75
      });
      const nightMesh = new THREE.Mesh(nightGeo, nightMat);
      earthGroup.add(nightMesh);

      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';

      loader.load(TEX.day, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        earthMat.map = tex;
        earthMat.needsUpdate = true;
      }, undefined, () => {});

      loader.load(TEX.night, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        nightMat.map = tex;
        nightMat.needsUpdate = true;
      }, undefined, () => {});

      loader.load(TEX.topo, (tex) => {
        earthMat.bumpMap = tex;
        earthMat.bumpScale = 0.035;
        earthMat.needsUpdate = true;
      }, undefined, () => {});

      // ── Clouds ────────────────────────────────────────────────────────────────
      const cloudGeo = new THREE.SphereGeometry(EARTH_RADIUS_UNITS + 0.025, 64, 64);
      const cloudMat = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.35, depthWrite: false });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      earthGroup.add(cloudMesh);
      loader.load(TEX.clouds, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        cloudMat.map = tex;
        cloudMat.alphaMap = tex;
        cloudMat.needsUpdate = true;
      }, undefined, () => {});

      // ── Atmosphere (Fresnel glow) ──────────────────────────────────────────────
      const atmosGeoInner = new THREE.SphereGeometry(EARTH_RADIUS_UNITS + 0.22, 64, 64);
      const atmosMatInner = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG_INNER,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      scene.add(new THREE.Mesh(atmosGeoInner, atmosMatInner));

      const atmosGeoOuter = new THREE.SphereGeometry(EARTH_RADIUS_UNITS + 0.45, 64, 64);
      const atmosMatOuter = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG_OUTER,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      scene.add(new THREE.Mesh(atmosGeoOuter, atmosMatOuter));

      // ── Geographically Calibrated Mumbai Ground Station ───────────────────────
      const mumbaiLocal = geoToXyz(MUMBAI_LAT, MUMBAI_LON, EARTH_RADIUS_UNITS);

      const dotGeo = new THREE.SphereGeometry(0.022, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      const stationDot = new THREE.Mesh(dotGeo, dotMat);
      stationDot.position.copy(mumbaiLocal);
      earthGroup.add(stationDot);

      const ringGeo = new THREE.RingGeometry(0.035, 0.050, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
      const stationRing = new THREE.Mesh(ringGeo, ringMat);
      stationRing.position.copy(mumbaiLocal);
      stationRing.lookAt(mumbaiLocal.clone().multiplyScalar(2));
      earthGroup.add(stationRing);

      // 2,000 km Ground Station Radio Horizon Footprint Circle
      const horizonGeo = new THREE.RingGeometry(0.24, 0.26, 48);
      const horizonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
      const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
      horizonMesh.position.copy(mumbaiLocal.clone().multiplyScalar(1.002));
      horizonMesh.lookAt(mumbaiLocal.clone().multiplyScalar(2));
      earthGroup.add(horizonMesh);

      // 3D Ground Station Tracking Radar Cone
      const coneGeo = new THREE.ConeGeometry(0.38, 0.95, 24, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const radarCone = new THREE.Mesh(coneGeo, coneMat);
      const coneOffset = mumbaiLocal.clone().normalize().multiplyScalar(0.48);
      radarCone.position.copy(mumbaiLocal.clone().add(coneOffset));
      radarCone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), mumbaiLocal.clone().normalize());
      earthGroup.add(radarCone);

      // ── 2P POCKETQUBE MODULAR SATELLITE ASSEMBLY ───────────────────────────────
      const satGroup = new THREE.Group();
      scene.add(satGroup);

      // Dedicated omni fill light on the satellite
      const satFillLight = new THREE.PointLight(0x00f0ff, 1.2, 4.0);
      satGroup.add(satFillLight);

      // Core Structural Body & Materials
      const bodyGeo = new THREE.BoxGeometry(0.09, 0.18, 0.09);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x222e42, metalness: 0.85, roughness: 0.25 });
      const mainCoreMesh = new THREE.Mesh(bodyGeo, bodyMat);
      satGroup.add(mainCoreMesh);

      // 4 Corner 7075 Anodized Aluminum Deployment Rails
      const railGeo = new THREE.BoxGeometry(0.008, 0.19, 0.008);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x8295a8, metalness: 0.95, roughness: 0.15 });
      const rails = [];
      const railOffsets = [
        [-0.046, -0.046],
        [ 0.046, -0.046],
        [-0.046,  0.046],
        [ 0.046,  0.046],
      ];
      railOffsets.forEach(([rx, rz]) => {
        const rMesh = new THREE.Mesh(railGeo, railMat);
        rMesh.position.set(rx, 0, rz);
        satGroup.add(rMesh);
        rails.push({ mesh: rMesh, origX: rx, origZ: rz });
      });

      // Internal Subsystems Dissection Stack
      // 1. EPS & Li-ion Battery Layer (Dissects Downward)
      const epsGroup = new THREE.Group();
      satGroup.add(epsGroup);
      const pcbGeo = new THREE.BoxGeometry(0.082, 0.006, 0.082);
      const epsPcbMat = new THREE.MeshStandardMaterial({ color: 0x0f4228, metalness: 0.5, roughness: 0.5 });
      epsGroup.add(new THREE.Mesh(pcbGeo, epsPcbMat));
      
      const battGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.068, 16);
      const battMat = new THREE.MeshStandardMaterial({ color: 0xe68a00, metalness: 0.8, roughness: 0.3 }); // Amber Kapton
      const b1 = new THREE.Mesh(battGeo, battMat); b1.rotation.z = Math.PI / 2; b1.position.set(0, -0.016, -0.02); epsGroup.add(b1);
      const b2 = new THREE.Mesh(battGeo, battMat); b2.rotation.z = Math.PI / 2; b2.position.set(0, -0.016,  0.02); epsGroup.add(b2);

      // 2. OBC & Edge-AI Tensor Accelerator Layer (Center)
      const obcGroup = new THREE.Group();
      satGroup.add(obcGroup);
      const obcPcbMat = new THREE.MeshStandardMaterial({ color: 0x111c2e, metalness: 0.6, roughness: 0.4 });
      obcGroup.add(new THREE.Mesh(pcbGeo, obcPcbMat));
      
      const socGeo = new THREE.BoxGeometry(0.034, 0.008, 0.034);
      const socMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.2 });
      const socMesh = new THREE.Mesh(socGeo, socMat); socMesh.position.set(0, 0.006, 0); obcGroup.add(socMesh);

      // 3. UHF/VHF RF Transceiver Layer (Dissects Upward)
      const rfGroup = new THREE.Group();
      satGroup.add(rfGroup);
      const rfPcbMat = new THREE.MeshStandardMaterial({ color: 0x24344d, metalness: 0.7, roughness: 0.3 });
      rfGroup.add(new THREE.Mesh(pcbGeo, rfPcbMat));
      
      const rfShieldGeo = new THREE.BoxGeometry(0.046, 0.014, 0.046);
      const rfShieldMat = new THREE.MeshStandardMaterial({ color: 0xc27813, metalness: 0.9, roughness: 0.2 }); // Machined brass
      const rfShield = new THREE.Mesh(rfShieldGeo, rfShieldMat); rfShield.position.set(0, 0.01, 0); rfGroup.add(rfShield);

      // 4. Optical Camera & Nadir Payload (Dissects Further Upward)
      const payloadGroup = new THREE.Group();
      satGroup.add(payloadGroup);
      const lensGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.014, 16);
      const lensMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.position.set(0, 0.01, 0);
      payloadGroup.add(lensMesh);

      // Blinking AI & Payload Status Beacon LED
      const beaconGeo = new THREE.SphereGeometry(0.014, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(0, 0.095, 0.046);
      satGroup.add(beaconMesh);

      // Deployable GaAs Solar Array Wings (Left & Right)
      const solarMat = new THREE.MeshStandardMaterial({
        color: 0x12243d,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x081628,
        emissiveIntensity: 0.8
      });
      const panelGeo = new THREE.BoxGeometry(0.005, 0.16, 0.07);
      
      const wingLeft = new THREE.Group();
      wingLeft.position.set(-0.046, 0, 0);
      const panelL = new THREE.Mesh(panelGeo, solarMat);
      panelL.position.set(-0.008, 0, 0);
      wingLeft.add(panelL);
      satGroup.add(wingLeft);

      const wingRight = new THREE.Group();
      wingRight.position.set(0.046, 0, 0);
      const panelR = new THREE.Mesh(panelGeo, solarMat);
      panelR.position.set(0.008, 0, 0);
      wingRight.add(panelR);
      satGroup.add(wingRight);

      // Deployable Tape-Spring Monopole Antenna
      const antGeo = new THREE.CylinderGeometry(0.0018, 0.0018, 0.22, 8);
      const antMat = new THREE.MeshBasicMaterial({ color: 0xddeeff });
      const ant = new THREE.Mesh(antGeo, antMat);
      ant.position.set(0, 0.18, 0);
      satGroup.add(ant);

      // ── 3D Holographic Subsystem Selection Bracket / Indicator ────────────────
      const bracketGeo = new THREE.RingGeometry(0.055, 0.062, 32);
      const bracketMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const selectionBracket = new THREE.Mesh(bracketGeo, bracketMat);
      selectionBracket.rotation.x = Math.PI / 2;
      selectionBracket.visible = false;
      satGroup.add(selectionBracket);

      // ── RCS Cold-Gas Thruster Particles System ────────────────────────────────
      const thrusterParticleCount = 40;
      const thrusterGeo = new THREE.BufferGeometry();
      const thrusterPositions = new Float32Array(thrusterParticleCount * 3);
      const thrusterVelocities = [];
      for (let i = 0; i < thrusterParticleCount; i++) {
        thrusterPositions[i * 3] = 0;
        thrusterPositions[i * 3 + 1] = 0;
        thrusterPositions[i * 3 + 2] = 0;
        thrusterVelocities.push(new THREE.Vector3(0, 0, 0));
      }
      thrusterGeo.setAttribute('position', new THREE.BufferAttribute(thrusterPositions, 3));
      const thrusterMat = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.035,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const thrusterParticles = new THREE.Points(thrusterGeo, thrusterMat);
      satGroup.add(thrusterParticles);

      let thrusterActiveTimer = 0;

      const fireThrusterJet = (dirX, dirY) => {
        thrusterActiveTimer = 1.0;
        thrusterMat.opacity = 0.9;
        const posAttr = thrusterGeo.attributes.position;
        for (let i = 0; i < thrusterParticleCount; i++) {
          posAttr.setXYZ(i, (Math.random() - 0.5) * 0.04, -0.08, (Math.random() - 0.5) * 0.04);
          thrusterVelocities[i].set(
            dirX * 0.08 + (Math.random() - 0.5) * 0.03,
            -0.12 - Math.random() * 0.05,
            dirY * 0.08 + (Math.random() - 0.5) * 0.03
          );
        }
        posAttr.needsUpdate = true;
      };

      // ── Satellite Orbit Trail ─────────────────────────────────────────────────
      const trailGroup = new THREE.Group();
      scene.add(trailGroup);
      const trails = [];
      const trailGeo = new THREE.SphereGeometry(0.012, 8, 8);
      for (let i = 0; i < 6; i++) {
        const trailMat = new THREE.MeshBasicMaterial({ color: 0x4a7c9b, transparent: true, opacity: 0.6 - i * 0.09 });
        const trailMesh = new THREE.Mesh(trailGeo, trailMat);
        trailGroup.add(trailMesh);
        trails.push(trailMesh);
      }

      // ── Orbit path ring at 9.6° inclination ────────────────────────────────────
      const orbitPts = [];
      for (let i = 0; i <= 100; i++) {
        const th = (i / 100) * 2 * Math.PI;
        const x = ORBIT_RADIUS * Math.cos(th);
        const zr = ORBIT_RADIUS * Math.sin(th);
        orbitPts.push(new THREE.Vector3(x, zr * Math.sin(INCLINATION_RAD), zr * Math.cos(INCLINATION_RAD)));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
      const orbitMat = new THREE.LineBasicMaterial({ color: 0x4a7c9b, transparent: true, opacity: 0.35 });
      scene.add(new THREE.Line(orbitGeo, orbitMat));

      // ── Line-of-sight beam ─────────────────────────────────────────────────────
      const losGeo = new THREE.BufferGeometry();
      const losMat = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.75 });
      const losMesh = new THREE.Line(losGeo, losMat);
      scene.add(losMesh);

      // ── Multi-Layer Procedural Starfield with Starry Depth ──────────────────────
      const starLayers = [];
      const starGeos = [];
      const starMats = [];

      const starLayerConfigs = [
        { count: 1600, minR: 110, maxR: 160, size: 0.09, color: 0x94b4e6, opacity: 0.55, driftFactor: 0.0006 },
        { count: 1000, minR: 70,  maxR: 110, size: 0.17, color: 0xffffff, opacity: 0.80, driftFactor: 0.0012 },
        { count: 400,  minR: 40,  maxR: 70,  size: 0.28, color: 0xffeacc, opacity: 0.95, driftFactor: 0.0022 },
      ];

      starLayerConfigs.forEach((cfg) => {
        const coords = [];
        for (let i = 0; i < cfg.count; i++) {
          const u = Math.random(), v = Math.random();
          const th = 2 * Math.PI * u;
          const ph = Math.acos(2 * v - 1);
          const r = cfg.minR + Math.random() * (cfg.maxR - cfg.minR);
          coords.push(
            r * Math.sin(ph) * Math.cos(th),
            r * Math.sin(ph) * Math.sin(th),
            r * Math.cos(ph)
          );
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
        const mat = new THREE.PointsMaterial({
          color: cfg.color,
          size: cfg.size,
          transparent: true,
          opacity: cfg.opacity,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending
        });
        const points = new THREE.Points(geo, mat);
        scene.add(points);
        starLayers.push({ points, driftFactor: cfg.driftFactor });
        starGeos.push(geo);
        starMats.push(mat);
      });

      // ── Interactive Mouse & Keyboard Controls (Rotation + WASD Translations) ───
      let targetMouseX = 0;
      let targetMouseY = 0;
      let mouseX = 0;
      let mouseY = 0;

      let isDragging = false;
      let previousMousePos = { x: 0, y: 0 };
      let orbitPitch = 0.2;
      let orbitYaw = 0.0;
      let satPitch = 0.0;
      let satYaw = 0.0;

      // Real 3D translation offsets controlled by WASD
      let userTransX = 0;
      let userTransY = 0;
      let userTransZ = 0;

      // Mouse Drag & Wheel Listeners
      const handleMouseMove = (e) => {
        const halfW = window.innerWidth * 0.5;
        const halfH = window.innerHeight * 0.5;
        targetMouseX = (e.clientX - halfW) / (halfW || 1);
        targetMouseY = (e.clientY - halfH) / (halfH || 1);

        if (isDragging) {
          const deltaX = e.clientX - previousMousePos.x;
          const deltaY = e.clientY - previousMousePos.y;
          orbitYaw += deltaX * 0.008;
          orbitPitch = Math.max(-1.2, Math.min(1.2, orbitPitch + deltaY * 0.008));
          previousMousePos = { x: e.clientX, y: e.clientY };
        }
      };

      const handleMouseDown = (e) => {
        if (e.button === 0) {
          isDragging = true;
          previousMousePos = { x: e.clientX, y: e.clientY };
        }
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const handleWheel = (e) => {
        camDistance = Math.max(2.5, Math.min(15.0, camDistance + e.deltaY * 0.005));
      };

      // WASD Maneuvering & RCS Thruster Keys (Translation + Attitude)
      const handleKeyDown = (e) => {
        const key = e.key.toLowerCase();
        const isDissectMode = cameraModeRef.current === 'dissection';

        if (key === 'w') {
          // Thrust forward / Move UP
          if (isDissectMode) {
            userTransY += 0.12;
          } else {
            userTransZ -= 0.15;
            satPitch -= 0.05;
          }
          fireThrusterJet(0, -1);
          if (onThrusterFire) onThrusterFire('FWD_THRUST');
        } else if (key === 's') {
          // Thrust backward / Move DOWN
          if (isDissectMode) {
            userTransY -= 0.12;
          } else {
            userTransZ += 0.15;
            satPitch += 0.05;
          }
          fireThrusterJet(0, 1);
          if (onThrusterFire) onThrusterFire('AFT_THRUST');
        } else if (key === 'a') {
          // Strafe left / Move LEFT
          userTransX -= 0.12;
          satYaw -= 0.05;
          fireThrusterJet(-1, 0);
          if (onThrusterFire) onThrusterFire('PORT_THRUST');
        } else if (key === 'd') {
          // Strafe right / Move RIGHT
          userTransX += 0.12;
          satYaw += 0.05;
          fireThrusterJet(1, 0);
          if (onThrusterFire) onThrusterFire('STBD_THRUST');
        } else if (key === 'arrowup') {
          satPitch -= 0.1;
        } else if (key === 'arrowdown') {
          satPitch += 0.1;
        } else if (key === 'arrowleft') {
          satYaw -= 0.1;
        } else if (key === 'arrowright') {
          satYaw += 0.1;
        } else if (key === 'r') {
          orbitPitch = 0.2;
          orbitYaw = 0.0;
          satPitch = 0.0;
          satYaw = 0.0;
          userTransX = 0;
          userTransY = 0;
          userTransZ = 0;
          camDistance = mode === 'hero' ? 8.5 : 10.5;
        } else if (key === ' ' || key === 'spacebar') {
          if (onCameraChange) {
            onCameraChange(cameraModeRef.current === 'dissection' ? 'orbit' : 'dissection');
          }
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('wheel', handleWheel, { passive: true });
      window.addEventListener('keydown', handleKeyDown);

      // ── Animation Loop ────────────────────────────────────────────────────────
      const clock = new THREE.Clock();
      const targetCamPos = new THREE.Vector3(0, 1.2, camDistance);
      const currentLookAt = new THREE.Vector3(0, 0, 0);
      const targetLookAt = new THREE.Vector3(0, 0, 0);

      let curExplode = 0;
      let curSatScale = 1.0;

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Parallax damping
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Interactive Starfield Parallax
        starLayers.forEach((layer) => {
          layer.points.rotation.y = t * layer.driftFactor + orbitYaw * 0.2 + mouseX * (layer.driftFactor * 15);
          layer.points.rotation.x = orbitPitch * 0.2 + mouseY * (layer.driftFactor * 10);
        });

        // Earth spin
        earthGroup.rotation.y = t * 0.05;
        cloudMesh.rotation.y = t * 0.007;

        const curCameraMode = cameraModeRef.current || 'orbit';
        const isDissect = curCameraMode === 'dissection';
        const curActiveSub = activeSubsystemRef.current || 'obc';

        // Smoothly interpolate explode separation and scale
        const targetExplode = isDissect ? (explodeRef.current ?? 1.0) : 0.0;
        curExplode += (targetExplode - curExplode) * 0.08;

        const targetScale = isDissect ? 3.5 : 1.0;
        curSatScale += (targetScale - curSatScale) * 0.08;
        satGroup.scale.setScalar(curSatScale);

        // Dissection module positioning with clean separation
        const epsY = -0.04 - curExplode * 0.35;
        const obcY = 0;
        const rfY = 0.04 + curExplode * 0.35;
        const payloadY = 0.08 + curExplode * 0.65;
        const antY = 0.18 + curExplode * 0.90;

        epsGroup.position.y = epsY;
        obcGroup.position.y = obcY;
        rfGroup.position.y = rfY;
        payloadGroup.position.y = payloadY;
        ant.position.y = antY;

        // Solar Wings deployment
        wingLeft.position.x = -0.046 - curExplode * 0.22;
        wingLeft.rotation.y = -curExplode * 0.75;
        wingRight.position.x = 0.046 + curExplode * 0.22;
        wingRight.rotation.y = curExplode * 0.75;

        // Structural corner rails
        rails.forEach((r) => {
          r.mesh.position.x = r.origX * (1 + curExplode * 2.2);
          r.mesh.position.z = r.origZ * (1 + curExplode * 2.2);
        });

        // ── Highlight Active Subsystem on Selection in 3D Dissection ───────────────
        if (isDissect) {
          selectionBracket.visible = true;
          selectionBracket.rotation.z = t * 1.5;

          // Reset baseline emissive intensities
          epsPcbMat.emissive.setHex(0x000000);
          battMat.emissive.setHex(0x000000);
          socMat.emissive.setHex(0x000000);
          rfShieldMat.emissive.setHex(0x000000);
          solarMat.emissiveIntensity = 0.5;

          let targetBracketY = 0;

          if (curActiveSub === 'eps') {
            targetBracketY = epsY;
            epsPcbMat.emissive.setHex(0x00ff88);
            epsPcbMat.emissiveIntensity = 0.8 + 0.3 * Math.sin(t * 6);
            battMat.emissive.setHex(0xffaa00);
            battMat.emissiveIntensity = 0.8 + 0.3 * Math.sin(t * 6);
            epsGroup.scale.setScalar(1.12);
            obcGroup.scale.setScalar(0.95);
            rfGroup.scale.setScalar(0.95);
            payloadGroup.scale.setScalar(0.95);
          } else if (curActiveSub === 'obc') {
            targetBracketY = obcY;
            socMat.emissive.setHex(0x00f0ff);
            socMat.emissiveIntensity = 1.0 + 0.4 * Math.sin(t * 6);
            obcGroup.scale.setScalar(1.15);
            epsGroup.scale.setScalar(0.95);
            rfGroup.scale.setScalar(0.95);
            payloadGroup.scale.setScalar(0.95);
          } else if (curActiveSub === 'rf') {
            targetBracketY = rfY;
            rfShieldMat.emissive.setHex(0xf59e0b);
            rfShieldMat.emissiveIntensity = 1.0 + 0.3 * Math.sin(t * 6);
            rfGroup.scale.setScalar(1.12);
            epsGroup.scale.setScalar(0.95);
            obcGroup.scale.setScalar(0.95);
            payloadGroup.scale.setScalar(0.95);
          } else if (curActiveSub === 'payload') {
            targetBracketY = payloadY;
            lensMat.color.setHex((Math.sin(t * 6) > 0) ? 0x00f0ff : 0x0284c7);
            payloadGroup.scale.setScalar(1.25);
            epsGroup.scale.setScalar(0.95);
            obcGroup.scale.setScalar(0.95);
            rfGroup.scale.setScalar(0.95);
          } else if (curActiveSub === 'solar') {
            targetBracketY = 0;
            solarMat.emissive.setHex(0x0088ff);
            solarMat.emissiveIntensity = 1.4 + 0.4 * Math.sin(t * 6);
            wingLeft.scale.setScalar(1.15);
            wingRight.scale.setScalar(1.15);
            epsGroup.scale.setScalar(0.95);
            obcGroup.scale.setScalar(0.95);
            rfGroup.scale.setScalar(0.95);
          }

          selectionBracket.position.y = targetBracketY;
          selectionBracket.scale.setScalar(1 + 0.08 * Math.sin(t * 5));
        } else {
          selectionBracket.visible = false;
          epsGroup.scale.setScalar(1.0);
          obcGroup.scale.setScalar(1.0);
          rfGroup.scale.setScalar(1.0);
          payloadGroup.scale.setScalar(1.0);
          wingLeft.scale.setScalar(1.0);
          wingRight.scale.setScalar(1.0);
        }

        // Core mesh transparency
        mainCoreMesh.scale.set(
          1.0 - curExplode * 0.85,
          1.0 - curExplode * 0.85,
          1.0 - curExplode * 0.85
        );
        mainCoreMesh.material.opacity = Math.max(0.12, 1.0 - curExplode * 0.88);
        mainCoreMesh.material.transparent = curExplode > 0.05;

        // Smoothly decay WASD velocities
        userTransX *= 0.95;
        userTransY *= 0.95;
        userTransZ *= 0.95;

        // Update RCS thruster particles
        if (thrusterActiveTimer > 0) {
          thrusterActiveTimer -= 0.03;
          thrusterMat.opacity = Math.max(0, thrusterActiveTimer);
          const posAttr = thrusterGeo.attributes.position;
          for (let i = 0; i < thrusterParticleCount; i++) {
            const vx = thrusterVelocities[i].x;
            const vy = thrusterVelocities[i].y;
            const vz = thrusterVelocities[i].z;
            posAttr.setXYZ(i, posAttr.getX(i) + vx, posAttr.getY(i) + vy, posAttr.getZ(i) + vz);
          }
          posAttr.needsUpdate = true;
        }

        // Orbit calculations
        const orbPeriod = 60;
        const th = ((t % orbPeriod) / orbPeriod) * 2 * Math.PI;
        const ox = ORBIT_RADIUS * Math.cos(th);
        const ozr = ORBIT_RADIUS * Math.sin(th);
        const oy = ozr * Math.sin(INCLINATION_RAD);
        const oz = ozr * Math.cos(INCLINATION_RAD);

        beaconMat.color.setHex((Math.sin(t * 8) > 0) ? 0x00f0ff : 0x004488);
        coneMat.opacity = 0.14 + 0.08 * Math.sin(t * 4);

        // Trails
        for (let i = 0; i < 6; i++) {
          const trailTh = th - (i + 1) * 0.04;
          const tox = ORBIT_RADIUS * Math.cos(trailTh);
          const tozr = ORBIT_RADIUS * Math.sin(trailTh);
          const toy = tozr * Math.sin(INCLINATION_RAD);
          const toz = tozr * Math.cos(INCLINATION_RAD);
          trails[i].position.set(tox, toy, toz);
          trails[i].visible = !isDissect;
        }

        const radial = new THREE.Vector3(ox, oy, oz).normalize();
        const vel = new THREE.Vector3(-Math.sin(th), Math.cos(th) * Math.sin(INCLINATION_RAD), Math.cos(th) * Math.cos(INCLINATION_RAD)).normalize();
        const right = new THREE.Vector3().crossVectors(vel, radial).normalize();

        // Mumbai world coords
        const mumbaiWorld = mumbaiLocal.clone();
        earthGroup.localToWorld(mumbaiWorld);
        const mNorm = mumbaiWorld.clone().normalize();

        if (isDissect) {
          // ── Dissection Mode: Prominently centered with WASD translation pan ──
          satGroup.position.set(-0.35 + userTransX, 0.05 + userTransY, userTransZ);
          satGroup.rotation.x = orbitPitch + satPitch;
          satGroup.rotation.y = orbitYaw + satYaw + t * 0.10;
          satGroup.rotation.z = 0;

          // Camera focuses directly on the selected subsystem layer
          let focusLayerY = 0;
          if (curActiveSub === 'eps') focusLayerY = epsY;
          else if (curActiveSub === 'rf') focusLayerY = rfY;
          else if (curActiveSub === 'payload') focusLayerY = payloadY;

          targetCamPos.set(-0.35 + userTransX * 0.5, 0.05 + focusLayerY + userTransY * 0.5, Math.min(camDistance, 2.3));
          targetLookAt.set(-0.35 + userTransX, 0.05 + focusLayerY + userTransY, 0);
          trailGroup.visible = false;
        } else {
          // ── Flight Orbit Modes ──
          trailGroup.visible = true;
          satGroup.position.set(ox, oy, oz)
            .add(right.clone().multiplyScalar(userTransX))
            .add(vel.clone().multiplyScalar(userTransZ));

          // Orient satellite along velocity vector + user attitude
          const m = new THREE.Matrix4().lookAt(satGroup.position, satGroup.position.clone().add(vel), radial);
          satGroup.quaternion.setFromRotationMatrix(m);
          satGroup.rotateX(satPitch);
          satGroup.rotateY(satYaw);

          if (curCameraMode === 'mumbai') {
            // ── Mumbai Pass: Elevated orbital view framing Earth, India, and Mumbai radar cone ──
            // Camera placed in high orbit looking directly at Mumbai on the Earth globe
            targetCamPos.copy(mNorm).multiplyScalar(4.6)
              .add(new THREE.Vector3(0.4, 0.7, 0.8))
              .add(new THREE.Vector3(mouseX * 0.35, -mouseY * 0.35, 0));

            // Keep lookAt centered on Mumbai and the passing satellite
            targetLookAt.copy(mumbaiWorld).multiplyScalar(0.75);
          } else if (curCameraMode === 'chaser') {
            // ── Sat Chaser: Rigid local reference frame, zero jitter or wobble ──
            const chaserCamPos = satGroup.position.clone()
              .add(vel.clone().multiplyScalar(-0.48))
              .add(radial.clone().multiplyScalar(0.18))
              .add(right.clone().multiplyScalar(mouseX * 0.22))
              .add(radial.clone().multiplyScalar(-mouseY * 0.14));

            targetCamPos.copy(chaserCamPos);
            targetLookAt.copy(satGroup.position).add(vel.clone().multiplyScalar(0.12));
          } else {
            // ── Global Orbital Vista ──
            const camOrbitSpeed = 0.03;
            const camAngle = t * camOrbitSpeed + orbitYaw;
            targetCamPos.set(
              Math.sin(camAngle) * (camDistance * 0.35) + mouseX * 0.8,
              1.2 + orbitPitch * 2.0 - mouseY * 0.5,
              camDistance * Math.cos(camAngle * 0.3)
            );
            targetLookAt.set(0, 0, 0);
          }
        }

        // Use tighter lerp in chaser mode to eliminate lag
        const lerpFactor = (curCameraMode === 'chaser') ? 0.16 : 0.06;
        camera.position.lerp(targetCamPos, lerpFactor);
        currentLookAt.lerp(targetLookAt, lerpFactor + 0.02);
        camera.lookAt(currentLookAt);

        // Line of Sight Beam
        const satPos = satGroup.position;
        const gndNorm = mumbaiWorld.clone().normalize();
        const toSat = satPos.clone().sub(mumbaiWorld).normalize();
        const hasLos = gndNorm.dot(toSat) > 0;

        if (isInPassWindow && hasLos && !isDissect) {
          const pts = [];
          for (let i = 0; i <= 20; i++) {
            pts.push(new THREE.Vector3().lerpVectors(satPos, mumbaiWorld, i / 20));
          }
          losGeo.setFromPoints(pts);
          losMesh.visible = true;
          losMat.opacity = 0.5 + 0.3 * Math.sin(t * 5);
        } else {
          losMesh.visible = false;
        }

        ringMat.opacity = (0.55 + 0.45 * Math.sin(t * 3)) * 0.75;
        stationRing.scale.setScalar(1 + 0.35 * Math.sin(t * 3));
        horizonMat.opacity = 0.25 + 0.15 * Math.sin(t * 2);

        renderer.render(scene, camera);
      };

      animate();

      // ── Resize Handler ────────────────────────────────────────────────────────
      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const w = containerRef.current.clientWidth || window.innerWidth;
        const h = containerRef.current.clientHeight || window.innerHeight;
        camera.aspect = Math.max(w / (h || 1), 0.1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // ── Teardown & Resource Disposal ──────────────────────────────────────────
      return () => {
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeyDown);

        // Geometries disposal
        earthGeo.dispose();
        nightGeo.dispose();
        cloudGeo.dispose();
        atmosGeoInner.dispose();
        atmosGeoOuter.dispose();
        dotGeo.dispose();
        ringGeo.dispose();
        coneGeo.dispose();
        bodyGeo.dispose();
        beaconGeo.dispose();
        lensGeo.dispose();
        panelGeo.dispose();
        antGeo.dispose();
        trailGeo.dispose();
        orbitGeo.dispose();
        losGeo.dispose();
        starGeos.forEach(g => g.dispose());
        pcbGeo.dispose();
        battGeo.dispose();
        socGeo.dispose();
        rfShieldGeo.dispose();
        railGeo.dispose();
        horizonGeo.dispose();
        thrusterGeo.dispose();
        bracketGeo.dispose();

        // Materials disposal
        earthMat.dispose();
        nightMat.dispose();
        cloudMat.dispose();
        atmosMatInner.dispose();
        atmosMatOuter.dispose();
        dotMat.dispose();
        ringMat.dispose();
        coneMat.dispose();
        bodyMat.dispose();
        beaconMat.dispose();
        lensMat.dispose();
        solarMat.dispose();
        antMat.dispose();
        orbitMat.dispose();
        losMat.dispose();
        starMats.forEach(m => m.dispose());
        epsPcbMat.dispose();
        battMat.dispose();
        obcPcbMat.dispose();
        socMat.dispose();
        rfPcbMat.dispose();
        rfShieldMat.dispose();
        railMat.dispose();
        horizonMat.dispose();
        thrusterMat.dispose();
        bracketMat.dispose();
        trails.forEach(tr => tr.material.dispose());

        // Textures disposal
        if (fallbackTex) fallbackTex.dispose();
        if (earthMat.map) earthMat.map.dispose();
        if (earthMat.bumpMap) earthMat.bumpMap.dispose();
        if (nightMat.map) nightMat.map.dispose();
        if (cloudMat.map) cloudMat.map.dispose();
        if (cloudMat.alphaMap) cloudMat.alphaMap.dispose();

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn('SatelliteCanvas WebGL fallback initialized:', err);
    }
  }, [mode, isInPassWindow]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'radial-gradient(ellipse at center, #07111e 0%, #03060c 60%, #000000 100%)'
      }}
    />
  );
}
