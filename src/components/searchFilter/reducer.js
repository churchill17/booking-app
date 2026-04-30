import { searchListings } from "../host/services/hostApi";

export async function fetchSearchResults(query, dispatch, params = {}) {
  try {
    const searchQuery = [
      query ? `q=${encodeURIComponent(query)}` : '',
      params.checkIn  ? `checkIn=${params.checkIn}`   : '',
      params.checkOut ? `checkOut=${params.checkOut}` : '',
      params.guests   ? `guests=${params.guests}`     : '',
    ].filter(Boolean).join('&');

    console.log("Searching:", searchQuery);  // confirm this fires
    const payload = await searchListings(searchQuery);
    console.log("Results:", payload.properties?.length);  // confirm results arrive
    dispatch({ type: "HYDRATE_FROM_BACKEND", payload });
  } catch (error) {
    console.error("Search error:", error.message);
    dispatch({ type: "HYDRATE_FROM_BACKEND", payload: { properties: [] } });
  }
}
export const initialState = () => ({
  searchResults: [],
  chips: [],
  currency: "NGN",
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
        currency: p.currency || "NGN",
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
