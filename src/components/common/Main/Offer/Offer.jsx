import person from "../../../../assets/img/person.jpg";
import "./Offer.css";

export default function Offer() {
  return (
    <section className="offer">
      <h2>Offers</h2>
      <p>Promotions, deals and special offers meant for you</p>
      <div className="offer-container">
        <div>
          <p>Early 2026 Deals</p>
          <p>
            Enjoy special savings with our Early 2026 Deals. Book now and stay
            by 3 April 2026.
          </p>
          <button>View Offer</button>
        </div>
        <div>
          <img src={person} alt="Person 1" />
        </div>
      </div>
    </section>
  );
}
