import React from 'react';
import { motion } from 'framer-motion';

export default function RevealSection({
  children,
  className = '',
  style = {},
  delay = 0,
  duration = 0.7,
  yOffset = 30,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
