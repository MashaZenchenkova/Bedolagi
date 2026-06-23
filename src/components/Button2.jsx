import './Button2.css';

function Button2({ onClick }) {
  return (
    <button className="my-button2" onClick={onClick}>
      Следующий скан
    </button>
  );
}

export default Button2;