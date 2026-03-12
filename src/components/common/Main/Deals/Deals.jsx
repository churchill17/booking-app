import genius from "../../../../assets/img/genius.jpg";
import "./Deals.css";

export default function Deals() {
  return (
    <section className="deals">
      <div className="deals-card">
        <div className="deals-card-content">
          <h2>Log in to unlock savings</h2>
          <p>
            Save 10% or more at selected properties — simply look for the blue
            Genius label
          </p>
          <div className="deals-actions">
            <button>Sign in</button>
            <button>Register</button>
          </div>
        </div>
        <div>
          <img src={genius} alt="Genius" />
        </div>
      </div>
    </section>
  );
}
