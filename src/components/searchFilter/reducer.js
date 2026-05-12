import { searchListings } from "../host/services/hostApi";

export async function fetchSearchResults(query, dispatch, params = {}) {
  dispatch({ type: "SET_LOADING", value: true });
  try {
    const sp = new URLSearchParams(window.location.search);
    const guests =
      params.guests ||
      parseInt(sp.get("adults") || "1") + parseInt(sp.get("children") || "0");

    const searchQuery = [
      query ? `q=${encodeURIComponent(query)}` : "",
      params.checkIn ? `checkIn=${params.checkIn}` : "",
      params.checkOut ? `checkOut=${params.checkOut}` : "",
      guests > 0 ? `guests=${guests}` : "",
    ]
      .filter(Boolean)
      .join("&");

    const payload = await searchListings(searchQuery);
    dispatch({ type: "HYDRATE_FROM_BACKEND", payload });
  } catch (error) {
    console.error("Search error:", error.message);
    dispatch({ type: "HYDRATE_FROM_BACKEND", payload: { properties: [] } });
  } finally {
    dispatch({ type: "SET_LOADING", value: false });
  }
}
export const initialState = () => ({
  loading: false,
  searchResults: [],
  chips: [],
  currency: "₦",
  popularFilters: [],
  reviewScores: [],
  checkedReviewScores: [],
  propertyTypes: [],
  checkedPropertyTypes: [],
  facilities: [],
  checkedFacilities: [],
  bedTypes: [],
  checkedBedTypes: [],
  amenities: [],
  paymentMethods: [],
  destinations: [],
  beachAccess: [],
  budgetMin: 0,
  budgetMax: 300000,
  stars: 0,
  availableStars: [],
  sort: "Top picks for solo travellers",
});

export function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET":
      return { ...state, [action.key]: action.val };
    case "TOGGLE_ARRAY": {
      // Generic toggle for checked arrays
      const { key, val } = action;
      const arr = state[key] || [];
      const exists = arr.includes(val);
      return {
        ...state,
        [key]: exists ? arr.filter((v) => v !== val) : [...arr, val],
      };
    }
    case "HYDRATE_FROM_BACKEND": {
      const p = action.payload || {};
      const properties = Array.isArray(p.properties) ? p.properties : [];

      return {
        ...state,
        searchResults: properties,
        popularFilters: Array.isArray(p.popularFilters) ? p.popularFilters : [],
        reviewScores: Array.isArray(p.reviewScores) ? p.reviewScores : [],
        propertyTypes: Array.isArray(p.propertyTypes) ? p.propertyTypes : [],
        facilities: Array.isArray(p.facilities) ? p.facilities : [],
        bedTypes: (Array.isArray(p.bedTypes) ? p.bedTypes : []).map((b) =>
          typeof b === "string" ? { label: b, count: 0 } : b,
        ),
        amenities: Array.isArray(p.amenities) ? p.amenities : [],
        paymentMethods: Array.isArray(p.paymentMethods) ? p.paymentMethods : [],
        chips: Array.isArray(p.chips) ? p.chips : [],
        beachAccess: Array.isArray(p.beachAccess) ? p.beachAccess : [],
        budgetMin: p.budgetMin ?? 0,
        budgetMax: p.budgetMax ?? 300000,
        currency: p.currency || "₦",
        stars: p.stars || 0,
        availableStars: Array.isArray(p.availableStars) ? p.availableStars : [],
        sort: p.sort || state.sort,
        checkedReviewScores: [],
        checkedPropertyTypes: [],
        checkedFacilities: [],
        checkedBedTypes: [],
      };
    }
    default:
      return state;
  }
}
