import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MagneticButton({
  children,
  to,
  onClick,
  variant = 'primary',
  className = '',
  style = {},
  strength = 0.35,
  ...props
}) {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.65rem',
    padding: '0.85rem 1.85rem',
    borderRadius: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    outline: 'none',
    letterSpacing: '0.04em',
    transform: 'translate3d(' + position.x + 'px, ' + position.y + 'px, 0)',
    transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease',
    userSelect: 'none',
  };

  let variantStyles = {};
  if (variant === 'primary') {
    variantStyles = {
      background: 'linear-gradient(135deg, #00e5ff 0%, #0891b2 100%)',
      color: '#04060a',
      boxShadow: '0 4px 20px rgba(0, 229, 255, 0.35)',
    };
  } else if (variant === 'amber') {
    variantStyles = {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#04060a',
      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)',
    };
  } else if (variant === 'secondary') {
    variantStyles = {
      background: 'rgba(10, 14, 24, 0.8)',
      color: '#f0f2f5',
      border: '1px solid rgba(0, 229, 255, 0.35)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    };
  } else {
    variantStyles = {
      background: 'transparent',
      color: '#94a3b8',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    };
  }

  const combinedStyles = { ...baseStyles, ...variantStyles, ...style };

  if (to) {
    return (
      <Link
        ref={btnRef}
        to={to}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={combinedStyles}
        className={className}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={combinedStyles}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
