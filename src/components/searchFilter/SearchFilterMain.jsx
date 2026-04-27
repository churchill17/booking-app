import { useReducer, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { initialState, reducer, fetchSearchResults } from "./reducer";
import Sidebar from "./Sidebar";
import Results from "./Results";
import Header from "../common/Header/Header";
import SearchContainer from "../common/Main/Hero/SearchContainer";
import Footer from "../common/Footer/Footer";
import { loadSearch, saveSearch } from "../../utils/searchStorage";

import "./SearchFilterMain.css";

export default function SearchFilterMain() {
  const [state, dispatch] = useReducer(reducer, initialState());
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  // URL params take priority; fall back to saved search
  const saved = loadSearch();
  const urlDestination = searchParams.get("q") || saved?.destination || "";
  const urlCheckIn = searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")) : saved?.checkIn || null;
  const urlCheckOut = searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")) : saved?.checkOut || null;
  const urlAdults = parseInt(searchParams.get("adults"), 10) || saved?.adults || 1;
  const urlChildren = parseInt(searchParams.get("children"), 10) || saved?.children || 0;
  const urlRooms = parseInt(searchParams.get("rooms"), 10) || saved?.rooms || 1;

  const [destination, setDestination] = useState(urlDestination);
  const [checkIn, setCheckIn] = useState(urlCheckIn);
  const [checkOut, setCheckOut] = useState(urlCheckOut);
  const [adults, setAdults] = useState(urlAdults);
  const [children, setChildren] = useState(urlChildren);
  const [rooms, setRooms] = useState(urlRooms);

  useEffect(() => {
    saveSearch({ destination, checkIn, checkOut, adults, children, rooms });
  }, [destination, checkIn, checkOut, adults, children, rooms]);

  // Fetch when URL query changes (normal search navigate from home)
  useEffect(() => {
    if (query) {
      fetchSearchResults(query, dispatch, {
        checkIn:  searchParams.get("checkIn")  || '',
        checkOut: searchParams.get("checkOut") || '',
        guests:   searchParams.get("adults")   || 1,
      });
    }
  }, [query]);

  // On mount: if no URL query but saved destination exists, fetch with saved values
  useEffect(() => {
    if (!query && destination) {
      fetchSearchResults(destination, dispatch, {
        checkIn:  checkIn instanceof Date ? checkIn.toISOString() : '',
        checkOut: checkOut instanceof Date ? checkOut.toISOString() : '',
        guests:   adults || 1,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    return (state.searchResults || []).filter((p) => {
      // Stars rating
      if (state.stars && p.stars !== state.stars) return false;

      // Budget (per night)
      const price = parseFloat(
        p.currentPrice || p.current_price || p.originalPrice || p.original_price || 0,
      );
      if (price > 0 && price > state.budgetMax) return false;

      // Review score checkboxes
      if (state.checkedReviewScores.length > 0) {
        const rating = parseFloat(p.avgRating || p.avg_rating || 0);
        const passes = state.checkedReviewScores.some((score) => {
          const min = parseFloat((score.match(/(\d+)\+/) || [])[1] || 0);
          return rating >= min;
        });
        if (!passes) return false;
      }

      // Property type checkboxes
      if (state.checkedPropertyTypes.length > 0) {
        const type = (p.type || "").toLowerCase();
        const passes = state.checkedPropertyTypes.some((t) => {
          const tl = t.toLowerCase();
          if (tl === "entire homes & apartments") return type === "apartment" || type === "home";
          if (tl === "apartments") return type === "apartment";
          if (tl === "hotels") return type === "hotel";
          if (tl === "guest houses") return type === "guest house" || type === "guesthouse";
          if (tl === "holiday homes") return type === "holiday home";
          if (tl === "homestays") return type === "homestay";
          if (tl === "bed and breakfasts") return type === "bed and breakfast" || type === "b&b";
          if (tl === "resorts") return type === "resort";
          return type.includes(tl);
        });
        if (!passes) return false;
      }

      // Facilities checkboxes
      if (state.checkedFacilities.length > 0) {
        const propFacilities = [
          ...(Array.isArray(p.popularFacilities) ? p.popularFacilities : []),
          ...(Array.isArray(p.amenities) ? p.amenities : []),
        ].map((f) => (typeof f === "string" ? f.toLowerCase() : ""));
        const passes = state.checkedFacilities.every((f) =>
          propFacilities.some((pf) => pf.includes(f.toLowerCase())),
        );
        if (!passes) return false;
      }

      // Bed type checkboxes
      if (state.checkedBedTypes.length > 0) {
        const rooms = Array.isArray(p.rooms) ? p.rooms : [];
        if (rooms.length > 0) {
          const bedValues = rooms.map((r) =>
            (r.bedType || r.bed_type || "").toLowerCase(),
          );
          const passes = state.checkedBedTypes.some((bt) =>
            bedValues.some((bv) =>
              bv.includes(bt.toLowerCase().replace(" bed", "")),
            ),
          );
          if (!passes) return false;
        }
      }

      // Popular filter chips
      if (state.chips.length > 0) {
        const type = (p.type || "").toLowerCase();
        const rating = parseFloat(p.avgRating || p.avg_rating || 0);
        const allFacilities = [
          ...(Array.isArray(p.popularFacilities) ? p.popularFacilities : []),
          ...(Array.isArray(p.amenities) ? p.amenities : []),
        ].map((f) => (typeof f === "string" ? f.toLowerCase() : ""));

        const passes = state.chips.some((chip) => {
          const cl = chip.toLowerCase();
          const ratingMatch = chip.match(/(\d+)\+/);
          if (ratingMatch) return rating >= parseFloat(ratingMatch[1]);
          if (cl === "hotels") return type === "hotel";
          if (cl === "apartments") return type === "apartment";
          if (cl === "free wifi") return allFacilities.some((f) => f.includes("wifi"));
          if (cl === "free parking" || cl === "parking")
            return (
              allFacilities.some((f) => f.includes("parking")) ||
              (p.parking && p.parking !== "No")
            );
          if (cl === "airport shuttle")
            return allFacilities.some((f) => f.includes("shuttle"));
          return true;
        });
        if (!passes) return false;
      }

      return true;
    });
  }, [
    state.searchResults,
    state.stars,
    state.budgetMax,
    state.checkedReviewScores,
    state.checkedPropertyTypes,
    state.checkedFacilities,
    state.checkedBedTypes,
    state.chips,
  ]);

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
