import { useState } from "react";
import "./Hero.css";

import { getStoredUser } from "../../../../utils/authUser"; 

import SearchContainer from "./SearchContainer";

export default function Hero() {
  const user = getStoredUser();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ destination, checkIn, checkOut, adults, children, rooms });
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-text">
          {user?.firstName && (
            <p className="hero-welcome">
              Hi {user.firstName}, welcome to our platform!
            </p>
          )}
          <h1>Find your next stay</h1>
          <p>Search low prices on hotels, homes and much more...</p>
        </div>
      </section>

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
    </>
  );
}
