import React from 'react';
import styles from './Tag.module.css'; // CSS Modules (imported CSS)

// Reusable component. Props: label (text) and kind ('exp' makes it blue).
export default function Tag({ label, kind }) {
  return <span className={kind === 'exp' ? `${styles.tag} ${styles.exp}` : styles.tag}>{label}</span>;
}
