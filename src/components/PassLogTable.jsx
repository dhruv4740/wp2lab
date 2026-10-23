import React, { useState } from 'react';
import { Edit3, Save, X, Check, Eye, CheckSquare, Square, Trash2, RefreshCw } from 'lucide-react';

const INITIAL_PASSES = [
  { id: 'PSS-0147', mode: 'TT&C', window: '14:22 – 14:31 UTC', status: 'Decoded', bytes: '4.2 KB', notes: 'Nominal beacon', station: 'Mumbai' },
  { id: 'PSS-0146', mode: 'SSTV', window: '12:05 – 12:14 UTC', status: 'Partial', bytes: '186 KB', notes: 'Image truncated at 72%', station: 'Helsinki' },
  { id: 'PSS-0145', mode: 'M17', window: '09:48 – 09:56 UTC', status: 'Decoded', bytes: '22 KB', notes: 'Voice downlink clear', station: 'Mumbai' },
  { id: 'PSS-0144', mode: 'TT&C', window: '07:31 – 07:39 UTC', status: 'Failed', bytes: '0 KB', notes: 'No signal acquired', station: 'DLR' },
  { id: 'PSS-0143', mode: 'Codec2', window: '05:12 – 05:20 UTC', status: 'Decoded', bytes: '8.6 KB', notes: 'Low-bitrate voice OK', station: 'Mumbai' },
  { id: 'PSS-0142', mode: 'SSTV', window: '02:55 – 03:04 UTC', status: 'Decoded', bytes: '241 KB', notes: 'Full image received', station: 'JAXA' },
];

const STATUS_OPTIONS = ['Decoded', 'Partial', 'Failed', 'Scheduled'];

const STATUS_COLORS = {
  Decoded: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: 'rgba(52, 211, 153, 0.3)' },
  Partial: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  Failed: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
  Scheduled: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
};

