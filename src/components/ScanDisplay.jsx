import React from 'react';
import './ScanDisplay.css';

function ScanDisplay({ scanNumber = 0 }) {
  return (
    <div className="scan-display">
      <span className="scan-label">Скан:</span>
      <span className="scan-number">{scanNumber}</span>
    </div>
  );
}

export default ScanDisplay;