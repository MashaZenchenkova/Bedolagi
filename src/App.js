import Button from './components/Button';
import Perecl from './components/Perecl';
import Slider from './components/Slider'; 
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Button />
      <Perecl />
      <Slider label="Не знаю еще что" min={0} max={100} initialValue={50} />
    </div>
  );
}
export default App;