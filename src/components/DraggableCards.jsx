import React from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, Radio, Battery, Signal } from 'lucide-react';

export default function DraggableCards({ batteryLevel, linkQuality, cardOrder, onReorder }) {
  // The cards by id. The battery and link cards read their value from props.
  const cards = {
    orbit: { label: 'Spacecraft Orbit', value: '550 km LEO', valueColor: '#f8fafc', detail: 'SomaiyaPod Deployment Verified', detailColor: '#34d399', icon: Radio, iconColor: '#38bdf8' },
    battery: { label: 'Battery Power', value: `${batteryLevel}%`, valueColor: batteryLevel > 30 ? '#34d399' : '#f87171', detail: 'Sub-watt Average (< 1W)', detailColor: '#94a3b8', icon: Battery, iconColor: '#34d399' },
    'rf-link': { label: 'RF Link Quality', value: `${linkQuality} RSSI`, valueColor: '#38bdf8', detail: 'Amateur HAM 437 MHz Link', detailColor: '#94a3b8', icon: Signal, iconColor: '#38bdf8' },
  };

  return (
    <div>
      {/* framer-motion Reorder: dragging a card calls onReorder with the new id order */}
      <Reorder.Group
        axis="x"
        values={cardOrder}
        onReorder={onReorder}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', listStyle: 'none', padding: 0, margin: 0 }}
      >
        {cardOrder.map((id) => {
          const card = cards[id];
          const Icon = card.icon;
          return (
            <Reorder.Item
              key={id}
              value={id}
              style={{ backgroundColor: '#0b101d', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', cursor: 'grab', listStyle: 'none', userSelect: 'none' }}
              whileDrag={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)', zIndex: 50 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={16} color={card.iconColor} />
                  <div style={{ display: 'flex', color: '#64748b' }} title="Drag to reorder"><GripVertical size={14} /></div>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: card.valueColor }}>{card.value}</div>
              <div style={{ fontSize: '0.78rem', color: card.detailColor, marginTop: '4px' }}>{card.detail}</div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px', letterSpacing: '0.1em' }}>
        ⠿ DRAG CARDS TO REORDER BY MISSION PRIORITY
      </div>
    </div>
  );
}
