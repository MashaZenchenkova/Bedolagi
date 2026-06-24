import React, { useState } from 'react';
import Button from './components/Button';
import Button2 from './components/Button2';
import Perecl from './components/Perecl';
import Slider from './components/Slider';
import ScanDisplay from './components/ScanDisplay';
import MapPanel2D from './components/MapPanel2D';
import TelemetryPanel from './components/TelemetryPanel';
import MapPanel3D from './components/MapPanel3D';
import './App.css';

function App() {
  const [scanNumber, setScanNumber] = useState(0);
  const [scale, setScale] = useState(70);

  function handlePrev() {
    setScanNumber((prev) => (prev > 0 ? prev - 1 : 0));
  }

  function handleNext() {
    setScanNumber((prev) => prev + 1);
  }

  function handleScaleChange(newValue) {
    setScale(newValue);
  }

  return (
    <div className="app">
      <div className="controls-bar">
        <Button onClick={handlePrev} />
        <Button2 onClick={handleNext} />
        <ScanDisplay scanNumber={scanNumber} />
        <Slider 
          label="Масштаб" 
          min={0} 
          max={100} 
          initialValue={70}
          onValueChange={handleScaleChange}
        />
        <Perecl />
      </div>
      
      <div className="panels">
        <div className="panel">
          <TelemetryPanel />
        </div>
        <div className="panel">
          <MapPanel2D scale={scale / 1000} />
        </div>
        <div className="panel">
          <MapPanel3D />
        </div>
      </div>
    </div>
  );
}

export default App;