export default function PassLogTable({ onPassClick }) {
  const [passes, setPasses] = useState(INITIAL_PASSES);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [selectedPasses, setSelectedPasses] = useState([]);

  // Table Edit Handlers
  const startEditing = (e, passId) => {
    e.stopPropagation();
    const pass = passes.find(p => p.id === passId);
    setEditValues({ status: pass.status, notes: pass.notes });
    setEditingRow(passId);
  };

  const saveRow = (e) => {
    e.stopPropagation();
    setPasses(prev => prev.map(p =>
      p.id === editingRow ? { ...p, status: editValues.status, notes: editValues.notes } : p
    ));
    setEditingRow(null);
  };

  const cancelRow = (e) => {
    e.stopPropagation();
    setEditingRow(null);
  };

  // Group Edit (Batch Actions) Handlers
  const toggleSelectPass = (e, passId) => {
    e.stopPropagation();
    setSelectedPasses(prev =>
      prev.includes(passId) ? prev.filter(id => id !== passId) : [...prev, passId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPasses.length === passes.length) {
      setSelectedPasses([]);
    } else {
      setSelectedPasses(passes.map(p => p.id));
    }
  };

  const handleBatchStatus = (newStatus) => {
    setPasses(prev => prev.map(p =>
      selectedPasses.includes(p.id) ? { ...p, status: newStatus } : p
    ));
    setSelectedPasses([]);
  };

  const handleBatchDelete = () => {
    setPasses(prev => prev.filter(p => !selectedPasses.includes(p.id)));
    setSelectedPasses([]);
  };

  return (
    <div style={{
      backgroundColor: '#080b12',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Table Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#f8fafc' }}>
            Ground Pass Tracking Log
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
            TABLE EDIT &amp; GROUP BATCH ACTIONS // CLICK ✎ TO EDIT ROW INLINE OR SELECT CHECKBOXES
          </div>
        </div>

        {/* Group Edit Batch Toolbar */}
        {selectedPasses.length > 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '4px 10px',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>
              {selectedPasses.length} Selected:
            </span>
            <button
              onClick={() => handleBatchStatus('Decoded')}
              style={{
                backgroundColor: 'rgba(52, 211, 153, 0.2)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#34d399',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Mark Decoded
            </button>
            <button
              onClick={() => handleBatchStatus('Scheduled')}
              style={{
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Re-queue
            </button>
            <button
              onClick={handleBatchDelete}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        ) : (
          <div style={{
            fontSize: '0.72rem',
            color: '#94a3b8',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            {passes.length} PASS RECORDS
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {/* Group Edit Master Select */}
              <th style={{ padding: '10px 12px', width: '36px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedPasses.length > 0 && selectedPasses.length === passes.length}
                  onChange={toggleSelectAll}
                  style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                  title="Select all passes for group action"
                />
              </th>
              {['Pass ID', 'Mode', 'Window', 'Station', 'Status', 'Notes', ''].map((header, i) => (
                <th key={i} style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {passes.map((pass) => {
              const isEditing = editingRow === pass.id;
              const isSelected = selectedPasses.includes(pass.id);
              const statusStyle = STATUS_COLORS[isEditing ? editValues.status : pass.status] || STATUS_COLORS.Scheduled;

              return (
                <tr
                  key={pass.id}
                  onClick={() => !isEditing && onPassClick && onPassClick(pass)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: isEditing ? 'default' : 'pointer',
                    transition: 'background-color 0.15s ease',
                    backgroundColor: isSelected
                      ? 'rgba(56, 189, 248, 0.08)'
                      : isEditing
                      ? 'rgba(74, 124, 155, 0.12)'
                      : 'transparent'
                  }}
                  onMouseEnter={(e) => { if (!isEditing && !isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={(e) => { if (!isEditing && !isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {/* Checkbox for Group Edit */}
                  <td style={{ padding: '10px 12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => toggleSelectPass(e, pass.id)}
                      style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                    />
                  </td>

                  {/* Pass ID */}
                  <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '600', color: '#38bdf8', whiteSpace: 'nowrap' }}>
                    {pass.id}
                  </td>

                  {/* Mode */}
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      fontFamily: 'JetBrains Mono, monospace',
                      backgroundColor: 'rgba(74, 124, 155, 0.15)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.25)'
                    }}>
                      {pass.mode}
                    </span>
                  </td>

                  {/* Window */}
                  <td style={{ padding: '10px 14px', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {pass.window}
                  </td>

                  {/* Station */}
                  <td style={{ padding: '10px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {pass.station}
                  </td>

                  {/* Status — editable */}
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    {isEditing ? (
                      <select
                        className="table-edit-select"
                        value={editValues.status}
                        onChange={(e) => setEditValues(prev => ({ ...prev, status: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          backgroundColor: '#05070f',
                          border: '1px solid #38bdf8',
                          color: '#ffffff',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          fontSize: '0.8rem'
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        fontFamily: 'JetBrains Mono, monospace',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`
                      }}>
                        {pass.status}
                      </span>
                    )}
                  </td>

                  {/* Notes — editable */}
                  <td style={{ padding: '10px 14px', color: '#cbd5e1', fontSize: '0.82rem', minWidth: '180px' }}>
                    {isEditing ? (
                      <input
                        className="table-edit-input"
                        value={editValues.notes}
                        onChange={(e) => setEditValues(prev => ({ ...prev, notes: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          backgroundColor: '#05070f',
                          border: '1px solid #38bdf8',
                          color: '#ffffff',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          width: '100%',
                          fontSize: '0.82rem'
                        }}
                      />
                    ) : (
                      pass.notes
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={saveRow}
                          title="Save row"
                          style={{
                            width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                            backgroundColor: '#0284c7', color: '#fff',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={cancelRow}
                          title="Cancel"
                          style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent',
                            color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={(e) => startEditing(e, pass.id)}
                          title="Edit row in-place"
                          style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'transparent',
                            color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onPassClick && onPassClick(pass); }}
                          title="View telemetry overlay"
                          style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'transparent',
                            color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    )}
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
