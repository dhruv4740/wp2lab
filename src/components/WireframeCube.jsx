import React from 'react';

export default function WireframeCube() {
  return (
    <svg viewBox="0 0 200 200" fill="none" style={{ width: '100%', height: '100%' }}>
      {/* 50x50x50mm 1PQ Isometric Cube Wireframe */}
      <polygon points="100,20 170,60 100,100 30,60" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="30,60 100,100 100,180 30,140" stroke="#00e5ff" strokeWidth="1.5" />
      <polygon points="170,60 100,100 100,180 170,140" stroke="#00e5ff" strokeWidth="1.5" />
      {/* Deployable Dipole Antenna */}
      <line x1="100" y1="20" x2="100" y2="4" stroke="#00e5ff" strokeWidth="2" />
      <circle cx="100" cy="4" r="3" fill="#00e5ff" />
      {/* Solar cell circuit traces */}
      <line x1="45" y1="80" x2="85" y2="103" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
      <line x1="45" y1="110" x2="85" y2="133" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
      <line x1="115" y1="103" x2="155" y2="80" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
      <line x1="115" y1="133" x2="155" y2="110" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
