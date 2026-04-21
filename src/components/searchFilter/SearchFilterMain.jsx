import { useReducer, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { initialState, reducer, fetchSearchResults } from "./reducer";
import Sidebar from "./Sidebar";
import Results from "./Results";
import Header from "../common/Header/Header";
import SearchContainer from "../common/Main/Hero/SearchContainer";
import Footer from "../common/Footer/Footer";

import "./SearchFilterMain.css";

export default function SearchFilterMain() {
  const [state, dispatch] = useReducer(reducer, initialState());
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  // Read search fields from URL params
  const urlDestination = searchParams.get("q") || "";
  const urlCheckIn = searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")) : null;
  const urlCheckOut = searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")) : null;
  const urlAdults = parseInt(searchParams.get("adults"), 10) || 1;
  const urlChildren = parseInt(searchParams.get("children"), 10) || 0;
  const urlRooms = parseInt(searchParams.get("rooms"), 10) || 1;

  const [destination, setDestination] = useState(urlDestination);
  const [checkIn, setCheckIn] = useState(urlCheckIn);
  const [checkOut, setCheckOut] = useState(urlCheckOut);
  const [adults, setAdults] = useState(urlAdults);
  const [children, setChildren] = useState(urlChildren);
  const [rooms, setRooms] = useState(urlRooms);

  useEffect(() => {
    if (query) {
      fetchSearchResults(query, dispatch);
    }
  }, [query]);

  // Use backend search results from reducer state
  const filtered = (state.searchResults || []).filter((p) => {
    // Optionally add more frontend filtering if needed
    if (state.stars && p.stars !== state.stars) return false;
    // Add more filters as needed
    return true;
  });

  return (
    <>
      <Header />
      <div
        style={{
          height: "10px",
          background: "var(--midnightBlue)",
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      />
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
      <div className="search-filter-main">
        <div className="search-filter-page">
          <div className="search-filter-header">
            <div>
              <div className="search-filter-header-title">
                Nigeria:{" "}
                {(state.searchResults
                  ? state.searchResults.length
                  : 0
                ).toLocaleString()}{" "}
                properties match your search
              </div>
              <div className="search-filter-header-sub">
                Sorted by your preferences
              </div>
            </div>
          </div>

          {/* Mobile filter button, only visible on small screens */}
          <button
            className="search-filter-mobile-filter-btn"
            style={{ marginBottom: 12 }}
            onClick={() => setMobileOpen(true)}
          >
            Filters
          </button>
          <div className="search-filter-layout">
            <Sidebar
              state={state}
              dispatch={dispatch}
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
            />
            <Results properties={filtered} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
