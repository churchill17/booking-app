import HotelCard from "./HotelCard.jsx";
import { HOTEL_CARD } from "../../data.js";
import "./Hotel.css";

export default function Hotel() {
  return (
    <section className="hotel">
      <h2>Still interested</h2>

      <div className="hotel-card">
        {HOTEL_CARD.map((hotelCard) => (
          <HotelCard key={hotelCard.title} {...hotelCard} />
        ))}
      </div>
    </section>
  );
}
