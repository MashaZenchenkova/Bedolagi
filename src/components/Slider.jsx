import React, { useState } from 'react';
import './Slider.css';

function Slider({ label, min = 0, max = 100, step = 1, initialValue = 50 }) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
  };

  const handleSend = () => {
    alert(`ДОБАВИТЬ РЕАЛИЗАЦИЮ\nЗначение: ${value}`);
  };

  return (
    <div className="slider-widget">
      <div className="slider-header">
        <span className="slider-label">{label || 'Настройка'}</span>
        <span className="slider-value">{value}</span>
      </div>

      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          background: `linear-gradient(to right, #0765a0 0%, #0765a0 ${(value - min) / (max - min) * 100}%, #2a2f3a ${(value - min) / (max - min) * 100}%, #2a2f3a 100%)`
        }}
      />

      <div className="slider-footer">
        <span className="slider-min">{min}</span>
        <button className="slider-send-btn" onClick={handleSend}>
            Отправить
        </button>
        <span className="slider-max">{max}</span>
      </div>
    </div>
  );
}

export default Slider;