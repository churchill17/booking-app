import { useState, useEffect } from "react";
import "./Hero.css";
import { getStoredUser } from "../../../../utils/authUser";
import { loadSearch, saveSearch } from "../../../../utils/searchStorage";
import SearchContainer from "./SearchContainer";

function getDefaultDates(saved) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const savedIn = saved?.checkIn ? new Date(saved.checkIn) : null;
  const savedOut = saved?.checkOut ? new Date(saved.checkOut) : null;

  const checkIn = savedIn && savedIn >= today ? savedIn : today;
  const checkOut = savedOut && savedOut > checkIn ? savedOut : tomorrow;
  return { checkIn, checkOut };
}

export default function Hero() {
  const user = getStoredUser();
  const saved = loadSearch();
  const { checkIn: initCheckIn, checkOut: initCheckOut } = getDefaultDates(saved);

  const [destination, setDestination] = useState(saved?.destination || "");
  const [checkIn, setCheckIn] = useState(initCheckIn);
  const [checkOut, setCheckOut] = useState(initCheckOut);
  const [adults, setAdults] = useState(saved?.adults ?? 2);
  const [children, setChildren] = useState(saved?.children ?? 0);
  const [rooms, setRooms] = useState(saved?.rooms ?? 1);

  useEffect(() => {
    saveSearch({ destination, checkIn, checkOut, adults, children, rooms });
  }, [destination, checkIn, checkOut, adults, children, rooms]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-text">
            {user?.firstName && (
              <p className="hero-welcome">
                Hi {user.firstName}, welcome to our platform!
              </p>
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
          />
        </div>
      </section>
    </>
  );
}
