import React from 'react';
import { motion } from 'framer-motion';

// Shared popup: a dark backdrop with a centred panel. Used by the pass detail and AI rules overlays.
// `children` is whatever the parent puts between <Overlay> and </Overlay>.
export default function Overlay({ onClose, maxWidth = 560, children }) {
  return (
    // Clicking the backdrop closes the popup; clicks inside the panel are stopped from reaching it.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#0b101d', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', padding: '1.75rem' }}
      >
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: '12px', right: '14px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
        {children}
      </motion.div>
    </motion.div>
  );
}
