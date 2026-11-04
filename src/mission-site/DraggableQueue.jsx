import React, { useState } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { GripVertical, ChevronDown, ChevronUp, Lock, Cpu } from 'lucide-react';

const mono = { fontFamily: 'JetBrains Mono, monospace' };
const handle = { display: 'flex', color: '#64748b' };

// Sample AI decision log shown when a queue row is expanded (one per row).
const DECISION_LOGS = [
  { timestamp: '14:28:03 UTC', sensors: 'BAT: 82% | SNR: 76 dB | TEMP: 24°C', reasoning: 'All system parameters nominal. TT&C beacon transmitted as scheduled. Housekeeping telemetry packet #0147 queued successfully.' },
  { timestamp: '14:28:04 UTC', sensors: 'BAT: 81% | SNR: 74 dB | TEMP: 24°C', reasoning: 'SNR above SSTV threshold (75 dB). Battery sufficient for high-bandwidth mode. SSTV image packet queued after TT&C.' },
  { timestamp: '14:28:05 UTC', sensors: 'BAT: 81% | SNR: 72 dB | TEMP: 25°C', reasoning: 'M17 voice buffer at 68% capacity. Codec2 fallback available if SNR drops below voice threshold. Queued at priority 3.' },
  { timestamp: '14:28:06 UTC', sensors: 'BAT: 80% | SNR: 71 dB | TEMP: 25°C', reasoning: 'SSTV image encode complete. Transmission deferred — waiting for next optimal pass window. Battery drain rate: 0.3%/min.' },
];

export default function DraggableQueue({ aiDecisions }) {
  // useState: the display order (list of original indexes) and which row is expanded
  const [queueOrder, setQueueOrder] = useState(aiDecisions.map((_, i) => i));
  const [expanded, setExpanded] = useState(null);

  // The first row (TT&C) is pinned: whatever the user drags, it is put back on top.
  const handleReorder = (newOrder) => {
    const pinned = queueOrder[0];
    setQueueOrder([pinned, ...newOrder.filter((i) => i !== pinned)]);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
        <Cpu size={18} color="#34d399" />
        <div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>AI Data Routing Queue</div>
          <div style={{ ...mono, fontSize: '0.68rem', color: '#64748b' }}>DRAG TO REORDER • EXPAND FOR AI DECISION LOG</div>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={queueOrder}
        onReorder={handleReorder}
        style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        {queueOrder.map((index, position) => {
          const item = aiDecisions[index];
          const log = DECISION_LOGS[index];
          const isPinned = position === 0;
          const isOpen = expanded === index;
          const transmitting = item.status.includes('TRANSMITTING');

          return (
            <Reorder.Item
              key={index}
              value={index}
              dragListener={!isPinned}
              style={{
                listStyle: 'none',
                backgroundColor: '#05070f',
                border: isPinned ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: isPinned ? 'default' : 'grab',
              }}
              whileDrag={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)', zIndex: 50 }}
            >
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isPinned ? (
                  <div style={{ ...handle, color: '#34d399' }} title="TT&C is pinned — cannot be reordered"><Lock size={14} /></div>
                ) : (
                  <div style={handle} title="Drag to reorder"><GripVertical size={14} /></div>
                )}

                <div style={{ ...mono, width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: '700', borderRadius: '6px', flexShrink: 0, backgroundColor: isPinned ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.06)', color: isPinned ? '#34d399' : '#8b9daf' }}>
                  Q{position + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#f8fafc' }}>{item.mode}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' }}>{item.reason}</div>
                </div>

                <span style={{ ...mono, fontSize: '0.68rem', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0, backgroundColor: transmitting ? 'rgba(52, 211, 153, 0.15)' : 'rgba(148, 163, 184, 0.15)', color: transmitting ? '#34d399' : '#94a3b8', border: transmitting ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(148, 163, 184, 0.2)' }}>
                  {item.status}
                </span>

                <button style={{ ...handle, background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setExpanded(isOpen ? null : index)} title={isOpen ? 'Collapse decision log' : 'Expand decision log'}>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* AnimatePresence lets the log animate out when it is collapsed */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div style={{ padding: '0 14px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ backgroundColor: 'rgba(74, 124, 155, 0.08)', borderRadius: '8px', padding: '12px', marginTop: '10px', borderLeft: '3px solid #4a7c9b' }}>
                        <div style={{ ...mono, fontSize: '0.68rem', color: '#4a7c9b', letterSpacing: '0.1em', marginBottom: '6px' }}>AI DECISION LOG — {log.timestamp}</div>
                        <div style={{ ...mono, fontSize: '0.75rem', color: '#8b9daf', marginBottom: '6px' }}>SENSORS: {log.sensors}</div>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>{log.reasoning}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div style={{ ...mono, textAlign: 'center', fontSize: '0.68rem', color: '#475569', marginTop: '10px', letterSpacing: '0.1em' }}>
        🔒 TT&C PINNED TO TOP • ⠿ DRAG OTHERS TO RE-PRIORITIZE
      </div>
    </div>
  );
}
