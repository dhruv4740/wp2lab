import React, { useState } from 'react';
import { Sliders, Edit3, Check, X, Cpu } from 'lucide-react';

import PassLogTable from '../components/PassLogTable';
import RuleConfigOverlay from '../components/RuleConfigOverlay';
import DraggableCards from '../components/DraggableCards';
import DraggableQueue from '../components/DraggableQueue';
import PassDetailOverlay from '../components/PassDetailOverlay';
import SSTVCarousel from '../components/SSTVCarousel';
import TelemetryStreamEngine from '../components/TelemetryStreamEngine';

export default function TelemetryHub() {
  // useState: values shared by the Widgets and AI router tabs
  const [linkQuality, setLinkQuality] = useState('High');
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Inline edit: the saved name, whether the input is showing, and the text being typed
  const [satNickname, setSatNickname] = useState('SomaiyaSat-1');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameEdit, setNicknameEdit] = useState('');

  // Overlay edit: whether the popup is open, and the rules it changes
  const [showRuleOverlay, setShowRuleOverlay] = useState(false);
  const [aiRules, setAiRules] = useState({
    batterySafeThreshold: 25,
    snrSstvThreshold: 75,
    snrVoiceThreshold: 40,
    beaconInterval: 30,
  });

  // Drag and drop: the order of the three cards
  const [cardOrder, setCardOrder] = useState(['orbit', 'battery', 'rf-link']);

  // Which tab is open, and which pass row (if any) is shown in the detail popup
  const [tab, setTab] = useState('stream');
  const [selectedPass, setSelectedPass] = useState(null);

  // Recalculated on every render from the battery level and the AI rules
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
    if (nicknameEdit.trim()) setSatNickname(nicknameEdit.trim());
    setIsEditingNickname(false);
  };

  const TABS = [
    ['stream', 'Live stream'],
    ['widgets', 'Widgets'],
    ['router', 'AI router'],
    ['sstv', 'SSTV images'],
    ['passes', 'Pass log'],
  ];
  const panel = { padding: '1.5rem', backgroundColor: '#0a0e18', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' };
  const iconBtn = { background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '2rem', color: '#f0f2f5' }}>Telemetry</h1>
          {/* Inline edit: click the pencil, type, save */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: 6, border: '1px solid rgba(0, 229, 255, 0.25)', backgroundColor: '#0a0e18' }}>
            {isEditingNickname ? (
              <>
                <input value={nicknameEdit} onChange={(e) => setNicknameEdit(e.target.value)} autoFocus style={{ background: '#060810', border: '1px solid #00e5ff', borderRadius: 4, color: '#00e5ff', fontFamily: 'var(--font-mono)', padding: '0.15rem 0.4rem', outline: 'none' }} />
                <button type="button" onClick={handleSaveEdit} style={{ ...iconBtn, color: '#10b981' }}><Check size={16} /></button>
                <button type="button" onClick={() => setIsEditingNickname(false)} style={{ ...iconBtn, color: '#f43f5e' }}><X size={16} /></button>
              </>
            ) : (
              <>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#00e5ff', fontWeight: 600 }}>{satNickname}</span>
                <button type="button" onClick={handleStartEdit} title="Rename satellite" style={{ ...iconBtn, color: '#64748b' }}><Edit3 size={14} /></button>
              </>
            )}
          </div>
        </div>
        <button type="button" onClick={() => setShowRuleOverlay(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid rgba(0, 229, 255, 0.35)', backgroundColor: 'rgba(0, 229, 255, 0.12)', color: '#00e5ff', cursor: 'pointer' }}>
          <Sliders size={16} /> AI rules
        </button>
      </div>

      {/* Tab buttons set `tab`; only the matching panel below is rendered */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {TABS.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} style={{ padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', border: '1px solid ' + (tab === id ? '#00e5ff' : '#334155'), background: tab === id ? 'rgba(0, 229, 255, 0.15)' : 'transparent', color: tab === id ? '#00e5ff' : '#94a3b8' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'stream' && <TelemetryStreamEngine />}

      {tab === 'widgets' && (
        <>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            <label>Battery {batteryLevel}% <input type="range" min="0" max="100" value={batteryLevel} onChange={(e) => setBatteryLevel(+e.target.value)} style={{ verticalAlign: 'middle' }} /></label>
            <label>Link <select value={linkQuality} onChange={(e) => setLinkQuality(e.target.value)} style={{ background: '#0b101d', color: '#f8fafc', border: '1px solid #334155', borderRadius: 6, padding: '0.2rem' }}>{['High', 'Medium', 'Low'].map((l) => <option key={l}>{l}</option>)}</select></label>
            <span>Drag the cards to reorder. Changing these also changes the AI router.</span>
          </div>
          <DraggableCards cardOrder={cardOrder} onReorder={setCardOrder} batteryLevel={batteryLevel} linkQuality={linkQuality} />
        </>
      )}

      {tab === 'router' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={panel}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cpu size={18} color="#10b981" /> AI arbitration</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Priority is recalculated from battery level and the AI rules.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {getAIRoutingPriority().map((item) => {
                const on = item.status.includes('ACTIVE') || item.status.includes('TRANSMITTING');
                return (
                  <div key={item.mode} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600 }}>{item.mode}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.reason}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: 4, color: on ? '#00e5ff' : '#fbbf24', backgroundColor: on ? 'rgba(0, 229, 255, 0.15)' : 'rgba(245, 158, 11, 0.15)' }}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={panel}>
            <DraggableQueue aiDecisions={getAIRoutingPriority()} />
          </div>
        </div>
      )}

      {tab === 'sstv' && <SSTVCarousel />}

      {tab === 'passes' && <PassLogTable onPassClick={setSelectedPass} />}

      {/* Overlays are only mounted while open */}
      {showRuleOverlay && <RuleConfigOverlay aiRules={aiRules} setAiRules={setAiRules} onClose={() => setShowRuleOverlay(false)} />}
      {selectedPass && <PassDetailOverlay pass={selectedPass} onClose={() => setSelectedPass(null)} />}
    </div>
  );
}
