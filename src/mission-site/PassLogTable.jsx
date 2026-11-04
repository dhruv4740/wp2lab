import React, { useState } from 'react';
import { Edit3, Check, X, Eye, Trash2 } from 'lucide-react';

const INITIAL_PASSES = [
  { id: 'PSS-0147', mode: 'TT&C', window: '14:22 – 14:31 UTC', status: 'Decoded', bytes: '4.2 KB', notes: 'Nominal beacon', station: 'Mumbai' },
  { id: 'PSS-0146', mode: 'SSTV', window: '12:05 – 12:14 UTC', status: 'Partial', bytes: '186 KB', notes: 'Image truncated at 72%', station: 'Helsinki' },
  { id: 'PSS-0145', mode: 'M17', window: '09:48 – 09:56 UTC', status: 'Decoded', bytes: '22 KB', notes: 'Voice downlink clear', station: 'Mumbai' },
  { id: 'PSS-0144', mode: 'TT&C', window: '07:31 – 07:39 UTC', status: 'Failed', bytes: '0 KB', notes: 'No signal acquired', station: 'DLR' },
  { id: 'PSS-0143', mode: 'Codec2', window: '05:12 – 05:20 UTC', status: 'Decoded', bytes: '8.6 KB', notes: 'Low-bitrate voice OK', station: 'Mumbai' },
  { id: 'PSS-0142', mode: 'SSTV', window: '02:55 – 03:04 UTC', status: 'Decoded', bytes: '241 KB', notes: 'Full image received', station: 'JAXA' },
];

// Badge colours for each status (rgb values, so the tint and border can share them)
const STATUS_RGB = { Decoded: '52, 211, 153', Partial: '245, 158, 11', Failed: '239, 68, 68', Scheduled: '56, 189, 248' };
const STATUS_OPTIONS = Object.keys(STATUS_RGB);

const mono = { fontFamily: 'JetBrains Mono, monospace' };
const cell = { padding: '10px 14px', whiteSpace: 'nowrap' };
const editField = { backgroundColor: '#05070f', border: '1px solid #38bdf8', color: '#ffffff', borderRadius: '4px', padding: '3px 6px', fontSize: '0.8rem' };
const batchBtn = (rgb) => ({ backgroundColor: `rgba(${rgb}, 0.2)`, border: `1px solid rgba(${rgb}, 0.4)`, color: `rgb(${rgb})`, padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' });

// Small square icon button used in the Actions column.
function IconButton({ title, onClick, filled, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: filled ? 'none' : '1px solid rgba(255,255,255,0.12)',
        backgroundColor: filled ? '#0284c7' : 'transparent',
        color: filled ? '#fff' : '#94a3b8',
      }}
    >
      {children}
    </button>
  );
}

export default function PassLogTable({ onPassClick }) {
  // useState: the table rows, the row being edited, its draft values, and the ticked checkboxes
  const [passes, setPasses] = useState(INITIAL_PASSES);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // Inline edit: copy the row into `draft`, edit the copy, then write it back on save.
  const startEditing = (pass) => {
    setDraft({ status: pass.status, notes: pass.notes });
    setEditingId(pass.id);
  };

  const saveRow = () => {
    setPasses((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...draft } : p)));
    setEditingId(null);
  };

  // Group edit: act on every ticked row at once.
  const toggleSelected = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allSelected = selectedIds.length === passes.length;
  const toggleAll = () => setSelectedIds(allSelected ? [] : passes.map((p) => p.id));

  const setSelectedStatus = (status) => {
    setPasses((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status } : p)));
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    setPasses((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  return (
    <div style={{ backgroundColor: '#080b12', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#f8fafc' }}>Ground Pass Tracking Log</div>
          <div style={{ ...mono, fontSize: '0.72rem', color: '#64748b' }}>
            TABLE EDIT &amp; GROUP BATCH ACTIONS // CLICK ✎ TO EDIT ROW INLINE OR SELECT CHECKBOXES
          </div>
        </div>

        {/* The batch toolbar only appears while at least one row is ticked */}
        {selectedIds.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 10px', borderRadius: '8px' }}>
            <span style={{ ...mono, fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700' }}>{selectedIds.length} Selected:</span>
            <button onClick={() => setSelectedStatus('Decoded')} style={batchBtn(STATUS_RGB.Decoded)}>Mark Decoded</button>
            <button onClick={() => setSelectedStatus('Scheduled')} style={batchBtn(STATUS_RGB.Scheduled)}>Re-queue</button>
            <button onClick={deleteSelected} style={batchBtn(STATUS_RGB.Failed)}><Trash2 size={12} /> Clear</button>
          </div>
        ) : (
          <div style={{ ...mono, fontSize: '0.72rem', color: '#94a3b8' }}>{passes.length} PASS RECORDS</div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '10px 12px', width: '36px', textAlign: 'center' }}>
                <input type="checkbox" checked={selectedIds.length > 0 && allSelected} onChange={toggleAll} style={{ accentColor: '#38bdf8', cursor: 'pointer' }} title="Select all passes for group action" />
              </th>
              {['Pass ID', 'Mode', 'Window', 'Station', 'Status', 'Notes', ''].map((header, i) => (
                <th key={i} style={{ ...cell, ...mono, textAlign: 'left', fontWeight: '700', fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {passes.map((pass) => {
              const isEditing = editingId === pass.id;
              const isSelected = selectedIds.includes(pass.id);
              const rgb = STATUS_RGB[pass.status] || STATUS_RGB.Scheduled;

              return (
                <tr
                  key={pass.id}
                  onClick={() => !isEditing && onPassClick(pass)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: isEditing ? 'default' : 'pointer',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.08)' : isEditing ? 'rgba(74, 124, 155, 0.12)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '10px 12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelected(pass.id)} style={{ accentColor: '#38bdf8', cursor: 'pointer' }} />
                  </td>
                  <td style={{ ...cell, ...mono, fontWeight: '600', color: '#38bdf8' }}>{pass.id}</td>
                  <td style={cell}>
                    <span style={{ ...mono, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(74, 124, 155, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                      {pass.mode}
                    </span>
                  </td>
                  <td style={{ ...cell, ...mono, color: '#94a3b8', fontSize: '0.8rem' }}>{pass.window}</td>
                  <td style={{ ...cell, color: '#94a3b8' }}>{pass.station}</td>

                  {/* Status and Notes turn into form fields while the row is being edited */}
                  <td style={cell}>
                    {isEditing ? (
                      <select
                        value={draft.status}
                        onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        style={editField}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span style={{ ...mono, padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: `rgba(${rgb}, 0.15)`, color: `rgb(${rgb})`, border: `1px solid rgba(${rgb}, 0.3)` }}>
                        {pass.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#cbd5e1', fontSize: '0.82rem', minWidth: '180px' }}>
                    {isEditing ? (
                      <input
                        value={draft.notes}
                        onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...editField, width: '100%', padding: '4px 8px' }}
                      />
                    ) : (
                      pass.notes
                    )}
                  </td>

                  <td style={cell} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {isEditing ? (
                        <>
                          <IconButton title="Save row" filled onClick={saveRow}><Check size={14} /></IconButton>
                          <IconButton title="Cancel" onClick={() => setEditingId(null)}><X size={14} /></IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton title="Edit row in-place" onClick={() => startEditing(pass)}><Edit3 size={13} /></IconButton>
                          <IconButton title="View telemetry overlay" onClick={() => onPassClick(pass)}><Eye size={13} /></IconButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
