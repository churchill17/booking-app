import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DestinationField from "./DestinationField";
import CalendarField from "./CalendarField";
import GuestsField from "./GuestsField";

export default function SearchContainer({
  destination,
  setDestination,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  adults,
  setAdults,
  children,
  setChildren,
  rooms,
  setRooms,
  onSearch,
  submitLabel,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setDestinationError("");
    if (!onSearch && (!destination || destination.trim() === "")) {
      setDestinationError("Please enter a destination to start searching.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        q: destination || "",
        checkIn: checkIn instanceof Date ? checkIn.toISOString() : (checkIn || ""),
        checkOut: checkOut instanceof Date ? checkOut.toISOString() : (checkOut || ""),
        adults: adults?.toString() || "1",
        children: children?.toString() || "0",
        rooms: rooms?.toString() || "1"
      });
      if (onSearch) {
        onSearch(params);
      } else {
        navigate(`/SearchFilter?${params.toString()}`);
      }
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero-search-wrap">
      <form className="search-container" onSubmit={handleSubmit} noValidate>
        <DestinationField
          destination={destination}
          setDestination={setDestination}
        />
        {destinationError && (
          <div style={{ color: "red", marginTop: 4 }}>{destinationError}</div>
        )}

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

        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? "Searching..." : (submitLabel || "Search")}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {/* Results are now only shown on the SearchFilter page */}
    </div>
  );
}
