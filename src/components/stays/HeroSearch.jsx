import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSearch.css";
import SearchContainer from "../common/Main/Hero/SearchContainer";
import { loadSearch, saveSearch } from "../../utils/searchStorage";

const ChevronRightIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function HeroSearch({ hero, propertyType }) {
  const navigate = useNavigate();
  const saved = loadSearch();

  const [destination, setDestination] = useState(saved?.destination || "");
  const [checkIn,     setCheckIn]     = useState(saved?.checkIn  || null);
  const [checkOut,    setCheckOut]    = useState(saved?.checkOut || null);
  const [adults,      setAdults]      = useState(saved?.adults   ?? 2);
  const [children,    setChildren]    = useState(saved?.children ?? 0);
  const [rooms,       setRooms]       = useState(saved?.rooms    ?? 1);

  const handleSearch = (params) => {
    saveSearch({ destination, checkIn, checkOut, adults, children, rooms });
    navigate(`/SearchFilter?${params.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero__bg-image" />
        <div className="hero__bg" />
        <div className="hero__content">
          <h1 className="hero__title">
            {hero?.title || "Find the perfect hotel on Booking.com"}
          </h1>
          <p className="hero__subtitle">
            {hero?.subtitle || "From cheap hotels to luxury rooms and everything in between"}
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
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      <nav className="hero__breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          Home
        </a>
        <ChevronRightIcon />
        <span className="current">All {propertyType || "Stays"}</span>
      </nav>
    </>
  );
}
