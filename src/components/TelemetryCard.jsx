import React from 'react';
import StatusBadge from './StatusBadge';

function TelemetryCard({ label, value, unit = '', badgeType, badgeValue }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-label">{label}</span>
        {badgeValue && <StatusBadge type={badgeType} value={badgeValue} />}
      </div>
      <div className="card-value">
        {value}{unit && <span className="card-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default TelemetryCard;
