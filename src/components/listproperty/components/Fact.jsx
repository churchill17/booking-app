import "./Fact.css";

export default function Fact({ label, text }) {
  return (
    <div className="lp-fact">
      <strong className="lp-fact__label">{label}:</strong>
      <span className="lp-fact__text">{text}</span>
    </div>
  );
}
