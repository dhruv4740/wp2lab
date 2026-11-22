import React, { useEffect, useRef } from 'react';

/**
 * ZeroGTrail Easter Egg:
 * Tiny cosmic particles spawn along cursor motion and drift away in zero-gravity physics.
 */
export default function ZeroGTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let lastMouseX = null;
    let lastMouseY = null;
    let frameCounter = 0;
    const maxParticles = 40;
    const particles = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      frameCounter++;
      // Spawn 1 particle per 3 frames of mouse motion
      if (frameCounter % 3 !== 0) return;

      const currentX = e.clientX;
      const currentY = e.clientY;

      if (lastMouseX !== null && lastMouseY !== null) {
        const deltaX = currentX - lastMouseX;
        const deltaY = currentY - lastMouseY;

        if (particles.length < maxParticles) {
          // Color distribution: 70% white, 20% cyan, 10% amber
          const roll = Math.random();
          const color = roll < 0.7 ? '#ffffff' : roll < 0.9 ? '#00e5ff' : '#f59e0b';
          const size = Math.random() * 2 + 1; // 1-3px
          const duration = (Math.random() * 2 + 2) * 1000; // 2-4 seconds

          particles.push({
            x: currentX,
            y: currentY,
            vx: deltaX * 0.08 + (Math.random() - 0.5) * 0.6,
            vy: deltaY * 0.08 + (Math.random() - 0.5) * 0.6,
            size,
            color,
            createdAt: performance.now(),
            duration,
            angularDrift: (Math.random() - 0.5) * 0.02,
          });
        }
      }

      lastMouseX = currentX;
      lastMouseY = currentY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = (now) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.createdAt;

        if (age >= p.duration) {
          particles.splice(i, 1);
          continue;
        }

        // Apply Zero-G drift + slight drag (0.995) + subtle angular drift
        p.vx *= 0.995;
        p.vy *= 0.995;
        const speed = Math.hypot(p.vx, p.vy);
        const currentAngle = Math.atan2(p.vy, p.vx) + p.angularDrift;
        p.vx = Math.cos(currentAngle) * speed;
        p.vy = Math.sin(currentAngle) * speed;

        p.x += p.vx;
        p.y += p.vy;

        // Opacity: starts at 0.6, fades out over last 30% of life
        const lifeFraction = age / p.duration;
        let opacity = 0.6;
        if (lifeFraction > 0.7) {
          opacity = 0.6 * (1 - (lifeFraction - 0.7) / 0.3);
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, opacity);
        ctx.shadowBlur = p.color === '#ffffff' ? 2 : 5;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
