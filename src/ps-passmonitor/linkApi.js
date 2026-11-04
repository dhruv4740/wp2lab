// Simulated link-health API. Returns a Promise that resolves after a delay, like a real network call.
// Swap fetchPassData for a fetch() to a real endpoint later; the rest of the app does not change.
const PASSES = {
  'Mumbai GS': { snr: 14, battery: 82, temperature: 28, condition: 'Clear sky' },
  'Helsinki GS': { snr: 9, battery: 46, temperature: 47, condition: 'Light rain' },
  'Bengaluru GS': { snr: 5, battery: 31, temperature: 38, condition: 'Cloudy' },
  'Delhi GS': { snr: 2, battery: 14, temperature: 63, condition: 'Dust storm' },
};

export const STATIONS = Object.keys(PASSES);

export function fetchPassData(station) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!PASSES[station]) return reject(new Error('Unknown ground station: ' + station));
      resolve({ station, ...PASSES[station] });
    }, 700);
  });
}

// Risk level from battery (%), SNR (dB) and temperature (°C); thresholds follow the mission power budget.
export function classify({ snr, battery, temperature }) {
  if (battery < 20 || snr < 3 || temperature > 60) return 'Critical';
  if (battery < 50 || snr < 8 || temperature > 45) return 'Degraded';
  return 'Nominal';
}

// Advisory shown for each risk level (TT&C is always sent first, as in the AI router's priority queue).
export const ADVISORY = {
  Nominal: 'Full downlink: send TT&C first, then SSTV images, then Codec2/M17 voice.',
  Degraded: 'Reduce power: send TT&C and SSTV only. Pause voice traffic until the link recovers.',
  Critical: 'Safe mode: send TT&C housekeeping only. Pause SSTV and voice, and reduce transmit power.',
};
