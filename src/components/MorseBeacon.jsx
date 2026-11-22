import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

const MORSE_MAP = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  ' ': ' ',
};

const MESSAGES = [
  'CQ CQ DE VU2SAT',
  '73 DE SOMAIYASAT',
  'QTH LEO 500KM',
  'HELLO WORLD',
  'AD ASTRA',
];

export default function MorseBeacon() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isLit, setIsLit] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Pick random message on mount
    setMsgIndex(Math.floor(Math.random() * MESSAGES.length));
  }, []);

  const currentMessage = MESSAGES[msgIndex] || MESSAGES[0];

  // Convert text to morse representation
  const morseCodeString = currentMessage
    .split('')
    .map((c) => MORSE_MAP[c] || '')
    .join(' ');

  useEffect(() => {
    let timeoutId;
    let cancelled = false;

    // Build timeline of events (durations in ms with boolean lit state)
    // Dot: 100ms ON, Dash: 300ms ON, Intra-char gap: 100ms OFF, Inter-char gap: 300ms OFF, Inter-word gap: 700ms OFF
    const timeline = [];

    const words = currentMessage.split(' ');
    words.forEach((word, wIdx) => {
      word.split('').forEach((char, cIdx) => {
        const morse = MORSE_MAP[char] || '';
        for (let i = 0; i < morse.length; i++) {
          const sym = morse[i];
          timeline.push({ lit: true, duration: sym === '-' ? 300 : 100 });
          // Intra-char gap if not last symbol
          if (i < morse.length - 1) {
            timeline.push({ lit: false, duration: 100 });
          }
        }
        // Inter-character gap if not last char in word
        if (cIdx < word.length - 1) {
          timeline.push({ lit: false, duration: 300 });
        }
      });
      // Inter-word gap if not last word
      if (wIdx < words.length - 1) {
        timeline.push({ lit: false, duration: 700 });
      }
    });

    // 2.2s Pause at end of message before looping
    timeline.push({ lit: false, duration: 2200 });

    let step = 0;

    const playStep = () => {
      if (cancelled) return;
      const current = timeline[step];
      setIsLit(current.lit);

      timeoutId = setTimeout(() => {
        step = (step + 1) % timeline.length;
        playStep();
      }, current.duration);
    };

    playStep();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [currentMessage]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 50,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Amateur Radio Morse Beacon"
    >
      {/* Blinking 6px dot beacon */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isLit ? '#00e5ff' : 'rgba(0, 229, 255, 0.15)',
          boxShadow: isLit ? '0 0 12px #00e5ff, 0 0 24px #00e5ff' : 'none',
          transition: 'background-color 0.05s ease, box-shadow 0.05s ease',
          cursor: 'pointer',
        }}
      />

      {/* Decoded Tooltip on Hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '22px',
            right: '0',
            backgroundColor: 'rgba(10, 14, 24, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            width: '260px',
            maxWidth: '90vw',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 229, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.4rem',
            }}
          >
            <Radio size={14} color="#00e5ff" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#00e5ff',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              BEACON [437.500 MHz]
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#94a3b8',
              letterSpacing: '0.12em',
              marginBottom: '0.35rem',
              wordBreak: 'break-word',
            }}
          >
            {morseCodeString.replace(/\./g, '•').replace(/-/g, '—')}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#f0f2f5',
              letterSpacing: '0.05em',
            }}
          >
            DECODE: "{currentMessage}"
          </div>
        </div>
      )}
    </div>
  );
}
