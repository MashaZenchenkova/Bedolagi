import { useState } from 'react';
import Button from './components/Button';
import Button2 from './components/Button2';
import Perecl from './components/Perecl';
import Slider from './components/Slider';
import ScanDisplay from './components/ScanDisplay';
import './App.css';

function App() {
  const [scanNumber, setScanNumber] = useState(0);

  function handlePrev() {
    setScanNumber((prev) => (prev > 0 ? prev - 1 : 0));
  }

  function handleNext() {
    setScanNumber((prev) => prev + 1);
  }

  return (
    <div className="app-container">
      <Button onClick={handlePrev} />
      <Button2 onClick={handleNext} />
      <Perecl />
      <Slider label="Масштаб" min={0} max={100} initialValue={50} />
      <ScanDisplay scanNumber={scanNumber} />
    </div>
  );
}

export default App;