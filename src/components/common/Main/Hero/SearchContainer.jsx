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
  handleSubmit,
}) {
  return (
    <div className="hero-search-wrap">
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
    </div>
  );
}
