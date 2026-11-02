import React from 'react';
import styles from './PassCard.module.css'; // CSS Modules (imported CSS)

// Reusable card. Every value comes in through props (nothing is hard-coded), so one component shows any station.
export default function PassCard({ station, snr, battery, temperature, condition, risk }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{station}</div>
      <div className={styles.condition}>{condition}</div>
      <div className={styles.grid}>
        <div className={styles.stat}><div className={styles.value}>{snr} dB</div><div className={styles.label}>Link SNR</div></div>
        <div className={styles.stat}><div className={styles.value}>{battery}%</div><div className={styles.label}>Battery</div></div>
        <div className={styles.stat}><div className={styles.value}>{temperature}°C</div><div className={styles.label}>Temperature</div></div>
      </div>
      <span className={`${styles.badge} ${styles[risk]}`}>{risk.toUpperCase()}</span>
    </div>
  );
}
