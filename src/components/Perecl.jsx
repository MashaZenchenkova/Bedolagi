import './Perecl.css';

function Perecl() {
  function handleChange(event) {
    if (event.target.checked) {
      alert('✅ Включено! ДОБАВИТЬ ОБРАБОТКУ ДЕСТВИЙ');
    } else {
      alert('❌ Выключено! ДОБАВИТЬ ОБРАБОТКУ ДЕСТВИЙ');
    }
  }

  return (
    <label className="checkbox-label">
      <input 
        type="checkbox" 
        className="my-checkbox" 
        onChange={handleChange} 
      />
      Включить
    </label>
  );
}

export default Perecl;