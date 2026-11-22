import React, { useState } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { GripVertical, ChevronDown, ChevronUp, Lock, Cpu } from 'lucide-react';

export default function DraggableQueue({ aiDecisions = [
    { mode: 'TT&C / Housekeeping', status: 'CRITICAL', reason: 'Spacecraft health housekeeping beacon' },
    { mode: 'M17 Digital Voice', status: 'TRANSMITTING', reason: 'Real-time 4FSK digital voice stream' },
    { mode: 'Robot36 SSTV', status: 'QUEUED', reason: 'Earth observation snapshot image modulation' },
    { mode: 'Codec2 Voice', status: 'STANDBY', reason: 'Low-bitrate compressed voice queue' }
  ] }) {
  const safeDecisions = aiDecisions || [];
  const [queueOrder, setQueueOrder] = useState(safeDecisions.map((_, i) => i));
  const [expandedItem, setExpandedItem] = useState(null);

  // Keep TT&C (index 0 in aiDecisions) always pinned to top
  const handleReorder = (newOrder) => {
    // Find which value was originally at position 0 in current state
    const firstItemOriginal = queueOrder[0];
    // If the pinned item got moved, force it back to top
    const pinnedIdx = newOrder.indexOf(firstItemOriginal);
    if (pinnedIdx > 0) {
      // Snap TT&C back to the top
      const filtered = newOrder.filter(v => v !== firstItemOriginal);
      setQueueOrder([firstItemOriginal, ...filtered]);
    } else {
      setQueueOrder(newOrder);
    }
  };

  // Re-sync when aiDecisions change
  React.useEffect(() => {
    setQueueOrder((aiDecisions || []).map((_, i) => i));
  }, [(aiDecisions || []).length]);

  const toggleExpand = (idx) => {
    setExpandedItem(expandedItem === idx ? null : idx);
  };

  const DECISION_LOGS = [
    {
      timestamp: '14:28:03 UTC',
      sensors: 'BAT: 82% | SNR: 76 dB | TEMP: 24°C',
      reasoning: 'All system parameters nominal. TT&C beacon transmitted as scheduled. Housekeeping telemetry packet #0147 queued successfully.',
    },
    {
      timestamp: '14:28:04 UTC',
      sensors: 'BAT: 81% | SNR: 74 dB | TEMP: 24°C',
      reasoning: 'SNR above SSTV threshold (75 dB). Battery sufficient for high-bandwidth mode. SSTV image packet queued after TT&C.',
    },
    {
      timestamp: '14:28:05 UTC',
      sensors: 'BAT: 81% | SNR: 72 dB | TEMP: 25°C',
      reasoning: 'M17 voice buffer at 68% capacity. Codec2 fallback available if SNR drops below voice threshold. Queued at priority 3.',
    },
    {
      timestamp: '14:28:06 UTC',
      sensors: 'BAT: 80% | SNR: 71 dB | TEMP: 25°C',
      reasoning: 'SSTV image encode complete. Transmission deferred — waiting for next optimal pass window. Battery drain rate: 0.3%/min.',
    },
  ];

  return (
    <div style={{
      backgroundColor: '#0b101d',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      borderRadius: '14px',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="#34d399" />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
              AI Data Routing Queue
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
              DRAG TO REORDER • EXPAND FOR AI DECISION LOG
            </div>
          </div>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={queueOrder}
        onReorder={handleReorder}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {queueOrder.map((originalIdx, visualIdx) => {
          const item = aiDecisions[originalIdx];
          if (!item) return null;
          const isPinned = visualIdx === 0;
          const isExpanded = expandedItem === originalIdx;
          const log = DECISION_LOGS[originalIdx] || DECISION_LOGS[0];

          return (
            <Reorder.Item
              key={originalIdx}
              value={originalIdx}
              dragListener={!isPinned}
              style={{
                listStyle: 'none',
                backgroundColor: '#05070f',
                border: isPinned
                  ? '1px solid rgba(52, 211, 153, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: isPinned ? 'default' : 'grab'
              }}
              whileDrag={{
                scale: 1.02,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(74, 124, 155, 0.5)',
                zIndex: 50
              }}
            >
              {/* Main Row */}
              <div style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {/* Drag Handle or Lock */}
                {isPinned ? (
                  <div className="drag-handle pinned" title="TT&C is pinned — cannot be reordered">
                    <Lock size={14} />
                  </div>
                ) : (
                  <div className="drag-handle" title="Drag to reorder">
                    <GripVertical size={14} />
                  </div>
                )}

                {/* Queue Position */}
                <div style={{
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  borderRadius: '6px',
                  backgroundColor: visualIdx === 0 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.06)',
                  color: visualIdx === 0 ? '#34d399' : '#8b9daf',
                  flexShrink: 0
                }}>
                  Q{visualIdx + 1}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#f8fafc' }}>
                    {item.mode}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' }}>
                    {item.reason}
                  </div>
                </div>

                {/* Status Badge */}
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontFamily: 'JetBrains Mono, monospace',
                  backgroundColor: item.status.includes('TRANSMITTING')
                    ? 'rgba(52, 211, 153, 0.15)'
                    : 'rgba(148, 163, 184, 0.15)',
                  color: item.status.includes('TRANSMITTING') ? '#34d399' : '#94a3b8',
                  border: item.status.includes('TRANSMITTING')
                    ? '1px solid rgba(52, 211, 153, 0.3)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {item.status}
                </span>

                {/* Inlay Toggle */}
                <button
                  className="inlay-toggle"
                  onClick={() => toggleExpand(originalIdx)}
                  title={isExpanded ? 'Collapse decision log' : 'Expand decision log'}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* List Inlay — Decision Log */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="inlay-content"
                  >
                    <div style={{
                      padding: '0 14px 14px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      marginTop: '0'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(74, 124, 155, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '10px',
                        borderLeft: '3px solid #4a7c9b'
                      }}>
                        <div style={{
                          fontSize: '0.68rem',
                          color: '#4a7c9b',
                          fontFamily: 'JetBrains Mono, monospace',
                          letterSpacing: '0.1em',
                          marginBottom: '6px'
                        }}>
                          AI DECISION LOG — {log.timestamp}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          color: '#8b9daf',
                          marginBottom: '6px'
                        }}>
                          SENSORS: {log.sensors}
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#cbd5e1',
                          lineHeight: 1.5
                        }}>
                          {log.reasoning}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div style={{
        textAlign: 'center',
        fontSize: '0.68rem',
        color: '#475569',
        fontFamily: 'JetBrains Mono, monospace',
        marginTop: '10px',
        letterSpacing: '0.1em'
      }}>
        🔒 TT&C PINNED TO TOP • ⠿ DRAG OTHERS TO RE-PRIORITIZE
      </div>
    </div>
  );
}
