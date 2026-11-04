import React from 'react';
import styles from './Tag.module.css'; // CSS Modules (imported CSS)

// Reusable component. Props: label (text) and kind ('highlight' makes it blue).
export default function Tag({ label, kind }) {
  return <span className={kind === 'highlight' ? `${styles.tag} ${styles.highlight}` : styles.tag}>{label}</span>;
}
