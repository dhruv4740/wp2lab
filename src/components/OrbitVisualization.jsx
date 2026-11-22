import React, { useState, useEffect, useRef } from 'react';
import SatelliteCanvas from './SatelliteCanvas';
import { Activity, Radio, Wifi, Zap } from 'lucide-react';

export default function OrbitVisualization() {
  const [isInPassWindow, setIsInPassWindow] = useState(true);
  const [passTimer, setPassTimer] = useState(420); // 7 minutes pass window timer in seconds
  const passWindowRef = useRef(true);
  const waterfallCanvasRef = useRef(null);

  useEffect(() => {
    passWindowRef.current = isInPassWindow;
  }, [isInPassWindow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassTimer((prev) => {
        if (prev <= 1) {
          const nextState = !passWindowRef.current;
          passWindowRef.current = nextState;
          setIsInPassWindow(nextState);
          return nextState ? 420 : 3600; // 60 mins out of range, 7 mins in pass window
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Live SDR Waterfall Canvas Animation
  useEffect(() => {
    const canvas = waterfallCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let t = 0;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#03060d';
    ctx.fillRect(0, 0, w, h);

    const renderWaterfall = () => {
      animId = requestAnimationFrame(renderWaterfall);
      t += 0.05;

      const imgData = ctx.getImageData(0, 0, w, h - 2);
      ctx.putImageData(imgData, 0, 2);

      const row = ctx.createImageData(w, 2);
      const data = row.data;
      const inPass = passWindowRef.current;

      const center = w / 2 + (inPass ? Math.sin(t * 0.4) * (w * 0.18) : 0);

      for (let x = 0; x < w; x++) {
        const idx = x * 4;
        const distToCenter = Math.abs(x - center);
        let intensity = 0;

        if (inPass) {
          if (distToCenter < 3) {
            intensity = 240 + Math.random() * 15;
          } else if (distToCenter < 18 && Math.sin(t * 4 + x * 0.5) > 0.3) {
            intensity = 120 + Math.random() * 50;
          } else {
            intensity = Math.random() * 25;
          }
        } else {
          intensity = Math.random() * 22;
        }

        let r = 0, g = 0, b = 0;
        if (intensity > 200) {
          r = 0; g = 255; b = 180;
        } else if (intensity > 100) {
          r = 0; g = 180; b = 255;
        } else if (intensity > 40) {
          r = 0; g = 60; b = 140;
        } else {
          r = 3; g = 6; b = Math.floor(intensity * 0.6);
        }

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }

      ctx.putImageData(row, 0, 0);
    };

    renderWaterfall();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="mission-section" id="orbit">
      <div className="chapter-tag">06 — ORBIT PASS VISUALIZATION</div>

      <div style={{ maxWidth: '850px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#f8fafc', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
          Low Earth Orbit Pass &amp; Line-of-Sight Telemetry.
        </h2>
        <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
          At 350 km altitude and 9.6° inclination, SomaiyaSat establishes 7–10 minute contact windows over Mumbai roughly 15 times daily. Outside ground footprints, onboard AI dynamically queues telemetry packets to the 2GB SD card and flushes prioritized data upon next acquisition of signal.
        </p>
      </div>

      {/* Modern High-Contrast Ground Pass Cockpit */}
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Pass Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isInPassWindow ? '#10b981' : '#f59e0b',
              boxShadow: isInPassWindow ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
            }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: isInPassWindow ? '#34d399' : '#fbbf24', fontWeight: 700, letterSpacing: '0.05em' }}>
              {isInPassWindow ? 'LINE-OF-SIGHT ACQUIRED // PASS ACTIVE' : 'BUFFERING ONBOARD // OUT OF FOOTPRINT'}
            </span>
          </div>

          <button
            onClick={() => setIsInPassWindow(!isInPassWindow)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              padding: '6px 14px',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            TOGGLE PASS STATE [{isInPassWindow ? 'IN RANGE' : 'OUT RANGE'}]
          </button>
        </div>

        {/* 2-Column Split: Telemetry Readouts (Left) + Clean 3D Orbit Viewport (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          
          {/* Telemetry Readout Deck — 100% Crisp on Pure Dark Background */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#04060a',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '1.25rem'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                PASS TIMER COUNTDOWN
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: isInPassWindow ? '#10b981' : '#f59e0b',
                marginTop: '4px',
                letterSpacing: '-0.02em'
              }}>
                {formatTimer(passTimer)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                {isInPassWindow ? 'REMAINING IN PASS WINDOW' : 'UNTIL NEXT GROUND PASS ACQUISITION'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{
                backgroundColor: '#04060a',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>GROUND STATION</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>KJSIT Mumbai</div>
                <div style={{ fontSize: '0.7rem', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>19.0760° N, 72.8777° E</div>
              </div>

              <div style={{
                backgroundColor: '#04060a',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>RF BEAM STATUS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isInPassWindow ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                  {isInPassWindow ? 'TRANSMITTING' : 'BUFFERING'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                  {isInPassWindow ? '437.525 MHz UHF' : 'SD FLASH QUEUE'}
                </div>
              </div>
            </div>
          </div>

          {/* 3D Orbit Canvas Viewport — Cleanly Isolated with Zero Text Collision */}
          <div style={{
            position: 'relative',
            height: '340px',
            backgroundColor: '#04060a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <SatelliteCanvas mode="orbit" isInPassWindow={isInPassWindow} />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: '#64748b',
              backgroundColor: 'rgba(4, 6, 10, 0.8)',
              padding: '2px 8px',
              borderRadius: '4px',
              pointerEvents: 'none'
            }}>
              3D ORBIT TRAJECTORY // 350 KM LEO
            </div>
          </div>

        </div>
      </div>

      {/* GROUND STATION RADAR TRACKING & SDR SPECTROGRAM HUD */}
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#00f0ff', letterSpacing: '0.12em' }}>
              // GROUND STATION RADAR TRACKING &amp; RF DOPPLER TELEMETRY
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '4px 0 0 0', fontWeight: 700 }}>
              KJSIT Mumbai Ground Station (19.0760° N, 72.8777° E)
            </h3>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span>YAGI-UDA ROTATOR: {isInPassWindow ? 'AUTO-TRACKING LOCK' : 'PARKED (AZ 000°)'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
          {/* Circular Radar PPI Scope */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#04060a', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#64748b', marginBottom: '10px' }}>
              POLAR PPI RADAR ELEVATION SCOPE
            </div>
            <div style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: '#02050c',
              border: '2px solid rgba(0, 240, 255, 0.3)'
            }}>
              <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', border: '1px dashed rgba(0, 240, 255, 0.2)' }} />
              <div style={{ position: 'absolute', inset: '45px', borderRadius: '50%', border: '1px dashed rgba(0, 240, 255, 0.2)' }} />
              <div style={{ position: 'absolute', inset: '70px', borderRadius: '50%', border: '1px solid rgba(0, 240, 255, 0.25)' }} />
              
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', backgroundColor: 'rgba(0, 240, 255, 0.2)' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', backgroundColor: 'rgba(0, 240, 255, 0.2)' }} />

              <span style={{ position: 'absolute', top: '3px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.58rem', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>N</span>
              <span style={{ position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.58rem', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>S</span>
              <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.58rem', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>E</span>
              <span style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.58rem', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>W</span>

              <svg width="180" height="180" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <line x1="90" y1="90" x2="90" y2="5" stroke="#10b981" strokeWidth="1.5" className="radar-sweep-line" />
              </svg>

              {isInPassWindow ? (
                <div style={{
                  position: 'absolute',
                  top: '54px',
                  left: '115px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#10b981', fontWeight: 700, backgroundColor: '#000000', padding: '1px 4px', borderRadius: '2px' }}>
                    SOMAIYASAT
                  </span>
                </div>
              ) : (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.62rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  AWAITING AOS
                </div>
              )}
            </div>
          </div>

          {/* Live SDR Waterfall Spectrogram Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#04060a', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#00f0ff', fontWeight: 600 }}>
                LIVE 437.525 MHz SDR WATERFALL
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: isInPassWindow ? '#10b981' : '#64748b' }}>
                {isInPassWindow ? 'DOPPLER LOCKED' : 'SEARCHING CARRIER'}
              </span>
            </div>

            <canvas
              ref={waterfallCanvasRef}
              width={260}
              height={140}
              style={{
                width: '100%',
                height: '140px',
                backgroundColor: '#020409',
                borderRadius: '4px',
                border: '1px solid rgba(0, 240, 255, 0.2)'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
              <span>437.510 MHz</span>
              <span style={{ color: '#00f0ff' }}>437.525 MHz (CF)</span>
              <span>437.540 MHz</span>
            </div>
          </div>

          {/* Real-time Tracking Gauges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#64748b' }}>ANTENNA AZIMUTH &amp; ELEVATION</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                {isInPassWindow ? 'AZ: 148.4° (SE) | EL: 42.8°' : 'AZ: 000.0° (N) | EL: 00.0°'}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: isInPassWindow ? '#10b981' : '#64748b', marginTop: '2px' }}>
                {isInPassWindow ? '● ROTATOR SLEWING AT 1.2°/s' : '● ROTATOR PARKED'}
              </div>
            </div>

            <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#64748b' }}>CARRIER DOPPLER FREQ OFFSET</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#00f0ff', marginTop: '2px' }}>
                {isInPassWindow ? '+3.42 kHz (APPROACHING)' : '0.00 kHz (IDLE)'}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                CENTER: 437.525 MHz // AFC LOCKED
              </div>
            </div>

            <div style={{ backgroundColor: '#04060a', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#64748b' }}>ESTIMATED LINK BUDGET MARGIN</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: isInPassWindow ? '#10b981' : '#f59e0b', marginTop: '2px' }}>
                {isInPassWindow ? '+14.6 dB (EXCELLENT SNR)' : '0.0 dB (OUT OF FOOTPRINT)'}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                SLANT RANGE: {isInPassWindow ? '418.2 km' : 'OUT OF RANGE'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Info Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ backgroundColor: '#080b12', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.70rem', color: '#00f0ff', letterSpacing: '0.12em', marginBottom: '8px' }}>ONBOARD STORAGE</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0' }}>Autonomous Buffer Management</h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flexGrow: 1 }}>
            When out of ground station range, telemetry, SSTV frames, and voice packets are buffered to the onboard SD card with priority tags. The AI circular buffer automatically flushes high-priority packets first upon next contact.
          </p>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#10b981', fontSize: '0.78rem' }}>● BUFFER CAPACITY: 2 GB SD CARD</div>
        </div>

        <div style={{ backgroundColor: '#080b12', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.70rem', color: '#00f0ff', letterSpacing: '0.12em', marginBottom: '8px' }}>ORBITAL MECHANICS</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0' }}>AI Pass Window Prediction</h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flexGrow: 1 }}>
            Onboard TLE orbital propagation pre-computes upcoming pass windows to schedule battery charging and transmitter warm-up. This autonomous scheduling maximizes usable downlink time during brief 7–10 minute windows.
          </p>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00f0ff', fontSize: '0.78rem' }}>● TLE UPDATE CYCLE: EVERY 72 HOURS</div>
        </div>

        <div style={{ backgroundColor: '#080b12', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.70rem', color: '#00f0ff', letterSpacing: '0.12em', marginBottom: '8px' }}>LINK PROTOCOL</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0' }}>Automated Link Acquisition</h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flexGrow: 1 }}>
            The communication protocol executes an automated AOS handshake and priority data downlink sequence. If ground acknowledgment is unreceived within 30 seconds, the satellite falls back to autonomous blind beacon mode.
          </p>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f59e0b', fontSize: '0.78rem' }}>● HANDSHAKE TIMEOUT: 30 SEC</div>
        </div>
      </div>

      {/* Collapsible Technical Drawer: Orbital Dynamics & Link Budget */}
      <div className="eng-panel" style={{ padding: 0, backgroundColor: '#080b12', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }}>
        <details className="tech-drawer" style={{ width: '100%' }}>
          <summary style={{
            cursor: 'pointer',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            userSelect: 'none',
            outline: 'none'
          }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#00f0ff', letterSpacing: '0.15em' }}>ORBITAL MECHANICS &amp; LINK BUDGET</div>
              <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: '2px 0 0 0', fontWeight: 600 }}>Keplerian Flight Profile &amp; Ground Network Telemetry</h4>
            </div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.72rem',
              color: '#38bdf8',
              padding: '4px 12px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '4px',
              backgroundColor: 'rgba(56, 189, 248, 0.05)'
            }}>
              EXPAND ORBITAL SPECS ▼
            </span>
          </summary>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ borderLeft: '2px solid #00f0ff', paddingLeft: '14px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#64748b' }}>ORBIT GEOMETRY</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>350 km Circular LEO</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Inclination: 9.6° Low Inclination</div>
              </div>
              <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '14px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#64748b' }}>ORBITAL PERIOD</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>91.5 Minutes</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>15.7 Re-entry Revolutions / Day</div>
              </div>
              <div style={{ borderLeft: '2px solid #f59e0b', paddingLeft: '14px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#64748b' }}>DOPPLER FREQ SHIFT</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>±10.2 kHz Max</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Autocorrected by Ground SDR</div>
              </div>
              <div style={{ borderLeft: '2px solid #38bdf8', paddingLeft: '14px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#64748b' }}>CONTACT WINDOW</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>7–10 Minutes / Pass</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Min Elevation: 5.0° Above Horizon</div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
