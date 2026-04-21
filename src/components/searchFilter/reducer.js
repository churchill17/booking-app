import { searchListings } from "../host/services/hostApi";

// Async function to fetch search results from backend via hostApi
export async function fetchSearchResults(query, dispatch) {
  try {
    const payload = await searchListings(query);
    // Hydrate all filter fields and searchResults from backend
    dispatch({ type: "HYDRATE_FROM_BACKEND", payload });
  } catch (error) {
    // Optionally handle error (e.g., show notification)
    console.error("Error fetching search results:", error);
  }
}
export const initialState = (raw = {}) => ({
  // Default property card fields for demo/example

  searchResults: raw.searchResults || [
    {
      id: 1,
      image: raw.mainImage || "",
      name: "Sample Property",
      score: 8.7,
      stars: 4,
      location: "Lagos",
      roomType: "Deluxe Room",
      availability: "Only 2 left!",
      price: "NGN 45,000",
    },
  ],
  chips: raw.chips || [],
  currency: raw.currency || "NGN",
  popularFilters: (() => {
    if (Array.isArray(raw.popularFilters) && raw.popularFilters.length > 0) {
      return raw.popularFilters;
    }
    // Compose Hotels and Apartments from propertyType
    const propertyType = raw.propertyType ? String(raw.propertyType) : "Hotel";
    const hotelsLabel = propertyType.endsWith("s")
      ? propertyType
      : propertyType + "s";
    const apartmentsLabel = "Apartments";
    // Compose facilities from popularFacilities
    const facilities = Array.isArray(raw.popularFacilities)
      ? raw.popularFacilities
      : [];
    function findFacility(label) {
      return facilities.find((f) =>
        typeof f === "string"
          ? f.toLowerCase() === label.toLowerCase()
          : f.label && f.label.toLowerCase() === label.toLowerCase(),
      );
    }
    const airportShuttle = findFacility("Airport shuttle");
    const freeWifi = findFacility("Free WiFi");
    const freeParking = findFacility("Free Parking");
    // Compose the popularFilters array
    const filters = [];
    filters.push({ label: hotelsLabel, count: 926 });
    const ratingLabel = raw.ratingLabel || "Very good";
    const rating = raw.rating || 8;
    filters.push({
      label: `${ratingLabel}: ${rating}+`,
      ratingLabel,
      rating,
      count: 401,
    });
    if (airportShuttle)
      filters.push({
        label: "Airport shuttle",
        count: airportShuttle.count || 536,
      });
    if (freeWifi)
      filters.push({ label: "Free WiFi", count: freeWifi.count || 1905 });
    filters.push({ label: apartmentsLabel, count: 1192 });
    if (freeParking)
      filters.push({ label: "Free Parking", count: freeParking.count || 2258 });
    return filters;
  })(),
  reviewScores: raw.reviewScores || [
    { label: "Superb: 9+", count: 213 },
    { label: "Very good: 8+", count: 401 },
    { label: "Good: 7+", count: 612 },
    { label: "Pleasant: 6+", count: 760 },
  ],
  checkedReviewScores: [],
  propertyTypes:
    raw.propertyTypes ||
    (raw.propertyType
      ? [{ label: raw.propertyType, count: 1 }]
      : [
          { label: "Entire homes & apartments", count: 1458 },
          { label: "Apartments", count: 1192 },
          { label: "Hotels", count: 926 },
          { label: "Guest houses", count: 102 },
          { label: "Holiday homes", count: 61 },
          { label: "Homestays", count: 46 },
          { label: "Bed and breakfasts", count: 31 },
          { label: "Resorts", count: 8 },
        ]),
  checkedPropertyTypes: [],
  facilities: raw.facilities || [
    { label: "Parking", count: 2258 },
    { label: "Restaurant", count: 822 },
    { label: "Room service", count: 971 },
    { label: "24-hour front desk", count: 948 },
    { label: "Fitness centre", count: 380 },
    { label: "Fitness", count: 199 },
    { label: "Live sport events", count: 183 },
    { label: "Spa and wellness", count: 180 },
  ],
  checkedFacilities: [],
  bedTypes: (
    raw.bedTypes || [
      { label: "Single bed", count: 0 },
      { label: "Double bed", count: 0 },
      { label: "Queen bed", count: 0 },
      { label: "King bed", count: 0 },
      { label: "Sofa bed", count: 0 },
      { label: "Bunk bed", count: 0 },
    ]
  ).map((b) => (typeof b === "string" ? { label: b, count: 0 } : b)),
  checkedBedTypes: [],
  amenities: raw.amenities || [
    "WiFi",
    "Air conditioning",
    "Heating",
    "Kitchen",
    "Washer",
    "Dryer",
    "Free parking",
    "Pool",
    "Hot tub",
    "TV",
    "Iron",
    "Hair dryer",
    "Breakfast",
    "Pets allowed",
    "Gym",
    "Elevator",
    "Smoke alarm",
    "Fire extinguisher",
  ],
  paymentMethods: raw.paymentMethods || [
    "Cash",
    "Credit card",
    "Debit card",
    "Bank transfer",
    "Mobile payment",
  ],
  destinations: raw.city || [],
  beachAccess: raw.beachAccess || [],
  budgetMin: raw.budgetMin || 0,
  budgetMax: raw.budgetMax || 300000,
  stars: raw.stars || 0,
  // smartQuery removed
  sort: raw.sort || "Top picks for solo travellers",
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
      // Hydrate all filter fields and searchResults from backend payload
      // Fallback for propertyTypes if backend returns nothing or empty
      const fallbackPropertyTypes = [
        { label: "Entire homes & apartments", count: 1458 },
        { label: "Apartments", count: 1192 },
        { label: "Hotels", count: 926 },
        { label: "Guest houses", count: 102 },
        { label: "Holiday homes", count: 61 },
        { label: "Homestays", count: 46 },
        { label: "Bed and breakfasts", count: 31 },
        { label: "Resorts", count: 8 },
      ];
      const safePropertyTypes =
        Array.isArray(action.payload?.propertyTypes) &&
        action.payload.propertyTypes.length > 0
          ? action.payload.propertyTypes
          : fallbackPropertyTypes;

      // Fallback for facilities if backend returns nothing or empty
      const fallbackFacilities = [
        { label: "Parking", count: 2258 },
        { label: "Restaurant", count: 822 },
        { label: "Room service", count: 971 },
        { label: "24-hour front desk", count: 948 },
        { label: "Fitness centre", count: 380 },
        { label: "Fitness", count: 199 },
        { label: "Live sport events", count: 183 },
        { label: "Spa and wellness", count: 180 },
      ];
      const safeFacilities =
        Array.isArray(action.payload?.facilities) &&
        action.payload.facilities.length > 0
          ? action.payload.facilities
          : fallbackFacilities;

      // Helper to add count to each filter item
      function addCount(arr, backendCount) {
        if (!Array.isArray(arr)) return [];
        const count =
          typeof backendCount === "number" ? backendCount : arr.length;
        return arr.map((item) => ({ ...item, count }));
      }

      // Helper to get the lowest price for a room (original or current)
      function getRoomPrice(room) {
        const orig =
          room &&
          room.originalPrice != null &&
          !isNaN(Number(room.originalPrice))
            ? Number(room.originalPrice)
            : Infinity;
        const curr =
          room && room.currentPrice != null && !isNaN(Number(room.currentPrice))
            ? Number(room.currentPrice)
            : Infinity;
        return Math.min(orig, curr);
      }

      const properties = action.payload?.properties || [];
      const normalizedProperties = properties.map((p, idx) => ({
        id: p.id ?? idx + 1,
        image: p.image ?? "",
        name: p.name ?? "Property",
        score: p.score ?? "",
        stars: p.stars ?? 0,
        location: p.location ?? "",
        // Find room with lowest price (original or current)
        roomType: (() => {
          if (!Array.isArray(p.rooms) || p.rooms.length === 0) return "";
          let minRoom = p.rooms[0];
          let minPrice = getRoomPrice(p.rooms[0]);
          for (let i = 1; i < p.rooms.length; i++) {
            const price = getRoomPrice(p.rooms[i]);
            if (price < minPrice) {
              minRoom = p.rooms[i];
              minPrice = price;
            }
          }
          return minRoom.name || "";
        })(),
        urgency: p.urgency ?? "",
        price: p.price ?? "",
        ...p,
      }));

      // Fallback to default popularFilters if backend returns none or empty
      const defaultPopularFilters = [
        { label: "Hotels", count: 926 },
        { label: "Very good: 8+", count: 401 },
        { label: "Airport shuttle", count: 536 },
        { label: "Free WiFi", count: 1905 },
        { label: "Apartments", count: 1192 },
        { label: "Parking", count: 2258 },
      ];
      const popularFilters = action.payload?.popularFilters;
      const normalizedPopularFilters =
        Array.isArray(popularFilters) && popularFilters.length > 0
          ? popularFilters
          : defaultPopularFilters;

      // Fallback to default reviewScores if backend returns none or empty
      const defaultReviewScores = [
        { label: "Superb: 9+", count: 213 },
        { label: "Very good: 8+", count: 401 },
        { label: "Good: 7+", count: 612 },
        { label: "Pleasant: 6+", count: 760 },
      ];
      const reviewScores = action.payload?.reviewScores;
      const normalizedReviewScores =
        Array.isArray(reviewScores) && reviewScores.length > 0
          ? reviewScores
          : defaultReviewScores;

      // Other fields
      const paymentMethods = action.payload?.paymentMethods || [];
      const destinations = action.payload?.destinations || [];
      const amenities = action.payload?.amenities || [];
      const defaultBedTypes = [
        { label: "Single bed", count: 0 },
        { label: "Double bed", count: 0 },
        { label: "Queen bed", count: 0 },
        { label: "King bed", count: 0 },
        { label: "Sofa bed", count: 0 },
        { label: "Bunk bed", count: 0 },
      ];
      let bedTypesRaw = action.payload?.bedTypes;
      if (!Array.isArray(bedTypesRaw) || bedTypesRaw.length === 0) {
        bedTypesRaw = defaultBedTypes;
      }
      const bedTypes = bedTypesRaw.map((b) =>
        typeof b === "string" ? { label: b, count: 0 } : b,
      );
      const chips = action.payload?.chips || [];
      const beachAccess = action.payload?.beachAccess || [];
      const budgetMin = action.payload?.budgetMin || 0;
      const budgetMax = action.payload?.budgetMax || 300000;
      const stars = action.payload?.stars || 0;
      const sort = action.payload?.sort || "Top picks for solo travellers";

      return {
        ...state,
        searchResults: normalizedProperties,
        paymentMethods,
        destinations,
        facilities: addCount(safeFacilities, action.payload?.facilitiesCount),
        amenities: Array.isArray(amenities) ? amenities : [],
        bedTypes: Array.isArray(bedTypes) ? bedTypes : [],
        propertyTypes: safePropertyTypes,
        chips: Array.isArray(chips) ? chips : [],
        reviewScores: normalizedReviewScores,
        checkedReviewScores: [],
        checkedPropertyTypes: [],
        checkedFacilities: [],
        checkedBedTypes: [],
        beachAccess: Array.isArray(beachAccess) ? beachAccess : [],
        budgetMin,
        budgetMax,
        currency: action.payload?.currency || "NGN",
        // bathrooms removed
        stars,
        sort,
        popularFilters: normalizedPopularFilters,
      };
    }
    default:
      return state;
  }
}
