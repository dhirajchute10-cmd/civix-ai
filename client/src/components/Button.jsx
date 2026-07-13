import "../css/Button.css";

function Button({ text, type = "primary" }) {
  return (
    <button className={`btn ${type}`}>
      {text}
    </button>
  );
}

export default Button;