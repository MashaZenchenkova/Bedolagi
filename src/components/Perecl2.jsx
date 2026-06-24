import React from 'react';
import './Perecl.css';

function Perecl2({ isChecked = false, onChange }) {
  return (
    <label className="checkbox-label">
      <input 
        type="checkbox" 
        className="my-checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      Включить 3D карту
    </label>
  );
}

export default Perecl2;