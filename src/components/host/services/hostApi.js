import { getBookingApiUrl } from "../../../utils/api";
import { isTokenExpired, logoutUser } from "../../../utils/authUser";

const LIST_PROPERTY_URL = getBookingApiUrl("list_property.php");
const HOST_DASHBOARD_URL = getBookingApiUrl("host_dashboard.php");
const HOST_PROPERTIES_URL = getBookingApiUrl("host_properties.php");
const HOST_BOOKINGS_URL = getBookingApiUrl("host_bookings.php");
const GET_PROPERTIES_URL = getBookingApiUrl("get_properties.php");
const GET_PROPERTY_URL = getBookingApiUrl("get_property.php");
const BOOK_PROPERTY_URL = getBookingApiUrl("book_property.php");
const SEARCH_PROPERTIES_URL = getBookingApiUrl("search_properties.php");

const withAuthHeaders = (extra = {}) => {
  const token = localStorage.getItem("token");

  if (token && isTokenExpired()) {
    logoutUser();
    window.location.href = "/log-in";
    return { "Content-Type": "application/json", ...extra };
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

const readPayload = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const ensureSuccess = (response, payload, fallbackMessage) => {
  if (!response.ok || payload?.success === false) {
    const message = payload?.message || fallbackMessage;
    throw new Error(message);
  }
};

const normalizeHostProperty = (item) => {
  const isApproved = Number(item?.is_approved) === 1;
  return {
    raw: item,
    id: item?.id,
    propertyName: item?.name || "Untitled property",
    type: item?.type || "property",
    address: item?.address || "",
    city: item?.city || "",
    country: item?.country || "",
    originalPrice: item?.original_price || "",
    currentPrice: item?.current_price || "",
    availability: item?.availability || "",
    pricingType: item?.pricing_type || "per_night",
    checkInFrom: item?.checkInFrom || item?.check_in_from || "",
    checkInUntil: item?.checkInUntil || item?.check_in_until || "",
    checkOutFrom: item?.checkOutFrom || item?.check_out_from || "",
    checkOutUntil: item?.checkOutUntil || item?.check_out_until || "",
    weekendRate: item?.weekendRate || item?.weekend_rate || "",
    cleaningFee: item?.cleaningFee || item?.cleaning_fee || "",
    currency: item?.currency || "NGN",
    taxesIncluded:
      typeof item?.taxesIncluded !== "undefined"
        ? item.taxesIncluded
        : typeof item?.taxes_included !== "undefined"
          ? item.taxes_included
          : false,
    accommodations: item?.accommodations || "",
    descriptionFacilities:
      item?.descriptionFacilities || item?.description_facilities || "",
    descriptionDining:
      item?.descriptionDining || item?.description_dining || "",
    location: item?.location_description,
    status: isApproved ? "Approved" : "Pending Approval",
    isApproved,
    avgRating: Number(item?.avg_rating || 0),
    totalReviews: Number(item?.total_reviews || 0),
    totalBookings: Number(item?.total_bookings || 0),
    mainImage: item?.main_image || "",
    amenities: Array.isArray(item?.amenities) ? item.amenities : [],
    images: Array.isArray(item?.images) ? item.images : [],
    createdAt: item?.created_at || item?.createdAt || "",
    highlights: Array.isArray(item?.highlights) ? item.highlights : [],
    popularFacilities: Array.isArray(item?.popularFacilities)
      ? item.popularFacilities
      : [],
    rooms: Array.isArray(item?.rooms)
      ? item.rooms.map((room) => ({
          id: room.id,
          name: room.space_type || room.name || "Room",
          availability: room.availability || "",
          bedType: room.bed_type || "",
          size: room.size,
          features: room.features || [],
          amenities:
            room.amenities ||
            (Array.isArray(item?.amenities) ? item.amenities : []),
          choices: room.choices || [],
          originalPrice: room.originalPrice || room.original_price || "",
          currentPrice: room.currentPrice || room.current_price || "",
          discount: room.discount || "",
          deal: room.deal || "",
          guests: room.guests || item.guests || 1,
        }))
      : [],
    faqs: Array.isArray(item?.faqs) ? item.faqs : [],
    paymentMethods: Array.isArray(item?.paymentMethods)
      ? item.paymentMethods
      : [],
    apartment: item?.apartment || "",
    zipCode: item?.zipCode || item?.zip_code || "",
    aboutProperty: item?.aboutProperty || item?.about_property || "",
    facilities:
      typeof item?.facilities === "object" && item?.facilities !== null
        ? item.facilities
        : {},
    cancellation: item?.cancellation || "",
    excludeInfants: item?.exclude_infants ?? item?.excludeInfants ?? false,
    lastMinuteBookings:
      item?.last_minute_bookings ?? item?.lastMinuteBookings ?? false,
    smokingAllowed: item?.smoking_allowed ?? item?.smokingAllowed ?? false,
    childrenPolicy: item?.childrenPolicy || item?.children_policy || "",
    cotPolicy: item?.cotPolicy || item?.cot_policy || "",
    ageRestriction: item?.ageRestriction || item?.age_restriction || "",
    petsPolicy: item?.petsPolicy || item?.pets_policy || "",
    parties: item?.parties || item?.parties_policy || "",
    finePrint: item?.finePrint || item?.fine_print || "",
    // Legal/host fields
    firstName: item?.firstName || item?.first_name || "",
    middleName: item?.middleName || item?.middle_name || "",
    lastName: item?.lastName || item?.last_name || "",
    email: item?.email || "",
    phone: item?.phone || "",
    addressLine1: item?.addressLine1 || item?.address_line1 || "",
    addressLine2: item?.addressLine2 || item?.address_line2 || "",
    informationCertified:
      item?.informationCertified || item?.information_certified || "",
    termsAccepted: item?.termsAccepted || item?.terms_accepted || "",
  };
};

const normalizeHostBooking = (item) => {
  return {
    raw: item,
    id: item?.booking_id,
    propertyName: item?.property_name || "Untitled property",
    propertyType: item?.property_type || "property",
    propertyCity: item?.property_city || "",
    propertyImage: item?.property_image || "",
    guestFirstName: item?.guest_first_name || "",
    guestLastName: item?.guest_last_name || "",
    guestEmail: item?.guest_email || "",
    checkIn: item?.check_in || "",
    checkOut: item?.check_out || "",
    guests: Number(item?.guests || 0),
    totalPrice: Number(item?.total_price || 0),
    status: String(item?.status || "pending").toLowerCase(),
    paymentStatus: String(item?.payment_status || "unpaid").toLowerCase(),
    bookingDate: item?.booking_date || "",
  };
};

const normalizePublicProperty = (item) => {
  return {
    id: item?.id,
    type: item?.type || "property",
    mainImage: item?.main_image || "",
    images: Array.isArray(item?.images) ? item.images : [],
    name: item?.name || "",
    city: item?.city || "",
    country: item?.country || "",
    originalPrice: item?.original_price || "",
    currentPrice: item?.current_price || item?.price || "",
    avgRating: Number(item?.avg_rating || 0),
    rating: "",
    ratingLabel: "",
    reviewCount: "",
    description: item?.type,
    lastMinuteBookings: item?.lastMinuteBookings || false,
  };
};

async function requestJson(method, body) {
  const response = await fetch(LIST_PROPERTY_URL, {
    method,
    headers: withAuthHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await readPayload(response);
  return { response, payload };
}

async function requestJsonFromUrl(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: withAuthHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await readPayload(response);
  return { response, payload };
}

export async function getDashboardStats() {
  const { response, payload } = await requestJsonFromUrl(
    HOST_DASHBOARD_URL,
    "GET",
  );
  ensureSuccess(response, payload, "Could not load dashboard stats.");
  return {
    host: payload?.host || null,
    stats: payload?.stats || null,
  };
}

export async function searchListings(query) {
  const url = `${SEARCH_PROPERTIES_URL}?${query}`;
  const { response, payload } = await requestJsonFromUrl(url, "GET");
  ensureSuccess(response, payload, "Could not search properties.");

  // Extract properties and filter fields from backend payload
  function getRoomPrice(room) {
    const orig =
      room && room.originalPrice != null && !isNaN(Number(room.originalPrice))
        ? Number(room.originalPrice)
        : Infinity;
    const curr =
      room && room.currentPrice != null && !isNaN(Number(room.currentPrice))
        ? Number(room.currentPrice)
        : Infinity;
    return Math.min(orig, curr);
  }

  const properties = Array.isArray(payload?.properties)
    ? payload.properties.map((p, idx) => {
        // Normalize property fields for filterFields
        return {
          id: p.id ?? idx + 1,
          image: p.image ?? "",
          name: p.name ?? "Property",
          score: p.score ?? "",
          stars: p.stars ?? 0,
          location: p.location ?? "",
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
          availability: p.availability ?? "",
          price: p.price ?? "",
          ...normalizeHostProperty(p),
        };
      })
    : [];

  // Derive all filter options from the actual properties returned
  const rawList = Array.isArray(payload?.properties) ? payload.properties : [];

  function deriveFilters(list) {
    const typeCounts = {};
    const facilityCounts = {};
    const bedCounts = {};
    const prices = [];

    list.forEach((p) => {
      // Property types
      const t = (p.type || "").trim();
      if (t) typeCounts[t] = (typeCounts[t] || 0) + 1;

      // Facilities & amenities
      const facs = [
        ...(Array.isArray(p.amenities) ? p.amenities : []),
        ...(Array.isArray(p.popular_facilities ?? p.popularFacilities)
          ? (p.popular_facilities ?? p.popularFacilities)
          : []),
      ];
      facs.forEach((f) => {
        const label = typeof f === "string" ? f.trim() : f?.label?.trim();
        if (label) facilityCounts[label] = (facilityCounts[label] || 0) + 1;
      });

      // Bed types from rooms
      (Array.isArray(p.rooms) ? p.rooms : []).forEach((room) => {
        const bt = (room.bed_type ?? room.bedType ?? "").trim();
        if (bt) bedCounts[bt] = (bedCounts[bt] || 0) + 1;
      });

      // Prices for budget range
      const roomPrices = (Array.isArray(p.rooms) ? p.rooms : [])
        .map((r) =>
          Number(
            r.current_price ??
              r.currentPrice ??
              r.original_price ??
              r.originalPrice ??
              0,
          ),
        )
        .filter((n) => n > 0);
      if (roomPrices.length) {
        prices.push(...roomPrices);
      } else {
        const pp = Number(
          p.current_price ??
            p.currentPrice ??
            p.original_price ??
            p.originalPrice ??
            0,
        );
        if (pp > 0) prices.push(pp);
      }
    });

    const propertyTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));

    const facilities = Object.entries(facilityCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));

    const bedTypes = Object.entries(bedCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));

    const reviewScores = [
      { label: "Superb: 9+", min: 9 },
      { label: "Very good: 8+", min: 8 },
      { label: "Good: 7+", min: 7 },
      { label: "Pleasant: 6+", min: 6 },
    ]
      .map(({ label, min }) => ({
        label,
        count: list.filter((p) => Number(p.avg_rating ?? p.score ?? 0) >= min)
          .length,
      }))
      .filter((s) => s.count > 0);

    // Popular filters: most common property types + top facilities
    const popularFilters = [
      ...propertyTypes.slice(0, 2),
      ...facilities.slice(0, 4),
    ];

    const budgetMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
    const budgetMax = prices.length ? Math.ceil(Math.max(...prices)) : 300000;

    // Available star ratings from actual properties
    const starSet = new Set();
    list.forEach((p) => {
      const s = Number(p.stars ?? 0);
      if (s >= 1 && s <= 5) starSet.add(Math.round(s));
    });
    const availableStars = [...starSet].sort((a, b) => a - b);

    return {
      propertyTypes,
      facilities,
      bedTypes,
      reviewScores,
      popularFilters,
      budgetMin,
      budgetMax,
      availableStars,
    };
  }

  const derived = deriveFilters(rawList);

  return {
    properties,
    ...derived,
    paymentMethods: payload?.paymentMethods || [],
    currency: payload?.currency || "NGN",
    chips: payload?.chips || [],
  };
}

