import './Button.css';
function Button() {
  function handleClick() {
    alert('обработать действие!');
  }
  return (
    <button className="my-button" onClick={handleClick}>
      Не знаю зачем
    </button>
  );
}
export default Button;