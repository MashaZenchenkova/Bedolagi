import { useState, useEffect } from 'react';
import './Slider.css';

function Slider({ label = 'Slider', min = 0, max = 100, initialValue = 50, onValueChange }) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  }

  useEffect(() => {
    const slider = document.querySelector('.slider-input');
    if (slider) {
      const progress = ((value - min) / (max - min)) * 100;
      slider.style.setProperty('--progress', `${progress}%`);
    }
  }, [value, min, max]);

  return (
    <div className="slider-widget">
      <span className="slider-label">{label}</span>
      <span className="slider-value">{value}</span>
      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default Slider;