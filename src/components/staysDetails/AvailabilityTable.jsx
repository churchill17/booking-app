import React from "react";
import "./AvailabilityTable.css";

const AvailabilityTable = ({ rooms }) => {
  return (
    <section className="availability">
      <div className="availability__header">
        <h2 className="availability__title">Availability</h2>
        <span className="availability__currency">Prices in NGN ⓘ</span>
        <a href="#" className="availability__price-match">
          🏷 We Price Match
        </a>
      </div>

      <div className="availability__table-wrapper">
        <table className="availability__table">
          <thead>
            <tr>
              <th>Room type</th>
              <th>Guests</th>
              <th>Size</th>
              <th>Features</th>
              <th>Amenities</th>
              <th>Today's price</th>
              <th>Your choices</th>
              <th>Select rooms</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="availability__room-row">
                <td className="availability__room-cell">
                  <a href="#" className="availability__room-name">
                    {room.name}
                  </a>
                  {room.availability && (
                    <div className="availability__stock">
                      <span className="availability__dot" />
                      We have {room.availability}
                    </div>
                  )}
                  <div className="availability__room-bed">
                    {room.bedType
                      ? room.bedType
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      : "—"}
                  </div>
                </td>
                <td className="availability__guests-cell">
                  {"👤".repeat(room.guests)}
                </td>
                <td>{room.size}</td>
                <td>
                  {Array.isArray(room.features)
                    ? room.features.map((f) => (
                        <span key={f} className="availability__feature-tag">
                          {f}
                        </span>
                      ))
                    : room.features}
                </td>
                <td>
                  {Array.isArray(room.amenities)
                    ? room.amenities.map((a) => (
                        <span key={a} className="availability__feature-tag">
                          {a}
                        </span>
                      ))
                    : room.amenities}
                </td>
                <td className="availability__price-cell">
                  <div className="availability__original-price">
                    {room.originalPrice}
                  </div>
                  <div className="availability__current-price">
                    {room.currentPrice}
                  </div>
                  <div className="availability__price-note">
                    Includes taxes and charges
                  </div>
                  <span className="availability__badge availability__badge--discount">
                    {room.discount}
                  </span>
                  <span className="availability__badge availability__badge--deal">
                    {room.deal}
                  </span>
                </td>
                <td className="availability__choices-cell">
                  {Array.isArray(room.choices)
                    ? room.choices.map((choice, i) => (
                        <div key={i} className="availability__choice">
                          {choice.includes("Continental") && <span>🍳</span>}
                          {choice.includes("cancel") && <span>✗</span>}
                          {choice.includes("prepayment") && <span>✓</span>}
                          {choice.includes("left") && (
                            <span style={{ color: "#e25c5c" }}>•</span>
                          )}
                          <span>{choice}</span>
                        </div>
                      ))
                    : room.choices}
                </td>
                <td className="availability__select-cell">
                  <select className="availability__select">
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="availability__reserve-col">
                    <button className="availability__reserve-btn">
                      I'll reserve
                    </button>
                    <p className="availability__reserve-note">
                      • It only takes 2 minutes
                    </p>
                    <p className="availability__reserve-note">
                      • You won't be charged yet
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AvailabilityTable;
