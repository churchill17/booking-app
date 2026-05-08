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

  const searchParams  = new URLSearchParams(location.search);
  const checkInParam  = searchParams.get("checkIn")  || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const adultsParam   = searchParams.get("adults")   || "";
  const childrenParam = searchParams.get("children") || "";
  const roomsParam    = searchParams.get("rooms")    || "";

  const saved = loadSearch();
  const [destination, setDestination] = useState(searchParams.get("q") || saved?.destination || "");
  const [checkIn,     setCheckIn]     = useState(checkInParam  ? new Date(checkInParam)  : saved?.checkIn  || null);
  const [checkOut,    setCheckOut]    = useState(checkOutParam ? new Date(checkOutParam) : saved?.checkOut || null);
  const [adults,      setAdults]      = useState(parseInt(adultsParam,   10) || saved?.adults   || 1);
  const [children,    setChildren]    = useState(parseInt(childrenParam, 10) || saved?.children || 0);
  const [rooms,       setRooms]       = useState(parseInt(roomsParam,    10) || saved?.rooms    || 1);

  useEffect(() => {
    saveSearch({ destination, checkIn, checkOut, adults, children, rooms });
  }, [destination, checkIn, checkOut, adults, children, rooms]);

  // Fetch whenever the URL changes — dispatch handles loading state, no setState here
  useEffect(() => {
    const sp   = new URLSearchParams(location.search);
    const dest = sp.get("q") || loadSearch()?.destination || "";
    if (!dest) return;
    fetchSearchResults(dest, dispatch, {
      checkIn:  sp.get("checkIn")  || "",
      checkOut: sp.get("checkOut") || "",
    });
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    return (state.searchResults || []).filter((p) => {
      if (state.stars && p.stars !== state.stars) return false;

      const price = parseFloat(
        p.currentPrice || p.current_price || p.originalPrice || p.original_price || 0,
      );
      if (price > 0 && price > state.budgetMax) return false;

      if (state.checkedReviewScores.length > 0) {
        const rating = parseFloat(p.avgRating || p.avg_rating || 0);
        const passes = state.checkedReviewScores.some((score) => {
          const min = parseFloat((score.match(/(\d+)\+/) || [])[1] || 0);
          return rating >= min;
        });
        if (!passes) return false;
      }

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

      if (state.checkedBedTypes.length > 0) {
        const roomList = Array.isArray(p.rooms) ? p.rooms : [];
        if (roomList.length > 0) {
          const bedValues = roomList.map((r) =>
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

  const resultCount = filtered.length;

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
                {state.loading
                  ? "Searching…"
                  : `${resultCount.toLocaleString()} propert${resultCount === 1 ? "y" : "ies"} found`}
              </div>
              <div className="search-filter-header-sub">
                {state.loading ? "Please wait…" : "Sorted by your preferences"}
              </div>
            </div>
          </div>

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
            <Results properties={filtered} loading={state.loading} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
