import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import { getStoredUser } from "../../../../utils/authUser";
import { loadSearch, saveSearch } from "../../../../utils/searchStorage";
import SearchContainer from "./SearchContainer";

export default function Hero() {
  const navigate = useNavigate();
  const user  = getStoredUser();
  const saved = loadSearch();

  // Start empty if nothing is in sessionStorage — no date defaults
  const [destination, setDestination] = useState(saved?.destination || "");
  const [checkIn,     setCheckIn]     = useState(saved?.checkIn  || null);
  const [checkOut,    setCheckOut]    = useState(saved?.checkOut || null);
  const [adults,      setAdults]      = useState(saved?.adults   ?? 2);
  const [children,    setChildren]    = useState(saved?.children ?? 0);
  const [rooms,       setRooms]       = useState(saved?.rooms    ?? 1);

  // Save to sessionStorage only when the user submits the search
  const handleSearch = (params) => {
    saveSearch({ destination, checkIn, checkOut, adults, children, rooms });
    navigate(`/SearchFilter?${params.toString()}`);
  };

  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="hero-text">
          {user?.firstName && (
            <p className="hero-welcome">Hi {user.firstName}, welcome to our platform!</p>
          )}
          <h1>Find your next stay</h1>
          <p>Search low prices on hotels, homes and much more...</p>
        </div>
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
    </section>
  );
}
