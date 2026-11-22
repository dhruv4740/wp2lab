import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, X, Radio, Globe, Navigation, Edit3 } from 'lucide-react';

export default function SatelliteConfigCard({ onConfigChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState({
    downlinkFreq: '437.000',
    callsignPrefix: 'VU2',
    orbitAltitude: '550'
  });
  const [editValues, setEditValues] = useState({ ...config });

  const startEditing = () => {
    setEditValues({ ...config });
    setIsEditing(true);
  };

  const saveConfig = () => {
    setConfig({ ...editValues });
    setIsEditing(false);
    if (onConfigChange) onConfigChange(editValues);
  };

  const cancelEditing = () => {
    setEditValues({ ...config });
    setIsEditing(false);
  };

  const fields = [
    {
      key: 'downlinkFreq',
      label: 'Downlink Frequency',
      unit: 'MHz',
      icon: Radio,
      color: '#38bdf8',
      placeholder: 'e.g. 437.000'
    },
    {
      key: 'callsignPrefix',
      label: 'Callsign Prefix',
      unit: '',
      icon: Globe,
      color: '#34d399',
      placeholder: 'e.g. VU2'
    },
    {
      key: 'orbitAltitude',
      label: 'Orbit Altitude',
      unit: 'km',
      icon: Navigation,
      color: '#a78bfa',
      placeholder: 'e.g. 550'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#080b12',
      border: isEditing ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      boxShadow: isEditing ? '0 0 30px rgba(74, 124, 155, 0.1)' : 'none'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(74, 124, 155, 0.15)',
            border: '1px solid rgba(74, 124, 155, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4a7c9b'
          }}>
            <Settings size={18} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#f8fafc' }}>
              Spacecraft Configuration
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
              {isEditing ? 'MULTI-FIELD INLINE EDIT MODE' : 'CLICK EDIT TO MODIFY'}
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={startEditing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(74, 124, 155, 0.3)',
              backgroundColor: 'rgba(74, 124, 155, 0.1)',
              color: '#4a7c9b',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Edit3 size={14} /> Edit Configuration
          </button>
        )}
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence mode="wait">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <motion.div
                key={field.key + (isEditing ? '-edit' : '-view')}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: isEditing ? '#05070f' : 'rgba(255, 255, 255, 0.02)',
                  border: isEditing ? '1px solid rgba(74, 124, 155, 0.25)' : '1px solid transparent'
                }}
              >
                <Icon size={16} color={field.color} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.05em',
                    marginBottom: '2px'
                  }}>
                    {field.label}
                  </div>

                  {isEditing ? (
                    <input
                      className="inline-edit-input"
                      value={editValues[field.key]}
                      onChange={(e) => setEditValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{ fontSize: '0.92rem', padding: '5px 8px' }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#f8fafc'
                    }}>
                      {config[field.key]} {field.unit && (
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '400' }}>{field.unit}</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={cancelEditing}
            className="cancel-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <X size={14} /> Cancel
          </button>
          <button
            onClick={saveConfig}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4a7c9b',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(74, 124, 155, 0.3)'
            }}
          >
            <Save size={14} /> Save Configuration
          </button>
        </motion.div>
      )}
    </div>
  );
}
