import { useState } from 'react';
import './Slider.css';

function Slider({ label = 'Slider', min = 0, max = 100, initialValue = 50 }) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(Number(e.target.value));
  }

  return (
    <div className="slider-widget">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{value}</span>
      </div>
      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <div className="slider-footer">
        <span className="slider-min">{min}</span>
        <span className="slider-max">{max}</span>
      </div>
    </div>
  );
}

export default Slider;