export async function getListings() {
  const { response, payload } = await requestJsonFromUrl(
    HOST_PROPERTIES_URL,
    "GET",
  );
  ensureSuccess(response, payload, "Could not load properties.");
  const properties = Array.isArray(payload?.properties)
    ? payload.properties
    : [];
  return properties.map(normalizeHostProperty);
}

export async function getPublicListings() {
  const response = await fetch(GET_PROPERTIES_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not load properties.");
  const properties = Array.isArray(payload?.properties)
    ? payload.properties
    : [];
  return properties.map(normalizePublicProperty);
}

export async function getBookings() {
  const { response, payload } = await requestJsonFromUrl(
    HOST_BOOKINGS_URL,
    "GET",
  );
  ensureSuccess(response, payload, "Could not load bookings.");
  const bookings = Array.isArray(payload?.bookings) ? payload.bookings : [];
  return bookings.map(normalizeHostBooking);
}

export async function createListing(input) {
  const payloadBody = {
    listing: input?.listing || input,
    legal: input?.legal || {},
  };
  const { response, payload } = await requestJson("POST", payloadBody);
  ensureSuccess(response, payload, "Could not create listing.");
  return payload;
}

export async function updateListing(id, updates) {
  // Separate legal from listing fields, then send in the shape
  // that update_property.php (and list_property.php) expect.
  const { legal, ...listingFields } = updates || {};
  const body = {
    property_id: id,
    listing: { ...listingFields, property_id: id },
    legal: legal || {},
  };
  const response = await fetch(getBookingApiUrl("update_property.php"), {
    method: "POST",
    headers: withAuthHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not update listing.");
  return payload;
}

export async function deleteListing(id) {
  const response = await fetch(getBookingApiUrl("delete_property.php"), {
    method: "DELETE",
    headers: withAuthHeaders(),
    body: JSON.stringify({ id }),
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not delete listing.");
  return payload;
}

// Normalizes a public property for StaysDetailsMain and related components
function normalizePublicPropertyDetails(item) {
  return {
    id: item?.id,
    name: item?.name || "",
    address: item?.address || "",
    city: item?.city || "",
    country: item?.country || "",
    type: item?.type || "property",
    mainImage: item?.main_image || "",
    images: Array.isArray(item?.images) ? item.images : [],
    originalPrice: item?.original_price || "",
    currentPrice: item?.current_price || "",
    rating: Number(item?.avg_rating || item?.rating || 0),
    avgRating: Number(item?.avg_rating || item?.rating || 0),
    totalReviews: Number(item?.total_reviews || 0),
    amenities: Array.isArray(item?.amenities) ? item.amenities : [],
    highlights: Array.isArray(item?.highlights) ? item.highlights : [],
    popularFacilities: Array.isArray(item?.popularFacilities)
      ? item.popularFacilities
      : [],
    rooms: (() => {
      const normalizeRoom = (room) => ({
        id: room.id,
        name: room.space_type || room.name || "Room",
        availability: room.availability || null,
        bedType: room.bed_type || room.bedType || "",
        size: room.size || "",
        features: Array.isArray(room.features)
          ? room.features.filter(Boolean)
          : room.features
            ? String(room.features)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        amenities: Array.isArray(room.amenities)
          ? room.amenities.filter(Boolean)
          : room.amenities
            ? String(room.amenities)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        choices: Array.isArray(room.choices)
          ? room.choices
          : room.choices
            ? String(room.choices)
                .split(",")
                .map((s) => s.trim())
            : [],
        originalPrice:
          room.originalPrice > 0
            ? room.originalPrice
            : room.original_price > 0
              ? room.original_price
              : "",
        currentPrice:
          room.currentPrice > 0
            ? room.currentPrice
            : room.current_price > 0
              ? room.current_price
              : "",
        discount: room.discount || "",
        deal: room.deal || "",
        guests: Number(room.guests || item?.guests || 1),
        pricingType: room.pricing_type || item?.pricing_type || "per night",
      });

      if (Array.isArray(item?.rooms) && item.rooms.length > 0) {
        return item.rooms.map(normalizeRoom);
      }

      // Fallback: build one row from property-level data so the table is never empty
      const propPrice = parseFloat(
        item?.current_price || item?.original_price || 0,
      );
      return [
        {
          id: "property-default",
          name: item?.name || "Standard Room",
          availability: null,
          bedType: item?.bed_type || "",
          size: item?.apartment_size
            ? `${item.apartment_size} ${item?.size_unit || "m²"}`.trim()
            : "",
          features: [],
          amenities: Array.isArray(item?.amenities)
            ? item.amenities.slice(0, 6)
            : [],
          choices: [],
          originalPrice:
            parseFloat(item?.original_price || 0) > 0
              ? parseFloat(item.original_price)
              : "",
          currentPrice: propPrice > 0 ? propPrice : "",
          discount: item?.discount || "",
          deal: "",
          guests: Number(item?.guests || 1),
          pricingType: item?.pricing_type || "per night",
        },
      ];
    })(),
    aboutProperty: item?.aboutProperty || item?.about_property || "",
    checkInFrom: item?.checkInFrom || item?.check_in_from || "",
    checkInUntil: item?.checkInUntil || item?.check_in_until || "",
    checkOutFrom: item?.checkOutFrom || item?.check_out_from || "",
    cancellation: item?.cancellation || "",
    checkOutUntil: item?.checkOutUntil || item?.check_out_until || "",
    smokingAllowed: item?.smoking_allowed ?? item?.smokingAllowed ?? false,
    childrenPolicy: item?.childrenPolicy || item?.children_policy || "",
    cotPolicy: item?.cotPolicy || item?.cot_policy || "",
    ageRestriction: item?.ageRestriction || item?.age_restriction || "",
    petsPolicy: item?.petsPolicy || item?.pets_policy || "",
    parties: item?.parties || item?.parties_policy || "",
    faqs: Array.isArray(item?.faqs) ? item.faqs : [],
    paymentMethods: Array.isArray(item?.paymentMethods)
      ? item.paymentMethods
      : [],
    facilities:
      typeof item?.facilities === "object" && item?.facilities !== null
        ? item.facilities
        : {
            bathroom: [],
            foodAndDrink: [],
            safety: [],
            bedroom: [],
            outdoors: [],
            kitchen: [],
            internet: "",
            parking: "",
            receptionServices: [],
            familyFriendly: [],
            general: [],
            wellness: [],
            cleaning: [],
            business: [],
            languages: [],
          },
    stars: item?.stars || 0,
    reviewCount: item?.reviewCount || 0,
    ratingLabel: item?.ratingLabel || "",
    locationScore: item?.locationScore || 0,
    coupleLocationScore: item?.coupleLocationScore || 0,
    accommodations: item?.accommodations || "",
    descriptionDining:
      item?.descriptionDining || item?.description_dining || "",
    location: item?.location_description || item?.location || "",
    finePrint: item?.finePrint || item?.fine_print || "",
    guestReviews: item?.guestReviews || {
      overall: item?.guestReviews?.overall || 0,
      totalReviews: item?.guestReviews?.totalReviews || 0,
      categories: item?.guestReviews?.categories || [],
      reviews: item?.guestReviews?.reviews || [],
    },
    currency: item?.currency || "NGN",
    taxesIncluded:
      typeof item?.taxesIncluded !== "undefined"
        ? item.taxesIncluded
        : typeof item?.taxes_included !== "undefined"
          ? item.taxes_included
          : false,
  };
}

export async function getPublicProperty(id) {
  const response = await fetch(`${GET_PROPERTY_URL}?id=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not load property.");
  return payload?.property
    ? normalizePublicPropertyDetails(payload.property)
    : null;
}

export async function createBooking(bookingData) {
  const response = await fetch(BOOK_PROPERTY_URL, {
    method: "POST",
    headers: withAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not complete booking.");
  return payload;
}
