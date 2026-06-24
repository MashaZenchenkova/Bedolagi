import React, { useState } from 'react';
import Button from './components/Button';
import Button2 from './components/Button2';
import Perecl from './components/Perecl';
import Perecl2 from './components/Perecl2';
import Slider from './components/Slider';
import ScanDisplay from './components/ScanDisplay';
import MapPanel2D from './components/MapPanel2D';
import TelemetryPanel from './components/TelemetryPanel';
import MapPanel3D from './components/MapPanel3D';
import './App.css';

function App() {
  const [scanNumber, setScanNumber] = useState(0);
  const [scale, setScale] = useState(70);
  const [is2DEnabled, setIs2DEnabled] = useState(true);
  const [is3DEnabled, setIs3DEnabled] = useState(true);

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
        <Perecl 
          isChecked={is2DEnabled}
          onChange={setIs2DEnabled}
        />
        <Perecl2 
          isChecked={is3DEnabled}
          onChange={setIs3DEnabled}
        />
      </div>
      
      <div className="panels">
        <div className="panel">
          <TelemetryPanel />
        </div>
        
        {/* Обе карты включены */}
        {is2DEnabled && is3DEnabled && (
          <>
            <div className="panel">
              <MapPanel2D scale={scale / 1000} />
            </div>
            <div className="panel">
              <MapPanel3D />
            </div>
          </>
        )}
        
        {/* Только 2D */}
        {is2DEnabled && !is3DEnabled && (
          <div className="panel panel-wide">
            <MapPanel2D scale={scale / 1000} />
          </div>
        )}
        
        {/* Только 3D */}
        {!is2DEnabled && is3DEnabled && (
          <div className="panel panel-wide">
            <MapPanel3D />
          </div>
        )}
        
        {/* Обе выключены — фоновое изображение */}
        {!is2DEnabled && !is3DEnabled && (
          <div className="panel panel-wide background-panel">
            <div className="background-image"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;