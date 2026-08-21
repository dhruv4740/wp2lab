import React, { useState, useEffect } from 'react';
import './App.css';
import TelemetryCard from './components/TelemetryCard';
import StatusBadge from './components/StatusBadge';
import { getInitialTelemetry, runAiScheduler } from './services/api';

function App() {
  const [battery, setBattery] = useState(70);
  const [linkQuality, setLinkQuality] = useState('Good');
  const [availableTime, setAvailableTime] = useState(5);
  const [queue, setQueue] = useState([]);
  const [rec, setRec] = useState(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(false);

  const [batteryInput, setBatteryInput] = useState(70);
  const [linkInput, setLinkInput] = useState('Good');
  const [timeInput, setTimeInput] = useState(5);
  const [newName, setNewName] = useState('TT&C / Housekeeping');
  const [newMode, setNewMode] = useState('TT&C');
  const [newSize, setNewSize] = useState(15);
  const [newPriority, setNewPriority] = useState('Critical');
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    getInitialTelemetry().then((data) => {
      setBattery(data.battery);
      setLinkQuality(data.linkQuality);
      setAvailableTime(data.availableTime);
      setBatteryInput(data.battery);
      setLinkInput(data.linkQuality);
      setTimeInput(data.availableTime);
      setQueue(data.queue);
      setUpdatedAt(data.updatedAt);
      setLoading(false);
    });
  };

  const executeScheduler = (b = battery, l = linkQuality, t = availableTime, q = queue) => {
    setLoading(true);
    runAiScheduler({ battery: b, linkQuality: l, availableTime: t, queue: q }).then((result) => {
      setRec(result);
      setUpdatedAt(result.updatedAt);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (queue.length > 0) {
      executeScheduler(battery, linkQuality, availableTime, queue);
    }
  }, [battery, linkQuality, availableTime, queue.length]);

  const handleConditions = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const b = Number(batteryInput);
    const t = Number(timeInput);
    if (isNaN(b) || b < 0 || b > 100) return setErrorMsg('Battery must be between 0 and 100.');
    if (isNaN(t) || t <= 0) return setErrorMsg('Communication time must be greater than 0.');
    setBattery(b);
    setLinkQuality(linkInput);
    setAvailableTime(t);
  };

  const handleAddPayload = (e) => {
    e.preventDefault();
    const size = Number(newSize);
    if (!newName.trim()) return setErrorMsg('Payload name is required.');
    if (isNaN(size) || size <= 0) return setErrorMsg('Data size must be greater than 0 KB.');
    setQueue((prev) => [...prev, { id: Date.now(), name: newName.trim(), mode: newMode, size, priority: newPriority }]);
    setErrorMsg('');
  };

  const setPreset = (b, l, t) => {
    setBattery(b);
    setLinkQuality(l);
    setAvailableTime(t);
    setBatteryInput(b);
    setLinkInput(l);
    setTimeInput(t);
  };

  const decisionMap = {};
  rec?.decisions?.forEach((d) => { decisionMap[d.id] = d; });

  return (
    <div className="container">
      <header className="header">
        <h1>SomaiyaSat AI Communication Dashboard</h1>
        <p>Data prioritization and mode selection for PocketQube satellite</p>
      </header>

      {battery < 15 && <div className="alert">Low battery ({battery}%): non-critical data deferred.</div>}
      {battery >= 15 && battery <= 30 && <div className="alert">Power-save ({battery}%): media payloads deferred.</div>}

      <div className="grid grid-4">
        <TelemetryCard label="Battery" value={battery} unit="%" badgeType="battery" badgeValue={battery < 15 ? 'Critical' : battery <= 30 ? 'Warning' : 'Normal'} />
        <TelemetryCard label="Link Quality" value={linkQuality} badgeType="link" badgeValue={linkQuality} />
        <TelemetryCard label="Pass Window" value={availableTime} unit=" min" />
        <TelemetryCard label="Last Updated" value={updatedAt || 'Loading'} />
      </div>

      <div className="card">
        <div className="rec-top">
          <h3>AI Recommendation</h3>
          <div className="btn-group">
            <button type="button" className="btn-action btn-main" onClick={() => executeScheduler()} disabled={loading}>
              {loading ? 'Running...' : 'Run AI Scheduler'}
            </button>
            <button type="button" className="btn-action" onClick={loadData} disabled={loading}>
              Refresh Data
            </button>
            <button type="button" className="btn-action" onClick={() => { setPreset(70, 'Good', 5); loadData(); }} disabled={loading}>
              Reset Simulation
            </button>
          </div>
        </div>

        <div className="presets">
          <span>Presets:</span>
          <button type="button" onClick={() => setPreset(75, 'Good', 5)}>Nominal (75% / Good / 5m)</button>
          <button type="button" onClick={() => setPreset(25, 'Fair', 3)}>Power-Save (25% / Fair / 3m)</button>
          <button type="button" onClick={() => setPreset(12, 'Poor', 1)}>Emergency (12% / Poor / 1m)</button>
        </div>

        <div className="grid grid-4 mt-2">
          <div><span className="label">Next Transmission</span><strong>{rec?.nextItem || 'None'}</strong></div>
          <div><span className="label">Mode</span><span>{rec?.mode || '-'}</span></div>
          <div><span className="label">Priority</span>{rec?.priority && <StatusBadge type="priority" value={rec.priority} />}</div>
          <div><span className="label">Confidence</span><span>{rec?.confidence || '-'}</span></div>
        </div>
        <div className="reason"><span className="label">Reason</span><p>{rec?.reason || 'Computing...'}</p></div>
      </div>

      <div className="card">
        <h3>Pending Data Queue ({queue.length})</h3>
        {queue.length === 0 ? <p className="muted">Queue is empty.</p> : (
          <table>
            <thead>
              <tr><th>Data Type</th><th>Mode</th><th>Size</th><th>Priority</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {queue.map((item) => {
                const dec = decisionMap[item.id];
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.mode}</td>
                    <td>{item.size} KB</td>
                    <td><StatusBadge type="priority" value={item.priority} /></td>
                    <td>
                      <StatusBadge type="decision" value={dec?.status || 'Ready'} />
                      {dec && <span className="time-tag"> ~{dec.timeSec}s</span>}
                    </td>
                    <td>
                      <button type="button" className="btn-del" onClick={() => setQueue((q) => q.filter((x) => x.id !== item.id))}>Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Adjust Conditions</h3>
          <form onSubmit={handleConditions}>
            <div className="form-group"><label>Battery: {batteryInput}%</label><input type="range" min="0" max="100" value={batteryInput} onChange={(e) => setBatteryInput(Number(e.target.value))} /></div>
            <div className="form-group"><label>Link Quality</label><select value={linkInput} onChange={(e) => setLinkInput(e.target.value)}><option value="Good">Good (9.6 kbps)</option><option value="Fair">Fair (4.8 kbps)</option><option value="Poor">Poor (1.2 kbps)</option></select></div>
            <div className="form-group"><label>Pass Window (minutes)</label><input type="number" step="0.5" min="0.5" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} /></div>
            <button type="submit" className="btn btn-primary">Apply Conditions</button>
          </form>
        </div>

        <div className="card">
          <h3>Add Data Payload</h3>
          <form onSubmit={handleAddPayload}>
            <div className="form-group"><label>Payload Name</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Magnetometer Data" /></div>
            <div className="grid grid-2">
              <div className="form-group"><label>Mode</label><select value={newMode} onChange={(e) => setNewMode(e.target.value)}><option value="TT&C">TT&C</option><option value="M17">M17</option><option value="Codec2">Codec2</option><option value="SSTV">SSTV</option></select></div>
              <div className="form-group"><label>Priority</label><select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}><option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
            </div>
            <div className="form-group"><label>Size (KB)</label><input type="number" min="1" value={newSize} onChange={(e) => setNewSize(e.target.value)} /></div>
            <button type="submit" className="btn btn-secondary">Add to Queue</button>
          </form>
        </div>
      </div>
      {errorMsg && <p className="error">{errorMsg}</p>}
    </div>
  );
}

export default App;
