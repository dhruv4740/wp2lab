import React, { useState, useEffect } from 'react';

export default function TypeOnText({
  text = '',
  speed = 35,
  delay = 200,
  className = '',
  style = {},
  cursor = true,
  onComplete,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeoutId;
    let charIndex = 0;
    setDisplayedText('');

    timeoutId = setTimeout(() => {
      setIsTyping(true);
      const interval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, delay]);

  return (
    <span className={className} style={{ display: 'inline', ...style }}>
      {displayedText}
      {cursor && (
        <span
          style={{
            display: 'inline-block',
            width: '0.55em',
            height: '1.05em',
            marginLeft: '0.15em',
            verticalAlign: 'text-bottom',
            backgroundColor: '#00e5ff',
            boxShadow: '0 0 8px #00e5ff',
          }}
        />
      )}
    </span>
  );
}
