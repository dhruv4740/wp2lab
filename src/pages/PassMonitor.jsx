import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import PassCard from '../components/PassCard';
import RiskAlert from '../components/RiskAlert';
import AdvisoryPanel from '../components/AdvisoryPanel';
import LinkForm from '../components/LinkForm';
import { STATIONS, fetchPassData, classify, ADVISORY } from '../services/linkApi';

// SomaiyaSat Pass Link-Health Monitor: pick a ground station, fetch its link data (Promise + async/await),
// store it in one state object and let the child components render risk and advisory from it.
export default function PassMonitor() {
  const [station, setStation] = useState(STATIONS[0]);
  const [pass, setPass] = useState(null); // centralised state: station, snr, battery, temperature, condition, risk, advisory, lastUpdated
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stores new readings in state and derives risk, advisory and timestamp from them.
  const applyData = (data) => {
    const risk = classify(data);
    setPass({ ...data, risk, advisory: ADVISORY[risk], lastUpdated: new Date().toLocaleTimeString() });
  };

  // async/await: request the data and update state; called from useEffect and from the Refresh button.
  const loadPass = async (name) => {
    setLoading(true);
    setError('');
    try {
      applyData(await fetchPassData(name));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Runs on first render and again whenever the selected station changes.
  useEffect(() => { loadPass(station); }, [station]);

  // Monitoring: warn in the console whenever battery or temperature changes while the link is Critical.
  useEffect(() => {
    if (pass?.risk === 'Critical') console.warn(`Critical link state at ${pass.station}: battery ${pass.battery}%, ${pass.temperature}°C`);
  }, [pass?.battery, pass?.temperature]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '6rem 1.5rem 4rem', display: 'grid', gap: '1.2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Pass Monitor</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 620 }}>
          Link health for SomaiyaSat over each ground station. Status: <b style={{ color: 'var(--accent-cyan)' }}>{loading ? 'UPDATING' : 'MONITORING'}</b>
        </p>
      </header>

      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={station} onChange={(e) => setStation(e.target.value)} style={{ padding: '0.55rem', borderRadius: 6, border: '1px solid #334155', background: '#0b101d', color: '#f8fafc' }}>
          {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => loadPass(station)} style={{ padding: '0.55rem 0.9rem', borderRadius: 6, border: '1px solid #38bdf8', background: 'transparent', color: '#38bdf8', cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
          <RefreshCw size={14} /> Refresh
        </button>
        {pass && <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Last updated: {pass.lastUpdated}</span>}
      </div>

      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      {loading && <p style={{ color: 'var(--text-secondary)' }}>Fetching link data…</p>}

      {!loading && pass && (
        <>
          <PassCard station={pass.station} snr={pass.snr} battery={pass.battery} temperature={pass.temperature} condition={pass.condition} risk={pass.risk} />
          <RiskAlert risk={pass.risk} />
          <AdvisoryPanel advisory={pass.advisory} />
        </>
      )}

      <LinkForm onSubmitData={(values) => applyData({ station, condition: 'Manual entry', ...values })} />

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginTop: '1rem' }}>All ground stations</h2>
      <AllStations />
    </div>
  );
}

// The same PassCard reused once per station (no MumbaiCard / DelhiCard components).
function AllStations() {
  const [all, setAll] = useState([]);
  useEffect(() => {
    Promise.all(STATIONS.map(fetchPassData)).then(setAll);
  }, []);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
      {all.map((p) => <PassCard key={p.station} {...p} risk={classify(p)} />)}
    </div>
  );
}
