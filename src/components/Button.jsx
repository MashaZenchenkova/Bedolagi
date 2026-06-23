import './Button.css';

function Button({ onClick }) {
  return (
    <button className="my-button" onClick={onClick}>
      Предыдущий скан
    </button>
  );
}

export default Button;