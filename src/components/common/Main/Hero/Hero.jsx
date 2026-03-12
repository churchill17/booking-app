import { useState } from "react";
import "./Hero.css";
import DestinationField from "./DestinationField";
import CalendarField from "./CalendarField";
import GuestsField from "./GuestsField";
import { getStoredUser } from "../../../../utils/authUser";

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

      <form className="search-container" onSubmit={handleSubmit}>
        <DestinationField
          destination={destination}
          setDestination={setDestination}
        />

        <CalendarField
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
        />

        <GuestsField
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          rooms={rooms}
          setRooms={setRooms}
        />

        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </section>
  );
}
