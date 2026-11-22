import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Activity, Sliders, ArrowRight, Edit3, Check, X, Radio, Orbit, Cpu, Zap, Play, Pause, Trash2, RefreshCw, Terminal, Layers } from 'lucide-react';

import SatelliteConfigCard from '../components/SatelliteConfigCard';
import PassLogTable from '../components/PassLogTable';
import RuleConfigOverlay from '../components/RuleConfigOverlay';

import DraggableCards from '../components/DraggableCards';
import DraggableQueue from '../components/DraggableQueue';
import PassDetailOverlay from '../components/PassDetailOverlay';
import SSTVCarousel from '../components/SSTVCarousel';
import TelemetryStreamEngine from '../components/TelemetryStreamEngine';

export default function TelemetryHub() {
  const { user, isLoggedIn } = useAuth();

  // Core Telemetry State
  const [linkQuality, setLinkQuality] = useState('High');
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Experiment 4: Single-Field Inline Edit State
  const [satNickname, setSatNickname] = useState('SomaiyaSat-1');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameEdit, setNicknameEdit] = useState('');

  // Experiment 4: Overlay Edit State
  const [showRuleOverlay, setShowRuleOverlay] = useState(false);
  const [aiRules, setAiRules] = useState({
    batterySafeThreshold: 25,
    snrSstvThreshold: 75,
    snrVoiceThreshold: 40,
    beaconInterval: 30,
  });

  // Experiment 5: Drag-and-Drop Card Order
  const [cardOrder, setCardOrder] = useState(['orbit', 'battery', 'rf-link']);

  // Experiment 5: Pass Detail Overlay
  const [selectedPass, setSelectedPass] = useState(null);

  // AI Router Logic (uses configurable rules)
  const getAIRoutingPriority = () => {
    if (batteryLevel < aiRules.batterySafeThreshold) {
      return [
        { mode: 'TT&C / Housekeeping', status: 'TRANSMITTING (CRITICAL)', reason: 'Low Battery (<' + aiRules.batterySafeThreshold + '%) - Safe Mode Enforcement' },
        { mode: 'M17 Digital Voice', status: 'QUEUED (PAUSED)', reason: 'Conserving Sub-watt Power' },
        { mode: 'Codec2 Voice', status: 'QUEUED (PAUSED)', reason: 'Conserving Sub-watt Power' },
        { mode: 'Robot36 SSTV', status: 'DISABLED', reason: 'High Power Drain Inhibited' },
      ];
    }
    return [
      { mode: 'M17 Digital Voice', status: 'ACTIVE STREAM', reason: 'Nominal Power (' + batteryLevel + '%) & High Link Margin' },
      { mode: 'Robot36 SSTV', status: 'TRANSMITTING', reason: 'Earth View Image Packet Modulation' },
      { mode: 'TT&C / Housekeeping', status: 'BACKGROUND BEACON', reason: 'Every ' + aiRules.beaconInterval + 's Nominal' },
      { mode: 'Codec2 Voice', status: 'STANDBY', reason: 'Secondary Voice Channel Ready' },
    ];
  };

  const handleStartEdit = () => {
    setNicknameEdit(satNickname);
    setIsEditingNickname(true);
  };

  const handleSaveEdit = () => {
    if (nicknameEdit.trim()) {
      setSatNickname(nicknameEdit.trim());
    }
    setIsEditingNickname(false);
  };

  const handleCancelEdit = () => {
    setIsEditingNickname(false);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '3.5rem 1.5rem 6rem' }}>
      {/* Top Banner */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00e5ff', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
              EXPERIMENT 04 // INLINE EDITING &amp; OVERLAYS
            </span>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
              EXPERIMENT 05 // DRAG &amp; DROP WORKBENCH
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', color: '#f0f2f5' }}>
              TELEMETRY CONTROL CENTER
            </h1>

            {/* Experiment 4: Single-field Inline Edit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0a0e18', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0, 229, 255, 0.25)' }}>
              {isEditingNickname ? (
                <>
                  <input
                    type="text"
                    value={nicknameEdit}
                    onChange={(e) => setNicknameEdit(e.target.value)}
                    autoFocus
                    style={{
                      backgroundColor: 'rgba(6, 8, 16, 0.8)',
                      border: '1px solid #00e5ff',
                      borderRadius: '4px',
                      color: '#00e5ff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      padding: '0.2rem 0.4rem',
                      outline: 'none',
                    }}
                  />
                  <button type="button" onClick={handleSaveEdit} style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer' }}>
                    <Check size={16} />
                  </button>
                  <button type="button" onClick={handleCancelEdit} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#00e5ff', fontWeight: 600 }}>
                    {satNickname}
                  </span>
                  <button type="button" onClick={handleStartEdit} title="Inline Edit Satellite Callsign" style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex' }}>
                    <Edit3 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '800px', lineHeight: 1.6, marginTop: '0.5rem' }}>
            Real-time orbital telemetry monitoring, autonomous AI packet arbitration, draggable metric widgets, and SSTV image reception carousel.
          </p>
        </div>

        {/* Experiment 4: Trigger Overlay Configuration */}
        <button
          type="button"
          onClick={() => setShowRuleOverlay(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'rgba(0, 229, 255, 0.12)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '8px',
            color: '#00e5ff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Sliders size={16} />
          <span>CONFIGURE AI RULES [OVERLAY]</span>
        </button>
      </div>

      {/* Experiment 02: Dedicated Live State & Lifecycle Engine (useState + useEffect) */}
      <TelemetryStreamEngine />

      {/* Experiment 5: Draggable Telemetry Cards Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="#00e5ff" />
          <span>Orbital Telemetry Widgets (Drag Cards to Reorder)</span>
        </h3>
        <DraggableCards
          cardOrder={cardOrder}
          setCardOrder={setCardOrder}
          batteryLevel={batteryLevel}
          setBatteryLevel={setBatteryLevel}
          linkQuality={linkQuality}
          setLinkQuality={setLinkQuality}
        />
      </div>

      {/* AI Priority Decisions & Draggable Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#0a0e18', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="#10b981" />
            <span>Autonomous AI Arbitration Status</span>
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Dynamic priority assignment calculated onboard based on instantaneous solar generation and link budget.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {getAIRoutingPriority().map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem',
                  backgroundColor: 'rgba(6, 8, 16, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f0f2f5', fontWeight: 600 }}>
                    {item.mode}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                    {item.reason}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: item.status.includes('ACTIVE') || item.status.includes('TRANSMITTING') ? 'rgba(0, 229, 255, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: item.status.includes('ACTIVE') || item.status.includes('TRANSMITTING') ? '#00e5ff' : '#fbbf24',
                    fontWeight: 700,
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Experiment 5: Draggable Queue */}
        <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#0a0e18', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}>
          <DraggableQueue aiDecisions={getAIRoutingPriority()} />
        </div>
      </div>

      {/* SSTV Image Transmission Carousel */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={18} color="#f59e0b" />
          <span>Robot36 SSTV Downlink Reception Carousel</span>
        </h3>
        <SSTVCarousel />
      </div>

      {/* Pass Log Table */}
      <div>
        <h3 style={{ fontSize: '1.25rem', color: '#f0f2f5', marginBottom: '1rem' }}>
          Ground Station Pass Records &bull; Click Pass to Inspect Overlay
        </h3>
        <PassLogTable onSelectPass={(pass) => setSelectedPass(pass)} />
      </div>

      {/* Experiment 4: Rule Config Overlay */}
      {showRuleOverlay && (
        <RuleConfigOverlay
          aiRules={aiRules}
          setAiRules={setAiRules}
          onClose={() => setShowRuleOverlay(false)}
        />
      )}

      {/* Experiment 5: Pass Detail Overlay */}
      {selectedPass && (
        <PassDetailOverlay
          pass={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}
    </div>
  );
}
