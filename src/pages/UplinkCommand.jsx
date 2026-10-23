import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  Radio,
  Satellite,
  Cpu,
  Sliders,
  Shield,
  Clock,
  Compass,
  Zap,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Lock,
  Check,
  ChevronRight,
  Info,
  Phone,
  ArrowRight,
  Layout,
  FileCode,
  RotateCcw,
  Key,
  Database,
  Hash,
  Activity
} from 'lucide-react';
import WireframeStudio from '../components/WireframeStudio';

export default function UplinkCommand() {
  const { user, isLoggedIn } = useAuth();
  const [activeView, setActiveView] = useState('console'); // 'console' | 'wireframe'

  // =========================================================================
  // APPLICATION TOPIC: FORGIVING FORMAT 1 — Smart Pass Scheduler & Temporal
  // =========================================================================
  const [scheduleInput, setScheduleInput] = useState('next Thu 14:30');
  const [parsedSchedule, setParsedSchedule] = useState({
    iso: '',
    formatted: '',
    timeDelta: '',
    patternDetected: '',
    valid: true,
    elevation: 68
  });

  const parseForgivingSchedule = (text) => {
    const raw = text.trim().toLowerCase();
    if (!raw) {
      setParsedSchedule({ iso: 'Pending input...', formatted: 'Please enter schedule term', timeDelta: '', patternDetected: 'None', valid: false, elevation: 0 });
      return;
    }

    const now = new Date(2026, 7, 30, 13, 45, 0); // Base date: Aug 30, 2026
    let target = new Date(now);
    let pattern = 'Natural Language Relative';

    // 1. "next Thu", "nxt thu", "thu", "next monday", etc.
    const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, thursday: 4, tuesday: 2, wednesday: 3, friday: 5 };
    const dayMatch = raw.match(/(?:next\s+|nxt\s+)?(sun|mon|tue|wed|thu|fri|sat|thursday|tuesday|wednesday|friday)/);
    const timeMatch = raw.match(/(\d{1,2})[:.](\d{2})/);

    if (raw.includes('tomorrow')) {
      target.setDate(target.getDate() + 1);
      pattern = 'Relative Day ("tomorrow")';
      if (timeMatch) {
        target.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0);
      } else {
        target.setHours(8, 0, 0);
      }
    } else if (raw.includes('in ') && raw.includes('min')) {
      const mins = parseInt(raw.replace(/\D/g, ''), 10) || 45;
      target = new Date(now.getTime() + mins * 60000);
      pattern = 'Duration Offset ("in X mins")';
    } else if (raw.includes('pass +') || raw.includes('pass+')) {
      const passNum = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 1;
      target = new Date(now.getTime() + passNum * 94 * 60000); // Orbit period ~94m
      pattern = 'Orbital Pass Index ("pass +N")';
    } else if (raw.includes('day') || raw.includes('five days') || raw.includes('5 days')) {
      const days = raw.includes('five') ? 5 : (parseInt(raw.replace(/\D/g, ''), 10) || 5);
      target.setDate(target.getDate() + days);
      pattern = 'Day Multiplier ("X days")';
    } else if (dayMatch) {
      const targetDay = dayMap[dayMatch[1]];
      const currentDay = target.getDay();
      let diff = targetDay - currentDay;
      if (diff <= 0 || raw.includes('next') || raw.includes('nxt')) diff += 7;
      target.setDate(target.getDate() + diff);
      pattern = `Weekday Parser ("${dayMatch[1].toUpperCase()}")`;
      if (timeMatch) {
        target.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0);
      } else {
        target.setHours(14, 30, 0);
      }
    } else if (raw.match(/\d{1,2}[\/-]\d{1,2}/)) {
      // Date formats like 29/4/2026 or 4/29
      const parts = raw.split(/[\/\-\s]/);
      if (parts.length >= 2) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parts[2] ? parseInt(parts[2], 10) : 2026;
        target = new Date(y, m > 11 ? 3 : m, d > 31 ? 29 : d, 14, 30, 0);
        pattern = 'Numeric Date Format (DD/MM/YYYY)';
      }
    } else if (timeMatch) {
      target.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0);
      pattern = 'Time-of-day Parser (HH:MM)';
    }

    const diffHours = Math.round((target.getTime() - now.getTime()) / 3600000);
    const timeDeltaStr = diffHours > 0 ? `+ ${diffHours} hrs from current mission clock` : 'Imminent pass window';

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedStr = `${dayNames[target.getDay()]}, ${monthNames[target.getMonth()]} ${target.getDate()}, ${target.getFullYear()} · ${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}:00 UTC`;

    setParsedSchedule({
      iso: target.toISOString(),
      formatted: formattedStr,
      timeDelta: timeDeltaStr,
      patternDetected: pattern,
      valid: true,
      elevation: 72
    });
  };

  useEffect(() => {
    parseForgivingSchedule(scheduleInput);
  }, [scheduleInput]);

  // =========================================================================
  // APPLICATION TOPIC: FORGIVING FORMAT 2 — Target & Coordinate Resolver
  // =========================================================================
  const [targetInput, setTargetInput] = useState('VU2-SOMI');
  const [parsedTarget, setParsedTarget] = useState({
    type: 'Callsign / Ground Node',
    cleanCode: 'VU2SOMI',
    stationName: 'Mumbai Earth Station (KJSSE Ground Command)',
    grid: 'MK68vi',
    coords: '19.0760° N, 72.8777° E',
    azimuth: '142° SE'
  });

  const parseForgivingTarget = (text) => {
    const raw = text.trim();
    if (!raw) return;

    if (raw.toLowerCase().includes('mumbai') || raw.toLowerCase().includes('vu2')) {
      setParsedTarget({
        type: 'Callsign / Primary Station',
        cleanCode: 'VU2-SOMI',
        stationName: 'Mumbai Earth Station (KJSSE Ground Command)',
        grid: 'MK68vi',
        coords: '19.0760° N, 72.8777° E',
        azimuth: '142° SE'
      });
    } else if (raw.toLowerCase().includes('helsinki') || raw.toLowerCase().includes('reorbit')) {
      setParsedTarget({
        type: 'European Polar Station',
        cleanCode: 'OH2-ROB',
        stationName: 'Helsinki ReOrbit Ground Substation',
        grid: 'KP20ld',
        coords: '60.1699° N, 24.9384° E',
        azimuth: '348° N'
      });
    } else if (raw.match(/^[a-rA-R]{2}[0-9]{2}[a-xA-X]{2}/)) {
      // Maidenhead Grid
      setParsedTarget({
        type: 'Maidenhead QTH Grid Locator',
        cleanCode: raw.toUpperCase(),
        stationName: `Remote Amateur Radio Grid Node [${raw.toUpperCase()}]`,
        grid: raw.toUpperCase(),
        coords: 'Calculated via Grid Algorithm',
        azimuth: '185° S'
      });
    } else if (raw.match(/\d+[.,]\s*\d+/)) {
      // GPS Coordinates
      setParsedTarget({
        type: 'GPS Geodetic Coordinates',
        cleanCode: raw.replace(/\s+/g, ''),
        stationName: 'Custom Earth Coordinate Terminal',
        grid: 'Calculated',
        coords: raw,
        azimuth: '210° SW'
      });
    } else {
      setParsedTarget({
        type: 'Amateur Radio Node Callsign',
        cleanCode: raw.toUpperCase().replace(/[^A-Z0-9-]/g, ''),
        stationName: `Station Node [${raw.toUpperCase()}]`,
        grid: 'MK68vi',
        coords: '19.0760° N, 72.8777° E',
        azimuth: '120° ESE'
      });
    }
  };

  useEffect(() => {
    parseForgivingTarget(targetInput);
  }, [targetInput]);

  // =========================================================================
  // APPLICATION TOPIC: FORGIVING FORMAT 3 — Carrier Frequency Normalizer
  // =========================================================================
  const [freqInput, setFreqInput] = useState('437.000 MHz');
  const [parsedFreq, setParsedFreq] = useState({
    formatted: '437.0000 MHz',
    hz: 437000000,
    band: '70cm UHF Amateur Satellite Band',
    dopplerCorrection: '+1.42 kHz (Approaching)'
  });

  const parseForgivingFreq = (text) => {
    const raw = text.toLowerCase().replace(/[^0-9.]/g, '');
    let val = parseFloat(raw);
    if (isNaN(val)) return;

    if (val > 1000000) {
      // Input in Hz: 437000000
      val = val / 1000000;
    } else if (val > 1000) {
      // Input in kHz: 437000
      val = val / 1000;
    }

    setParsedFreq({
      formatted: `${val.toFixed(4)} MHz`,
      hz: Math.round(val * 1000000),
      band: val >= 430 && val <= 440 ? '70cm UHF Amateur Satellite Band' : 'VHF / Custom Uplink Band',
      dopplerCorrection: '+1.42 kHz (Approaching)'
    });
  };

  useEffect(() => {
    parseForgivingFreq(freqInput);
  }, [freqInput]);

  // =========================================================================
  // APPLICATION TOPIC: FORGIVING FORMAT 4 — Hex Telecommand Payload Buffer
  // =========================================================================
  const [hexInput, setHexInput] = useState('0xAA 0x55 0x01 0xFE');
  const [parsedHex, setParsedHex] = useState({
    bytes: ['AA', '55', '01', 'FE'],
    cleanHex: 'AA5501FE',
    byteCount: 4,
    crc16: '0x3F8A',
    opcodeName: 'BEACON_INTERVAL_SET (0x01)'
  });

  const parseForgivingHex = (text) => {
    // Strip 0x, colons, commas, whitespace, hyphens
    const clean = text.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    const bytes = clean.match(/.{1,2}/g) || [];
    
    let opcode = 'CUSTOM_PAYLOAD_EXEC';
    if (bytes[2] === '01') opcode = 'BEACON_INTERVAL_SET (0x01)';
    if (bytes[2] === '02') opcode = 'DEPLOY_CONFIRMATION_ACK (0x02)';
    if (bytes[2] === '03') opcode = 'PAYLOAD_MODE_SWITCH (0x03)';
    if (bytes[2] === '04') opcode = 'SAFE_MODE_OVERRIDE (0x04)';

    setParsedHex({
      bytes: bytes,
      cleanHex: clean,
      byteCount: bytes.length,
      crc16: '0x' + (Math.abs(clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 137) % 65535).toString(16).toUpperCase().padStart(4, '0'),
      opcodeName: opcode
    });
  };

  useEffect(() => {
    parseForgivingHex(hexInput);
  }, [hexInput]);

  // =========================================================================
  // APPLICATION TOPIC: STRUCTURED FORMAT 1 — Segmented Station Crypto Token
  // =========================================================================
  const [cryptoBlocks, setCryptoBlocks] = useState(['AUTH', '9924', 'X89F', 'KJS1']);
  const cryptoRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleCryptoChange = (index, value) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const nextBlocks = [...cryptoBlocks];
    nextBlocks[index] = clean;
    setCryptoBlocks(nextBlocks);

    // Auto-advance to next input on 4 characters
    if (clean.length === 4 && index < 3) {
      cryptoRefs[index + 1].current?.focus();
    }
  };

  const handleCryptoKeyDown = (index, e) => {
    // Backspace retreat to previous input if empty
    if (e.key === 'Backspace' && !cryptoBlocks[index] && index > 0) {
      cryptoRefs[index - 1].current?.focus();
    }
  };

  const handleCryptoPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasted.length > 0) {
      const nextBlocks = [
        pasted.slice(0, 4),
        pasted.slice(4, 8),
        pasted.slice(8, 12),
        pasted.slice(12, 16)
      ];
      setCryptoBlocks(nextBlocks);
      cryptoRefs[3].current?.focus();
    }
  };

  // =========================================================================
  // APPLICATION TOPIC: STRUCTURED FORMAT 2 — Segmented Station Hotline Phone
  // =========================================================================
  const [phoneBlocks, setPhoneBlocks] = useState({ area: '022', prefix: '6644', line: '9000' });
  const phonePrefixRef = useRef(null);
  const phoneLineRef = useRef(null);

  // =========================================================================
  // APPLICATION TOPIC: STRUCTURED FORMAT 3 — Structured Uplink Epoch & Time
  // =========================================================================
  const [epochMonth, setEpochMonth] = useState('August');
  const [epochDay, setEpochDay] = useState('30');
  const [epochYear, setEpochYear] = useState('2026');
  const [epochTime, setEpochTime] = useState({ h: '14', m: '30', s: '00' });

  // =========================================================================
  // AI USE CASE (KJS-SRS-01): FORGIVING FORMAT — Natural Language Policy
  // =========================================================================
  const [policyInput, setPolicyInput] = useState('safe mode below 25% battery and prioritize SSTV when SNR > 75 dB');
  const [parsedPolicy, setParsedPolicy] = useState({
    safeBatteryThreshold: 25,
    snrThreshold: 75,
    lowRssiMode: 'Codec2',
    beaconInterval: 30,
    rulesIdentified: 2
  });

  const parseForgivingPolicy = (text) => {
    const raw = text.toLowerCase();
    const batteryMatch = raw.match(/below\s*(\d{1,2})%|battery\s*<\s*(\d{1,2})|(\d{1,2})%\s*battery/);
    const snrMatch = raw.match(/snr\s*[>:]\s*(\d{1,3})|(\d{1,3})\s*db/);
    const intervalMatch = raw.match(/every\s*(\d{1,3})\s*s/);

    const safeBatt = batteryMatch ? (parseInt(batteryMatch[1] || batteryMatch[2] || batteryMatch[3], 10)) : 25;
    const snr = snrMatch ? (parseInt(snrMatch[1] || snrMatch[2], 10)) : 75;
    const interval = intervalMatch ? parseInt(intervalMatch[1], 10) : 30;

    let rulesCount = 0;
    if (batteryMatch) rulesCount++;
    if (snrMatch) rulesCount++;
    if (raw.includes('codec2') || raw.includes('m17') || raw.includes('sstv')) rulesCount++;

    setParsedPolicy({
      safeBatteryThreshold: safeBatt,
      snrThreshold: snr,
      lowRssiMode: raw.includes('codec2') ? 'Codec2' : 'M17 Digital',
      beaconInterval: interval,
      rulesIdentified: rulesCount || 1
    });
  };

  useEffect(() => {
    parseForgivingPolicy(policyInput);
  }, [policyInput]);

  // =========================================================================
  // AI USE CASE (KJS-SRS-01): STRUCTURED FORMAT — Segmented Channel Allocation
  // =========================================================================
  const [channelAlloc, setChannelAlloc] = useState({
    ttc: 40,
    sstv: 30,
    m17: 20,
    codec2: 10
  });

  const totalAlloc = channelAlloc.ttc + channelAlloc.sstv + channelAlloc.m17 + channelAlloc.codec2;
  const isAllocValid = totalAlloc === 100;

  // =========================================================================
  // AI USE CASE: STRUCTURED FORMAT — Neural SoC Bitmask Register
  // =========================================================================
  const [socMask, setSocMask] = useState(['0x0F', '0xA2', '0x3C', '0x01']);

  // =========================================================================
  // TRANSMISSION & TELEMETRY LEDGER ENGINE
  // =========================================================================
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [txProgress, setTxProgress] = useState(0);
  const txTimerRef = useRef(null);
  useEffect(() => () => clearInterval(txTimerRef.current), []);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);
  const [uplinkLedger, setUplinkLedger] = useState([
    {
      id: 'TC-9801',
      timestamp: '13:42:10 UTC',
      targetFreq: '437.0000 MHz',
      hexPayload: 'AA 55 01 FE',
      station: 'VU2-SOMI (Mumbai)',
      status: 'ACK 0x06 (EXECUTED)'
    },
    {
      id: 'TC-9800',
      timestamp: '12:15:45 UTC',
      targetFreq: '437.0000 MHz',
      hexPayload: 'AA 55 02 01',
      station: 'OH2-ROB (Helsinki)',
      status: 'ACK 0x06 (EXECUTED)'
    }
  ]);

  const handleTransmitTelecommand = () => {
    if (!isAllocValid) {
      alert('Error: Sub-watt channel allocation must equal exactly 100% before telecommand dispatch.');
      return;
    }

    setIsTransmitting(true);
    setTxProgress(10);
    setDispatchSuccess(null);

    clearInterval(txTimerRef.current);
    let progress = 10;
    txTimerRef.current = setInterval(() => {
      if (progress < 100) {
        progress += 25;
        setTxProgress(progress);
        return;
      }
      clearInterval(txTimerRef.current);
      setTxProgress(100);
      setIsTransmitting(false);
      const newEntry = {
        id: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        targetFreq: parsedFreq.formatted,
        hexPayload: parsedHex.bytes.join(' '),
        station: parsedTarget.cleanCode,
        status: 'ACK 0x06 (EXECUTED)'
      };
      setUplinkLedger((prev) => [newEntry, ...prev]);
      setDispatchSuccess({
        msg: `Telecommand Frame ${newEntry.id} dispatched to SomaiyaSat-1!`,
        ack: '0x06 (COMMAND_ACK_SUCCESS)',
        time: newEntry.timestamp,
        freq: parsedFreq.formatted,
        crypto: cryptoBlocks.join('-')
      });
    }, 250);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      
      {/* ═════════════════════════════════════════════════════════════════════
          HEADER BANNER & DUAL MODE SWITCHER
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '10px',
            backgroundColor: '#04060a',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00f0ff',
            boxShadow: 'none'
          }}>
            <Radio size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '700'
              }}>
                ORBITAL TELECOMMAND PIPELINE
              </span>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
                FORM DESIGN PATTERNS
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
              Ground Station Uplink &amp; Telecommand Gateway
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              High-frequency mission dispatch integrating <strong>Forgiving Format</strong> and <strong>Structured Format</strong> patterns for orbital pass scheduling and AI flight routing.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: '#05070f',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            onClick={() => setActiveView('console')}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '7px',
              backgroundColor: activeView === 'console' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
              border: activeView === 'console' ? '1px solid #00f0ff' : '1px solid transparent',
              color: activeView === 'console' ? '#00f0ff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Terminal size={15} /> Operational Console
          </button>
          <button
            onClick={() => setActiveView('wireframe')}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '7px',
              backgroundColor: activeView === 'wireframe' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
              border: activeView === 'wireframe' ? '1px solid #00f0ff' : '1px solid transparent',
              color: activeView === 'wireframe' ? '#00f0ff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Layout size={15} /> Wireframe &amp; Pattern Studio
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          MODE A: WIREFRAME & PATTERN BLUEPRINT STUDIO (Procedure Requirements)
          ═════════════════════════════════════════════════════════════════════ */}
      {activeView === 'wireframe' && (
        <WireframeStudio />
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          MODE B: INTERACTIVE OPERATIONAL CONSOLE
          ═════════════════════════════════════════════════════════════════════ */}
      {activeView === 'console' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Transmission Success Notification */}
          {dispatchSuccess && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} color="#34d399" />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
                    {dispatchSuccess.msg}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#a7f3d0', fontFamily: 'JetBrains Mono, monospace' }}>
                    Uplink Frequency: {dispatchSuccess.freq} &bull; Auth Key: {dispatchSuccess.crypto} &bull; Status: {dispatchSuccess.ack}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDispatchSuccess(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Grid Layout: Application Topic (Left) & AI Use Case (Right) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(540px, 1fr))',
            gap: '2rem'
          }}>

            {/* ═══════════════════════════════════════════════════════════════
                COLUMN 1: APPLICATION TOPIC — Ground Station Uplink Portal
                ═══════════════════════════════════════════════════════════════ */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Satellite size={18} color="#38bdf8" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                    Application Form: Ground Pass Uplink
                  </h2>
                </div>
                <span style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  FORM PATTERNS ACTIVE
                </span>
              </div>

              {/* Forgiving Pattern 1: Smart Temporal Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#38bdf8" /> Scheduled Ground Pass (Natural Language Temporal Input)
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    FORGIVING FORMAT
                  </span>
                </div>

                <input
                  type="text"
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                  placeholder="e.g. next Thu 14:30, tomorrow 08:00, in 45 mins, 29/4/2026, 5 days"
                  style={{
                    width: '100%',
                    backgroundColor: '#05070f',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '8px',
                    padding: '0.7rem 0.9rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                />

                {/* Quick Demo Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {['next Thu 14:30', 'tomorrow 08:00 UTC', 'in 45 mins', '29/4/2026', '5 days', 'pass +3'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setScheduleInput(term)}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>

                {/* Forgiving Parse Echo Result */}
                <div style={{
                  backgroundColor: '#040711',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginTop: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', fontWeight: '600', marginBottom: '3px' }}>
                    <span>Standardized UTC Echo:</span>
                    <span style={{ color: '#34d399' }}>✓ {parsedSchedule.patternDetected}</span>
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '0.85rem', fontWeight: '700' }}>
                    {parsedSchedule.formatted}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '2px' }}>
                    ISO: {parsedSchedule.iso} &bull; Offset: {parsedSchedule.timeDelta}
                  </div>
                </div>
              </div>

              {/* Forgiving Pattern 2: Target & Coordinate Resolver */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={14} color="#38bdf8" /> Earth Station Target &amp; Coordinate Resolver
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    FORGIVING FORMAT
                  </span>
                </div>

                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="e.g. vu2 somi, MK68vi, Mumbai, 19.076 72.877, Helsinki"
                  style={{
                    width: '100%',
                    backgroundColor: '#05070f',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '8px',
                    padding: '0.7rem 0.9rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                />

                {/* Quick Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {['VU2-SOMI', 'MK68vi (Mumbai)', 'OH2-ROB (Helsinki)', '19.0760, 72.8777'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTargetInput(chip)}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div style={{
                  backgroundColor: '#040711',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginTop: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  <div style={{ color: '#38bdf8', fontWeight: '600' }}>{parsedTarget.stationName}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>
                    Type: <span style={{ color: '#34d399' }}>{parsedTarget.type}</span> &bull; Grid: {parsedTarget.grid} &bull; Coords: {parsedTarget.coords}
                  </div>
                </div>
              </div>

              {/* Structured Pattern 1: Segmented Station Crypto Token */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} color="#c084fc" /> Station Cryptographic Hardware Token
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    STRUCTURED FORMAT
                  </span>
                </div>

                {/* 4-Block Segmented Input Boxes with Auto-advance */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {cryptoBlocks.map((block, idx) => (
                    <React.Fragment key={idx}>
                      <input
                        ref={cryptoRefs[idx]}
                        type="text"
                        maxLength={4}
                        value={block}
                        onChange={(e) => handleCryptoChange(idx, e.target.value)}
                        onKeyDown={(e) => handleCryptoKeyDown(idx, e)}
                        onPaste={idx === 0 ? handleCryptoPaste : undefined}
                        placeholder="••••"
                        style={{
                          flex: 1,
                          backgroundColor: '#05070f',
                          border: '1px solid rgba(168, 85, 247, 0.45)',
                          borderRadius: '8px',
                          padding: '0.65rem',
                          textAlign: 'center',
                          color: '#c084fc',
                          fontSize: '1rem',
                          fontWeight: '800',
                          fontFamily: 'JetBrains Mono, monospace',
                          outline: 'none'
                        }}
                      />
                      {idx < 3 && <span style={{ color: '#64748b', fontWeight: '800' }}>-</span>}
                    </React.Fragment>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Auto-advances focus on 4 chars &bull; Supports 16-char paste
                  </span>
                  <button
                    type="button"
                    onClick={() => setCryptoBlocks(['AUTH', '9924', 'X89F', 'KJS1'])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    <Sparkles size={12} /> Auto-fill Demo Key
                  </button>
                </div>
              </div>

              {/* Structured Pattern 2: Segmented Emergency Station Hotline */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#c084fc" /> Ground Station Emergency Link Hotline (Segmented Phone)
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    STRUCTURED FORMAT
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontWeight: '700' }}>(</span>
                  <input
                    type="text"
                    maxLength={3}
                    value={phoneBlocks.area}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setPhoneBlocks({ ...phoneBlocks, area: v });
                      if (v.length === 3) phonePrefixRef.current?.focus();
                    }}
                    placeholder="022"
                    style={{
                      width: '60px',
                      backgroundColor: '#05070f',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      borderRadius: '6px',
                      padding: '0.55rem',
                      textAlign: 'center',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none'
                    }}
                  />
                  <span style={{ color: '#64748b', fontWeight: '700' }}>)</span>

                  <input
                    ref={phonePrefixRef}
                    type="text"
                    maxLength={4}
                    value={phoneBlocks.prefix}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPhoneBlocks({ ...phoneBlocks, prefix: v });
                      if (v.length === 4) phoneLineRef.current?.focus();
                    }}
                    placeholder="6644"
                    style={{
                      width: '75px',
                      backgroundColor: '#05070f',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      borderRadius: '6px',
                      padding: '0.55rem',
                      textAlign: 'center',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none'
                    }}
                  />
                  <span style={{ color: '#64748b', fontWeight: '700' }}>-</span>

                  <input
                    ref={phoneLineRef}
                    type="text"
                    maxLength={4}
                    value={phoneBlocks.line}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPhoneBlocks({ ...phoneBlocks, line: v });
                    }}
                    placeholder="9000"
                    style={{
                      width: '75px',
                      backgroundColor: '#05070f',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      borderRadius: '6px',
                      padding: '0.55rem',
                      textAlign: 'center',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '6px' }}>
                    Mumbai KJSSE Earth Control
                  </span>
                </div>
              </div>

              {/* Structured Pattern 3: Uplink Epoch (Dropdown Month + Segmented Date/Time) */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} color="#c084fc" /> Structured Epoch Timestamp (Figure 7 LiveJournal Pattern)
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    STRUCTURED FORMAT
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={epochMonth}
                    onChange={(e) => setEpochMonth(e.target.value)}
                    style={{
                      backgroundColor: '#05070f',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      borderRadius: '6px',
                      padding: '0.55rem 0.8rem',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    maxLength={2}
                    value={epochDay}
                    onChange={(e) => setEpochDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    style={{ width: '42px', backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '6px', padding: '0.55rem', textAlign: 'center', color: '#c084fc', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <span style={{ color: '#64748b' }}>/</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={epochYear}
                    onChange={(e) => setEpochYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    style={{ width: '58px', backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '6px', padding: '0.55rem', textAlign: 'center', color: '#c084fc', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', outline: 'none' }}
                  />

                  <span style={{ color: '#64748b', margin: '0 4px' }}>&bull;</span>

                  <input
                    type="text"
                    maxLength={2}
                    value={epochTime.h}
                    onChange={(e) => setEpochTime({ ...epochTime, h: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    style={{ width: '38px', backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '6px', padding: '0.55rem', textAlign: 'center', color: '#ffffff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <span style={{ color: '#64748b' }}>:</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={epochTime.m}
                    onChange={(e) => setEpochTime({ ...epochTime, m: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    style={{ width: '38px', backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '6px', padding: '0.55rem', textAlign: 'center', color: '#ffffff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <span style={{ color: '#64748b' }}>:</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={epochTime.s}
                    onChange={(e) => setEpochTime({ ...epochTime, s: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    style={{ width: '38px', backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '6px', padding: '0.55rem', textAlign: 'center', color: '#ffffff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px' }}>(24-hr UTC)</span>
                </div>
              </div>

            </div>

            {/* ═══════════════════════════════════════════════════════════════
                COLUMN 2: AI USE CASE (KJS-SRS-01) — AI Data Router & Payloads
                ═══════════════════════════════════════════════════════════════ */}
            <div style={{
              backgroundColor: '#080b12',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} color="#34d399" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                    AI Use Case (KJS-SRS-01): Autonomous Router
                  </h2>
                </div>
                <span style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  SUB-WATT AI FLIGHT CORE
                </span>
              </div>

              {/* AI Forgiving Pattern 1: Natural Language Flight Rule Directive */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#38bdf8" /> Natural Language AI Policy Directive
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    FORGIVING FORMAT
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={policyInput}
                  onChange={(e) => setPolicyInput(e.target.value)}
                  placeholder='e.g. "safe mode below 25% battery and prioritize SSTV when SNR > 75 dB"'
                  style={{
                    width: '100%',
                    backgroundColor: '#05070f',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '8px',
                    padding: '0.7rem 0.9rem',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                />

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {[
                    'safe mode below 20% battery',
                    'prioritize SSTV when SNR > 75 dB',
                    'use Codec2 when link is low',
                    'beacon TT&C every 30s'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPolicyInput(preset)}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* AI Rule Parser Output Card */}
                <div style={{
                  backgroundColor: '#040711',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginTop: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: '700', marginBottom: '4px' }}>
                    <span>Parsed AI Flight Directives:</span>
                    <span>✓ {parsedPolicy.rulesIdentified} Active Vectors</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px', marginTop: '4px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Battery Threshold:</span> <strong style={{ color: '#38bdf8' }}>{parsedPolicy.safeBatteryThreshold}%</strong>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>SSTV SNR Trigger:</span> <strong style={{ color: '#34d399' }}>{parsedPolicy.snrThreshold} dB</strong>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Low RSSI Fallback:</span> <strong style={{ color: '#fbbf24' }}>{parsedPolicy.lowRssiMode}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Structured Pattern 1: Segmented Multi-Channel Power Matrix */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders size={14} color="#c084fc" /> Sub-watt Power &amp; Bandwidth Channel Matrix (100% Constrained)
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    STRUCTURED FORMAT
                  </span>
                </div>

                {/* Segmented Channel Percentage Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(52, 211, 153, 0.35)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: '700' }}>TT&amp;C (Core)</div>
                    <input
                      type="number"
                      min={30}
                      max={100}
                      value={channelAlloc.ttc}
                      onChange={(e) => setChannelAlloc({ ...channelAlloc, ttc: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', textAlign: 'center', color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    />
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>% Watts</div>
                  </div>

                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: '700' }}>SSTV Image</div>
                    <input
                      type="number"
                      min={0}
                      max={70}
                      value={channelAlloc.sstv}
                      onChange={(e) => setChannelAlloc({ ...channelAlloc, sstv: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', textAlign: 'center', color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    />
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>% Watts</div>
                  </div>

                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: '700' }}>M17 Voice</div>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={channelAlloc.m17}
                      onChange={(e) => setChannelAlloc({ ...channelAlloc, m17: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', textAlign: 'center', color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    />
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>% Watts</div>
                  </div>

                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(251, 191, 36, 0.35)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: '700' }}>Codec2</div>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={channelAlloc.codec2}
                      onChange={(e) => setChannelAlloc({ ...channelAlloc, codec2: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', textAlign: 'center', color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    />
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>% Watts</div>
                  </div>
                </div>

                {/* Allocation Sum & Power Bar */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' }}>
                    <span style={{ color: isAllocValid ? '#34d399' : '#ef4444' }}>
                      {isAllocValid ? '✓ Power Budget: 100% Balanced' : `⚠ Constraint Error: Total is ${totalAlloc}% (Must equal exactly 100%)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChannelAlloc({ ttc: 40, sstv: 30, m17: 20, codec2: 10 })}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      Reset 40/30/20/10
                    </button>
                  </div>

                  {/* Multi-color power bar */}
                  <div style={{ height: '8px', borderRadius: '4px', display: 'flex', overflow: 'hidden', backgroundColor: '#05070f' }}>
                    <div style={{ width: `${channelAlloc.ttc}%`, backgroundColor: '#34d399', transition: 'width 0.3s ease' }} title="TT&C" />
                    <div style={{ width: `${channelAlloc.sstv}%`, backgroundColor: '#38bdf8', transition: 'width 0.3s ease' }} title="SSTV" />
                    <div style={{ width: `${channelAlloc.m17}%`, backgroundColor: '#a855f7', transition: 'width 0.3s ease' }} title="M17" />
                    <div style={{ width: `${channelAlloc.codec2}%`, backgroundColor: '#fbbf24', transition: 'width 0.3s ease' }} title="Codec2" />
                  </div>
                </div>
              </div>

              {/* AI Forgiving Pattern 2: Hex Telecommand Stream Buffer */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Terminal size={14} color="#38bdf8" /> Forgiving Hex Telecommand Payload Buffer
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    FORGIVING FORMAT
                  </span>
                </div>

                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="0xAA 0x55 0x01 0xFE (tolerates colons, spaces, prefixes)"
                  style={{
                    width: '100%',
                    backgroundColor: '#05070f',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '8px',
                    padding: '0.7rem 0.9rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                />

                <div style={{
                  backgroundColor: '#040711',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginTop: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', fontWeight: '600' }}>
                    <span>Decoded Opcode: {parsedHex.opcodeName}</span>
                    <span style={{ color: '#34d399' }}>CRC-16: {parsedHex.crc16}</span>
                  </div>
                  <div style={{ color: '#f8fafc', fontSize: '0.85rem', fontWeight: '700', marginTop: '3px', letterSpacing: '0.08em' }}>
                    [ {parsedHex.bytes.join(' ')} ] ({parsedHex.byteCount} Bytes)
                  </div>
                </div>
              </div>

              {/* AI Structured Pattern 2: Segmented Neural SoC Quantization Bitmask */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '600', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} color="#c084fc" /> Neural Flight SoC Quantization Bitmask (Segmented Hex)
                  </label>
                  <span style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: '700'
                  }}>
                    STRUCTURED FORMAT
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {socMask.map((byte, idx) => (
                    <React.Fragment key={idx}>
                      <input
                        type="text"
                        maxLength={4}
                        value={byte}
                        onChange={(e) => {
                          const next = [...socMask];
                          next[idx] = e.target.value.toUpperCase();
                          setSocMask(next);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: '#05070f',
                          border: '1px solid rgba(168, 85, 247, 0.4)',
                          borderRadius: '6px',
                          padding: '0.55rem',
                          textAlign: 'center',
                          color: '#c084fc',
                          fontSize: '0.88rem',
                          fontWeight: '700',
                          fontFamily: 'JetBrains Mono, monospace',
                          outline: 'none'
                        }}
                      />
                      {idx < 3 && <span style={{ color: '#64748b', fontWeight: '700' }}>:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              SECTION 3: ACTION BAR & TELECOMMAND DISPATCHER
              ═════════════════════════════════════════════════════════════════ */}
          <div style={{
            backgroundColor: '#0b101d',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '1.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 16px 40px rgba(0,0,0,0.7)'
          }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', fontFamily: 'Space Grotesk, sans-serif' }}>
                Ready to Transmit CCSDS Telecommand Frame
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                Target: {parsedTarget.cleanCode} &bull; Carrier: {parsedFreq.formatted} &bull; Frame: [{parsedHex.bytes.join(' ')}] &bull; Auth: {cryptoBlocks.join('-')}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={handleTransmitTelecommand}
                disabled={isTransmitting || !isAllocValid}
                style={{
                  backgroundColor: '#00f0ff',
                  color: '#04060a',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.85rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: isTransmitting || !isAllocValid ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
                  opacity: isTransmitting || !isAllocValid ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={18} />
                {isTransmitting ? `Modulating RF Wave (${txProgress}%)...` : 'Transmit Telecommand Packet'}
              </button>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              SECTION 4: GROUND PASS UPLINK LEDGER TABLE
              ═════════════════════════════════════════════════════════════════ */}
          <div style={{
            backgroundColor: '#080b12',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                  Live Telecommand Uplink Ledger
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                HISTORY &bull; {uplinkLedger.length} TRANSMISSIONS LOGGED
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>FRAME ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>UTC TIMESTAMP</th>
                    <th style={{ padding: '0.75rem 1rem' }}>CARRIER FREQ</th>
                    <th style={{ padding: '0.75rem 1rem' }}>HEX PAYLOAD</th>
                    <th style={{ padding: '0.75rem 1rem' }}>TARGET STATION</th>
                    <th style={{ padding: '0.75rem 1rem' }}>EXECUTION STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {uplinkLedger.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', backgroundColor: idx === 0 ? 'rgba(56, 189, 248, 0.04)' : 'transparent' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#38bdf8', fontWeight: '700' }}>{row.id}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#f8fafc' }}>{row.timestamp}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>{row.targetFreq}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a855f7', fontWeight: '700' }}>[ {row.hexPayload} ]</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>{row.station}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                          ✓ {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
