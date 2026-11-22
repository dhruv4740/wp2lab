import React, { useEffect, useRef, useState } from 'react';

/**
 * StarfieldCanvas with optional Constellation Builder Easter Egg.
 * When interactive={true}, clicking stars connects them into constellations.
 */
export default function StarfieldCanvas({ count = 200, speed = 0.3, className = '', interactive = false }) {
  const canvasRef = useRef(null);
  const [constellations, setConstellations] = useState([]);
  const [activeConstellation, setActiveConstellation] = useState([]);
  const [namingPrompt, setNamingPrompt] = useState(null); // { x, y, name }
  const [hintDismissed, setHintDismissed] = useState(false);

  // References for render loop access
  const constellationsRef = useRef([]);
  const activeConstellationRef = useRef([]);
  const starsRef = useRef([]);

  useEffect(() => {
    constellationsRef.current = constellations;
  }, [constellations]);

  useEffect(() => {
    activeConstellationRef.current = activeConstellation;
  }, [activeConstellation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      alpha: 0.5,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.85 ? '#00e5ff' : Math.random() > 0.95 ? '#f59e0b' : '#ffffff',
      // Screen space computed coordinates each frame
      currentSx: 0,
      currentSy: 0,
    }));
    starsRef.current = stars;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const offsetX = (mouseX - width / 2) * 0.03;
      const offsetY = (mouseY - height / 2) * 0.03;

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.phase += star.twinkleSpeed;
        star.alpha = star.baseAlpha + Math.sin(star.phase) * 0.25;

        star.y -= speed * star.depth;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const sx = star.x + offsetX * star.depth;
        const sy = star.y + offsetY * star.depth;
        star.currentSx = sx;
        star.currentSy = sy;

        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.fill();

        if (star.size > 1.4) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.15;
          ctx.fill();
        }
      }

      // If interactive: Render Constellations & Connections
      if (interactive) {
        // 1. Draw Saved Constellations
        const savedList = constellationsRef.current;
        for (let c = 0; c < savedList.length; c++) {
          const item = savedList[c];
          if (item.stars.length >= 2) {
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
            ctx.lineWidth = 1;

            let sumX = 0;
            let sumY = 0;

            for (let s = 0; s < item.stars.length; s++) {
              const starObj = stars[item.stars[s]];
              if (!starObj) continue;
              sumX += starObj.currentSx;
              sumY += starObj.currentSy;

              if (s === 0) {
                ctx.moveTo(starObj.currentSx, starObj.currentSy);
              } else {
                ctx.lineTo(starObj.currentSx, starObj.currentSy);
              }

              // Pulse ring around member stars
              ctx.save();
              ctx.setLineDash([]);
              ctx.strokeStyle = '#00e5ff';
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.arc(starObj.currentSx, starObj.currentSy, starObj.size + 3, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Constellation Name Label at centroid
            const avgX = sumX / item.stars.length;
            const avgY = sumY / item.stars.length;
            ctx.font = '600 10px monospace';
            ctx.fillStyle = '#00e5ff';
            ctx.globalAlpha = 0.75;
            ctx.textAlign = 'center';
            ctx.fillText(item.name.toUpperCase(), avgX, avgY - 8);
          }
        }

        // 2. Draw Active Constellation In-Progress
        const activeList = activeConstellationRef.current;
        if (activeList.length > 0) {
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.75)';
          ctx.lineWidth = 1.5;

          for (let s = 0; s < activeList.length; s++) {
            const starObj = stars[activeList[s]];
            if (!starObj) continue;

            if (s === 0) {
              ctx.moveTo(starObj.currentSx, starObj.currentSy);
            } else {
              ctx.lineTo(starObj.currentSx, starObj.currentSy);
            }

            // Glowing indicator around selected stars
            ctx.save();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#00e5ff';
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            ctx.arc(starObj.currentSx, starObj.currentSy, starObj.size + 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [count, speed, interactive]);

  // Handle canvas click to connect stars
  const handleCanvasClick = (e) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const stars = starsRef.current;
    let closestIndex = -1;
    let minDistance = 25; // 25px radius

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const dist = Math.hypot(clickX - star.currentSx, clickY - star.currentSy);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    if (closestIndex !== -1) {
      setHintDismissed(true);
      setActiveConstellation((prev) => {
        // Prevent duplicate immediate selection
        if (prev[prev.length - 1] === closestIndex) return prev;
        const next = [...prev, closestIndex];

        // If 3+ stars connected, position naming prompt near latest star
        if (next.length >= 3 && !namingPrompt) {
          const star = stars[closestIndex];
          setNamingPrompt({
            x: Math.min(window.innerWidth - 220, Math.max(20, star.currentSx)),
            y: Math.min(window.innerHeight - 100, Math.max(20, star.currentSy + 15)),
            name: '',
          });
        }
        return next;
      });
    }
  };

  // Double click: prompt naming immediately if >= 3 stars
  const handleCanvasDoubleClick = () => {
    if (!interactive || activeConstellation.length < 3) return;
    const stars = starsRef.current;
    const lastStarIndex = activeConstellation[activeConstellation.length - 1];
    const star = stars[lastStarIndex];
    if (star) {
      setNamingPrompt({
        x: Math.min(window.innerWidth - 220, Math.max(20, star.currentSx)),
        y: Math.min(window.innerHeight - 100, Math.max(20, star.currentSy + 15)),
        name: '',
      });
    }
  };

  // Right-click or Esc: cancel draft
  useEffect(() => {
    if (!interactive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveConstellation([]);
        setNamingPrompt(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interactive]);

  const saveConstellation = (e) => {
    e.preventDefault();
    if (!namingPrompt || !namingPrompt.name.trim()) return;

    if (constellations.length >= 5) {
      // Keep max 5 constellations
      setConstellations((prev) => [...prev.slice(1), { name: namingPrompt.name.trim(), stars: activeConstellation }]);
    } else {
      setConstellations((prev) => [...prev, { name: namingPrompt.name.trim(), stars: activeConstellation }]);
    }

    setActiveConstellation([]);
    setNamingPrompt(null);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
        onContextMenu={(e) => {
          if (interactive && activeConstellation.length > 0) {
            e.preventDefault();
            setActiveConstellation([]);
            setNamingPrompt(null);
          }
        }}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: interactive ? 'auto' : 'none',
          cursor: interactive ? 'crosshair' : 'default',
        }}
      />

      {/* Subtle Hint Badge for Constellation Builder (Hero only) */}
      {interactive && !hintDismissed && activeConstellation.length === 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'rgba(0, 229, 255, 0.45)',
            letterSpacing: '0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 5,
          }}
        >
          ✦ Click stars to map constellations &bull; Esc to reset
        </div>
      )}

      {/* Inline Naming Dialog Prompt */}
      {namingPrompt && (
        <form
          onSubmit={saveConstellation}
          style={{
            position: 'absolute',
            left: `${namingPrompt.x}px`,
            top: `${namingPrompt.y}px`,
            zIndex: 100,
            backgroundColor: 'rgba(10, 14, 24, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.5)',
            borderRadius: '6px',
            padding: '0.6rem 0.8rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 229, 255, 0.2)',
            display: 'flex',
            gap: '0.4rem',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            autoFocus
            placeholder="Constellation name..."
            value={namingPrompt.name}
            onChange={(e) => setNamingPrompt({ ...namingPrompt, name: e.target.value })}
            style={{
              background: '#04060a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#f0f2f5',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.35rem 0.5rem',
              outline: 'none',
              width: '140px',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#00e5ff',
              color: '#04060a',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveConstellation([]);
              setNamingPrompt(null);
            }}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              fontSize: '0.72rem',
              cursor: 'pointer',
              padding: '0.35rem 0.4rem',
            }}
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
}
