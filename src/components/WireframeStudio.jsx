import React, { useState } from 'react';
import {
  Layout,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  CheckCircle2,
  Sliders,
  Radio,
  Cpu,
  Eye,
  FileCode,
  Shield,
  Clock,
  Compass,
  Zap,
  Terminal,
  Grid,
  DollarSign,
  Building,
  CreditCard,
  Phone,
  Calendar,
  Lock,
  Globe
} from 'lucide-react';

export default function WireframeStudio() {
  const [activeWireframe, setActiveWireframe] = useState('both');
  const [showForgivingHighlights, setShowForgivingHighlights] = useState(true);
  const [showStructuredHighlights, setShowStructuredHighlights] = useState(true);
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const forgivingBadgeStyle = {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    color: '#38bdf8',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.68rem',
    fontWeight: '700',
    fontFamily: 'JetBrains Mono, monospace',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  };

  const structuredBadgeStyle = {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    color: '#c084fc',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.68rem',
    fontWeight: '700',
    fontFamily: 'JetBrains Mono, monospace',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Studio Toolbar */}
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}>
        {/* View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layout size={15} color="#38bdf8" /> Wireframe Blueprint Target:
          </span>
          <button
            onClick={() => setActiveWireframe('both')}
            style={{
              backgroundColor: activeWireframe === 'both' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: activeWireframe === 'both' ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeWireframe === 'both' ? '#00f0ff' : '#94a3b8',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Dual Blueprint Comparison
          </button>
          <button
            onClick={() => setActiveWireframe('app')}
            style={{
              backgroundColor: activeWireframe === 'app' ? '#0284c7' : 'rgba(255, 255, 255, 0.04)',
              border: activeWireframe === 'app' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeWireframe === 'app' ? '#ffffff' : '#94a3b8',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Wireframe 01: FinTech Remittance (Application)
          </button>
          <button
            onClick={() => setActiveWireframe('ai')}
            style={{
              backgroundColor: activeWireframe === 'ai' ? '#0284c7' : 'rgba(255, 255, 255, 0.04)',
              border: activeWireframe === 'ai' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeWireframe === 'ai' ? '#ffffff' : '#94a3b8',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Wireframe 02: KJS-SRS-01 AI Router (Use Case)
          </button>
        </div>

        {/* Blueprint Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showForgivingHighlights}
              onChange={(e) => setShowForgivingHighlights(e.target.checked)}
              style={{ accentColor: '#38bdf8' }}
            />
            <span style={{ color: '#38bdf8' }}>Forgiving Zones</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showStructuredHighlights}
              onChange={(e) => setShowStructuredHighlights(e.target.checked)}
              style={{ accentColor: '#c084fc' }}
            />
            <span style={{ color: '#c084fc' }}>Structured Zones</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showGridOverlay}
              onChange={(e) => setShowGridOverlay(e.target.checked)}
              style={{ accentColor: '#34d399' }}
            />
            <span style={{ color: '#94a3b8' }}>Grid Layout</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showAnnotations}
              onChange={(e) => setShowAnnotations(e.target.checked)}
              style={{ accentColor: '#f59e0b' }}
            />
            <span style={{ color: '#fbbf24' }}>UX Annotations</span>
          </label>
        </div>
      </div>

      {/* Wireframes Display Canvas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeWireframe === 'both' ? 'repeat(auto-fit, minmax(480px, 1fr))' : '1fr',
        gap: '2rem'
      }}>
        {/* ========================================================================= */}
        {/* WIREFRAME 1: Chosen Application — Global FinTech Wire & Remittance Portal  */}
        {/* ========================================================================= */}
        {(activeWireframe === 'both' || activeWireframe === 'app') && (
          <div style={{
            backgroundColor: '#080b12',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
            backgroundImage: showGridOverlay
              ? 'linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)'
              : 'none',
            backgroundSize: '24px 24px'
          }}>
            <div className="cad-corner-tl" />
            <div className="cad-corner-tr" />
            <div className="cad-corner-bl" />
            <div className="cad-corner-br" />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(56, 189, 248, 0.3)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  // WIREFRAME 01 &bull; CHOSEN APPLICATION TOPIC (FINTECH &amp; BANKING)
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                  Global Multi-Currency Wire &amp; Cross-Border Remittance Portal
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Enterprise cross-border payment gateway integrating Forgiving amount &amp; bank resolvers with Structured IBAN and 2FA tokens.
                </p>
              </div>
              <span style={{
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                12-COL BLUEPRINT
              </span>
            </div>

            {/* Wireframe Mockup Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Block 1: Forgiving Amount & Currency */}
              <div
                style={{
                  border: showForgivingHighlights ? '1.5px solid #38bdf8' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showForgivingHighlights ? 'rgba(56, 189, 248, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="#38bdf8" /> Field 1: Transfer Remittance Amount &amp; Currency (Forgiving Parser)
                  </div>
                  {showForgivingHighlights && <span style={forgivingBadgeStyle}>FORGIVING FORMAT</span>}
                </div>
                
                <div style={{
                  backgroundColor: '#05070f',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span>$5,000 (or "5000 eur", "5k usd", "₹4,50,000", "5000.50")</span>
                  <span style={{ color: '#34d399', fontSize: '0.75rem' }}>✓ Standardized: USD 5,000.00 (ISO-4217)</span>
                </div>
                
                {showAnnotations && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                    <strong>Interaction Rule:</strong> Automatically strips currency symbols, thousands commas, shorthand multipliers ("5k"), normalizing to ISO-4217 standards (PayPal &amp; Tidwell pattern).
                  </div>
                )}
              </div>

              {/* Block 2: Forgiving Bank & SWIFT Resolver */}
              <div
                style={{
                  border: showForgivingHighlights ? '1.5px solid #38bdf8' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showForgivingHighlights ? 'rgba(56, 189, 248, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="#38bdf8" /> Field 2: Beneficiary Bank &amp; SWIFT/BIC Resolver
                  </div>
                  {showForgivingHighlights && <span style={forgivingBadgeStyle}>FORGIVING FORMAT</span>}
                </div>
                
                <div style={{
                  backgroundColor: '#05070f',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span>HDFC BKC Mumbai / DEUTDEFF / Deutsche Bank Frankfurt</span>
                  <span style={{ color: '#38bdf8', fontSize: '0.75rem' }}>Auto-resolved: SWIFT BIC DEUTDEFF500</span>
                </div>
                
                {showAnnotations && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                    <strong>Interaction Rule:</strong> Searches across human institution names, SWIFT BIC codes, and routing transit numbers without rigid field constraints.
                  </div>
                )}
              </div>

              {/* Block 3: Structured IBAN Number */}
              <div
                style={{
                  border: showStructuredHighlights ? '1.5px solid #a855f7' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showStructuredHighlights ? 'rgba(168, 85, 247, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} color="#c084fc" /> Field 3: Segmented International Bank Account Number (IBAN)
                  </div>
                  {showStructuredHighlights && <span style={structuredBadgeStyle}>STRUCTURED FORMAT</span>}
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {['[ DE89 ]', '[ 3704 ]', '[ 0044 ]', '[ 0532 ]', '[ 0130 ]', '[ 00 ]'].map((block, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        backgroundColor: '#05070f',
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                        borderRadius: '6px',
                        padding: '8px 4px',
                        textAlign: 'center',
                        color: '#c084fc',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.82rem',
                        fontWeight: '700'
                      }}
                    >
                      {block}
                    </div>
                  ))}
                </div>

                {showAnnotations && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                    <strong>Interaction Rule:</strong> 6 discrete 4-character segmented fields mirroring ISO-13616 standard. Auto-advances cursor focus on completion, preventing transposition errors.
                  </div>
                )}
              </div>

              {/* Block 4: Structured 2FA Security Token */}
              <div
                style={{
                  border: showStructuredHighlights ? '1.5px solid #a855f7' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showStructuredHighlights ? 'rgba(168, 85, 247, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={14} color="#c084fc" /> Field 4: Segmented 6-Digit Wire Release Token (2FA OTP)
                  </div>
                  {showStructuredHighlights && <span style={structuredBadgeStyle}>STRUCTURED FORMAT</span>}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', maxWidth: '300px', margin: '0 auto' }}>
                  {['[ 8 ]', '[ 4 ]', '[ 9 ]', '-', '[ 2 ]', '[ 0 ]', '[ 1 ]'].map((ch, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '34px',
                        height: '38px',
                        backgroundColor: '#05070f',
                        border: ch === '-' ? 'none' : '1px solid rgba(168, 85, 247, 0.4)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#c084fc',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.95rem',
                        fontWeight: '700'
                      }}
                    >
                      {ch}
                    </div>
                  ))}
                </div>

                {showAnnotations && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                    <strong>Interaction Rule:</strong> Discrete single-character segmented boxes for hardware/SMS tokens with automatic backspace retreat and auto-advance.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* WIREFRAME 2: AI Use Case — KJS-SRS-01 Autonomous Data Router              */}
        {/* ========================================================================= */}
        {(activeWireframe === 'both' || activeWireframe === 'ai') && (
          <div style={{
            backgroundColor: '#080b12',
            border: '2px solid rgba(52, 211, 153, 0.4)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
            backgroundImage: showGridOverlay
              ? 'linear-gradient(to right, rgba(52, 211, 153, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(52, 211, 153, 0.05) 1px, transparent 1px)'
              : 'none',
            backgroundSize: '24px 24px'
          }}>
            <div className="cad-corner-tl" />
            <div className="cad-corner-tr" />
            <div className="cad-corner-bl" />
            <div className="cad-corner-br" />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(52, 211, 153, 0.3)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  // WIREFRAME 02 &bull; AI USE CASE (KJS-SRS-01)
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                  KJS-SRS-01 Autonomous Onboard AI Router
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  AI satellite routing engine with Forgiving natural language directives and Structured power budgets.
                </p>
              </div>
              <span style={{
                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#34d399',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                12-COL BLUEPRINT
              </span>
            </div>

            {/* Wireframe Body Mockup Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Block 1: Forgiving AI Natural Language Directives */}
              <div
                style={{
                  border: showForgivingHighlights ? '1.5px solid #38bdf8' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showForgivingHighlights ? 'rgba(56, 189, 248, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} color="#38bdf8" /> Field 1: Natural Language AI Flight Policy Compiler
                  </div>
                  {showForgivingHighlights && <span style={forgivingBadgeStyle}>FORGIVING FORMAT</span>}
                </div>
                
                <div style={{
                  backgroundColor: '#05070f',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: '1.5'
                }}>
                  "safe mode below 25% battery and switch to SSTV when SNR &gt; 75 dB"
                  <div style={{ color: '#34d399', fontSize: '0.75rem', marginTop: '4px' }}>
                    ✓ Compiled Vector: [BAT_TH=25%, SNR_SSTV=75dB, BEACON=30s]
                  </div>
                </div>
                
                {showAnnotations && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                    <strong>Interaction Rule:</strong> Compiles informal natural language statements into deterministic threshold variables for the microcontroller.
                  </div>
                )}
              </div>

              {/* Block 2: Forgiving Hex Telecommand Stream */}
              <div
                style={{
                  border: showForgivingHighlights ? '1.5px solid #38bdf8' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showForgivingHighlights ? 'rgba(56, 189, 248, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Terminal size={14} color="#38bdf8" /> Field 2: Hex Telecommand Byte Stream Buffer
                  </div>
                  {showForgivingHighlights && <span style={forgivingBadgeStyle}>FORGIVING FORMAT</span>}
                </div>
                
                <div style={{
                  backgroundColor: '#05070f',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span>0xAA 0x55 0x01 0xFE (or "aa:55:01:fe")</span>
                  <span style={{ color: '#38bdf8', fontSize: '0.75rem' }}>Opcode: BEACON_SET | CRC-16: 0x3F8A</span>
                </div>
              </div>

              {/* Block 3: Structured Power Budget Matrix */}
              <div
                style={{
                  border: showStructuredHighlights ? '1.5px solid #a855f7' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showStructuredHighlights ? 'rgba(168, 85, 247, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#c084fc" /> Field 3: Sub-Watt Radio Power Matrix (100% Constrained)
                  </div>
                  {showStructuredHighlights && <span style={structuredBadgeStyle}>STRUCTURED FORMAT</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px', padding: '6px', color: '#34d399', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>TT&amp;C: [ 40 ] %</div>
                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px', padding: '6px', color: '#38bdf8', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>SSTV: [ 30 ] %</div>
                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px', padding: '6px', color: '#c084fc', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>M17: [ 20 ] %</div>
                  <div style={{ backgroundColor: '#05070f', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px', padding: '6px', color: '#f59e0b', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>Codec2: [ 10 ] %</div>
                </div>

                {showAnnotations && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                    <strong>Interaction Rule:</strong> 4 segmented percentage fields enforcing a strict 100% electrical invariant on the sub-1W power bus.
                  </div>
                )}
              </div>

              {/* Block 4: Structured Fault Bitmask */}
              <div
                style={{
                  border: showStructuredHighlights ? '1.5px solid #a855f7' : '1px dashed rgba(255, 255, 255, 0.15)',
                  backgroundColor: showStructuredHighlights ? 'rgba(168, 85, 247, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} color="#c084fc" /> Field 4: Segmented 16-Bit Hardware Fault Mask
                  </div>
                  {showStructuredHighlights && <span style={structuredBadgeStyle}>STRUCTURED FORMAT</span>}
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {['[ 0001 ]', '-', '[ 0000 ]', '-', '[ 1100 ]', '-', '[ 0010 ]'].map((b, i) => (
                    <div key={i} style={{ flex: b === '-' ? 0 : 1, color: '#c084fc', textAlign: 'center', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>{b}</div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Rationale Bottom Section */}
      <div style={{
        backgroundColor: '#080b12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '1.5rem 2rem',
        color: '#94a3b8',
        fontSize: '0.85rem',
        lineHeight: '1.6'
      }}>
        <div style={{ fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} color="#38bdf8" /> Form Design Patterns: Interaction Design Principles &amp; Literature Rationale
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '0.75rem' }}>
          <div>
            <strong style={{ color: '#38bdf8' }}>1. Forgiving Format (Tidwell &amp; Scott/Neil):</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
              Allows operators/users to enter data with natural flexibility (amounts with currency symbols, natural language schedules, fuzzy institution names). The system standardizes syntax behind the scenes without throwing rigid validation errors.
            </p>
          </div>
          <div>
            <strong style={{ color: '#c084fc' }}>2. Structured Format (Tidwell &amp; Galitz):</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
              Deconstructs rigid data types (IBAN, cryptographic tokens, multi-channel power budgets) into discrete segmented inputs with auto-advancing focus. This eliminates character displacement and enforces system invariants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
