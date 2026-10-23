import React from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, Radio, Battery, Signal } from 'lucide-react';

const INITIAL_CARDS = [
  {
    id: 'orbit',
    label: 'Spacecraft Orbit',
    value: '550 km LEO',
    detail: 'SomaiyaPod Deployment Verified',
    icon: Radio,
    iconColor: '#38bdf8',
    valueColor: '#f8fafc',
    detailColor: '#34d399'
  },
  {
    id: 'battery',
    label: 'Battery Power',
    value: null, // Dynamic — uses batteryLevel prop
    detail: 'Sub-watt Average (< 1W)',
    icon: Battery,
    iconColor: '#34d399',
    valueColor: null, // Dynamic
    detailColor: '#94a3b8'
  },
  {
    id: 'rf-link',
    label: 'RF Link Quality',
    value: null, // Dynamic — uses linkQuality prop
    detail: 'Amateur HAM 437 MHz Link',
    icon: Signal,
    iconColor: '#38bdf8',
    valueColor: '#38bdf8',
    detailColor: '#94a3b8'
  }
];

export default function DraggableCards({ batteryLevel, linkQuality, cardOrder, onReorder }) {
  const getCardValue = (card) => {
    if (card.id === 'battery') return `${batteryLevel}%`;
    if (card.id === 'rf-link') return `${linkQuality} RSSI`;
    return card.value;
  };

  const getValueColor = (card) => {
    if (card.id === 'battery') return batteryLevel > 30 ? '#34d399' : '#f87171';
    return card.valueColor || '#f8fafc';
  };

  return (
    <div>
      <Reorder.Group
        axis="x"
        values={cardOrder}
        onReorder={onReorder}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}
      >
        {cardOrder.map((cardId) => {
          const card = INITIAL_CARDS.find(c => c.id === cardId);
          if (!card) return null;
          const Icon = card.icon;

          return (
            <Reorder.Item
              key={cardId}
              value={cardId}
              style={{
                backgroundColor: '#0b101d',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'grab',
                listStyle: 'none',
                userSelect: 'none'
              }}
              whileDrag={{
                scale: 1.04,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
                borderColor: 'rgba(74, 124, 155, 0.5)',
                zIndex: 50
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {card.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={16} color={card.iconColor} />
                  <div className="drag-handle" title="Drag to reorder">
                    <GripVertical size={14} />
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: getValueColor(card)
              }}>
                {getCardValue(card)}
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: card.detailColor,
                marginTop: '4px'
              }}>
                {card.detail}
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div style={{
        textAlign: 'center',
        fontSize: '0.68rem',
        color: '#475569',
        fontFamily: 'JetBrains Mono, monospace',
        marginTop: '8px',
        letterSpacing: '0.1em'
      }}>
        ⠿ DRAG CARDS TO REORDER BY MISSION PRIORITY
      </div>
    </div>
  );
}
