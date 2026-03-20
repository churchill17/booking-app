import React, { useState } from "react";
import "./HeroSearch.css";
import SearchContainer from "../common/Main/Hero/SearchContainer";

const ChevronRightIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function HeroSearch() {
  // State for all search fields
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [workTravel, setWorkTravel] = useState(false);

  // Handler for form submit
  function handleSubmit(e) {
    e.preventDefault();
    // You can add navigation or search logic here
    // For now, just log the values
    console.log({
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      workTravel,
    });
  }

  return (
    <>
      <section className="hero">
        <div className="hero__bg-image" />
        <div className="hero__bg" />

        <div className="hero__content">
          <h1 className="hero__title">Find the perfect hotel on Booking.com</h1>
          <p className="hero__subtitle">
            From cheap hotels to luxury rooms and everything in between
          </p>
          <div className="hero__search-bar-outer">
            <SearchContainer
              destination={destination}
              setDestination={setDestination}
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              adults={adults}
              setAdults={setAdults}
              children={children}
              setChildren={setChildren}
              rooms={rooms}
              setRooms={setRooms}
              handleSubmit={handleSubmit}
            />
          </div>
          <label className="hero__work-travel">
            <input
              type="checkbox"
              checked={workTravel}
              onChange={() => setWorkTravel(!workTravel)}
            />
            <span
              style={{
                color: "#fff",
                fontFamily: "Lato, sans-serif",
                fontSize: "0.9rem",
                opacity: 0.9,
              }}
            >
              I'm travelling for work
            </span>
          </label>
        </div>
      </section>

      <nav className="hero__breadcrumb">
        <a href="#">Home</a>
        <ChevronRightIcon />
        <span className="current">All hotels</span>
      </nav>
    </>
  );
}
