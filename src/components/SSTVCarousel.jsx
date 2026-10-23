import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

const SSTV_IMAGES = [
  { id: 'SSTV-0042', passId: 'PSS-0146', timestamp: '12:08:34 UTC', mode: 'Robot 36', resolution: '320×240', src: '/sstv/sstv_earth_limb.jpg', gradient: 'linear-gradient(135deg, #0c1929 0%, #1a3a5c 25%, #0f2847 50%, #1e4d6e 75%, #0a1e33 100%)', overlay: 'Earth limb captured at 550km altitude — Indian subcontinent partial view', quality: '94%' },
  { id: 'SSTV-0041', passId: 'PSS-0142', timestamp: '03:01:12 UTC', mode: 'Scottie S1', resolution: '320×256', src: '/sstv/sstv_cloud_cover.jpg', gradient: 'linear-gradient(160deg, #0a1628 0%, #162d4a 30%, #1f4068 50%, #0d2240 70%, #071525 100%)', overlay: 'Nightside pass over Pacific — cloud cover analysis', quality: '98%' },
  { id: 'SSTV-0039', passId: 'PSS-0138', timestamp: '18:44:56 UTC', mode: 'Robot 36', resolution: '320×240', src: '/sstv/sstv_desert_pass.jpg', gradient: 'linear-gradient(145deg, #1a0a00 0%, #3d1f0a 25%, #2a1505 40%, #5c3018 60%, #1a0f05 100%)', overlay: 'Saharan desert pass — thermal calibration frame', quality: '87%' },
  { id: 'SSTV-0037', passId: 'PSS-0134', timestamp: '08:22:03 UTC', mode: 'Scottie S2', resolution: '320×256', src: '/sstv/sstv_earth_limb.jpg', gradient: 'linear-gradient(130deg, #0a1a2e 0%, #153050 30%, #1e4470 55%, #0e2540 80%, #081830 100%)', overlay: 'Mediterranean coastline — antenna pattern test', quality: '91%' },
  { id: 'SSTV-0035', passId: 'PSS-0130', timestamp: '22:15:49 UTC', mode: 'Robot 36', resolution: '320×240', src: '/sstv/sstv_cloud_cover.jpg', gradient: 'linear-gradient(155deg, #080d18 0%, #121f35 20%, #0b1728 45%, #182e4a 70%, #060c15 100%)', overlay: 'Terminator crossing — day/night boundary imaging', quality: '76%' },
];

const mono = { fontFamily: 'JetBrains Mono, monospace' };
const arrow = (side) => ({ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [side]: '10px', width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0, 0, 0, 0.55)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' });

export default function SSTVCarousel() {
  // useState: index of the image currently shown
  const [current, setCurrent] = useState(0);
  const img = SSTV_IMAGES[current];

  return (
    <div style={{ backgroundColor: '#0b101d', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image size={16} color="#4a7c9b" />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#f8fafc' }}>SSTV Image Gallery</div>
            <div style={{ ...mono, fontSize: '0.68rem', color: '#64748b' }}>VIRTUAL PAGE — INLINE PAGING CAROUSEL</div>
          </div>
        </div>
        <div style={{ ...mono, fontSize: '0.72rem', color: '#94a3b8' }}>{current + 1} / {SSTV_IMAGES.length}</div>
      </div>

      <div>
        <div style={{ position: 'relative', height: '260px', background: img.gradient, overflow: 'hidden' }}>
          {/* If the photo file is missing, hide it and the gradient behind shows instead */}
          <img
            src={img.src}
            alt={img.overlay}
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          {/* Scanlines for the SSTV look */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)' }} />

          <div style={{ ...mono, position: 'absolute', top: '12px', left: '14px', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.1em' }}>
            {img.id} • {img.mode} • {img.resolution}
          </div>
          <div style={{ ...mono, position: 'absolute', bottom: '12px', right: '14px', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'rgba(255, 255, 255, 0.6)' }}>
            QUALITY: {img.quality}
          </div>

          {/* Previous / next arrows are hidden at the first and last image */}
          {current > 0 && (
            <button style={arrow('left')} onClick={() => setCurrent(current - 1)}><ChevronLeft size={20} /></button>
          )}
          {current < SSTV_IMAGES.length - 1 && (
            <button style={arrow('right')} onClick={() => setCurrent(current + 1)}><ChevronRight size={20} /></button>
          )}
        </div>

        <div style={{ padding: '12px 16px', backgroundColor: '#05070f', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ ...mono, fontSize: '0.78rem', fontWeight: '600', color: '#38bdf8' }}>Pass {img.passId}</span>
            <span style={{ ...mono, fontSize: '0.72rem', color: '#64748b' }}>{img.timestamp}</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>{img.overlay}</div>
        </div>

        <div style={{ backgroundColor: '#05070f', padding: '8px 0 14px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {SSTV_IMAGES.map((image, i) => (
            <button
              key={image.id}
              onClick={() => setCurrent(i)}
              style={{ width: '9px', height: '9px', padding: 0, borderRadius: '50%', border: 'none', cursor: 'pointer', backgroundColor: i === current ? '#38bdf8' : '#334155' }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
