import { getBookingApiUrl } from "../../../utils/api";
import { isTokenExpired, logoutUser } from "../../../utils/authUser";

const LIST_PROPERTY_URL = getBookingApiUrl("list_property.php");
const HOST_DASHBOARD_URL = getBookingApiUrl("host_dashboard.php");
const HOST_PROPERTIES_URL = getBookingApiUrl("host_properties.php");
const HOST_BOOKINGS_URL = getBookingApiUrl("host_bookings.php");
const GET_PROPERTIES_URL = getBookingApiUrl("get_properties.php");
const GET_PROPERTY_URL = getBookingApiUrl("get_property.php");

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
  const url = `${LIST_PROPERTY_URL}?search=${encodeURIComponent(query)}`;
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

  // Compose popularFilters using propertyType and popularFacilities
  const propertyType = payload?.propertyType
    ? String(payload.propertyType)
    : "Hotel";
  const hotelsLabel = propertyType.endsWith("s")
    ? propertyType
    : propertyType + "s";
  const apartmentsLabel = "Apartments";
  const facilities = Array.isArray(payload?.popularFacilities)
    ? payload.popularFacilities
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
  const filters = [];
  filters.push({ label: hotelsLabel, count: 926 });
  const ratingLabel = payload?.ratingLabel || "Very good";
  const rating = payload?.rating || 8;
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

  const filterFields = {
    paymentMethods: payload?.paymentMethods || [],
    destinations: payload?.city || [],
    facilities: payload?.facilities || [],
    amenities: payload?.amenities || [],
    bedTypes: payload?.bedTypes || [],
    propertyTypes: payload?.propertyTypes || [],
    chips: payload?.chips || [],
    reviewScores: payload?.reviewScores || [],
    beachAccess: payload?.beachAccess || [],
    budgetMin: payload?.budgetMin,
    budgetMax: payload?.budgetMax,
    stars: payload?.stars,
    sort: payload?.sort,
    popularFilters: filters,
    currency: payload?.currency || "NGN",
  };

  return {
    properties,
    ...filterFields,
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
  const updateBody = {
    action: "update",
    id,
    listingId: id,
    listing_id: id,
    updates,
  };
  try {
    const { response, payload } = await requestJson("PUT", updateBody);
    ensureSuccess(response, payload, "Could not update listing.");
    return payload;
  } catch (error) {
    return error;
  }
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
    currentPrice: item?.current_price,
    rating: Number(item?.rating || 0),
    totalReviews: Number(item?.total_reviews || 0),
    amenities: Array.isArray(item?.amenities) ? item.amenities : [],
    highlights: Array.isArray(item?.highlights) ? item.highlights : [],
    popularFacilities: Array.isArray(item?.popularFacilities)
      ? item.popularFacilities
      : [],
    rooms: Array.isArray(item?.rooms)
      ? item.rooms.map((room) => ({
          id: room.id,
          name: room.space_type || room.name || "Room",
          availability: room.availability || null,
          bedType: room.bed_type || room.bedType || "",
          size: room.size || "27 m²",
          features: Array.isArray(room.features)
            ? room.features
            : room.features
              ? String(room.features).split(",")
              : [],
          amenities: Array.isArray(room.amenities)
            ? room.amenities
            : room.amenities
              ? String(room.amenities).split(",")
              : [],
          choices: Array.isArray(room.choices)
            ? room.choices
            : room.choices
              ? String(room.choices).split(",")
              : [],
          originalPrice: room.originalPrice || room.original_price || "",
          currentPrice: room.currentPrice || room.current_price || "",
          discount: room.discount || "",
          deal: room.deal || "",
          guests: room.guests || item.guests || 1,
        }))
      : [],
    aboutProperty: item?.aboutProperty || item?.about_property || "",
    location: item?.location_description || item.location || "",
    checkInFrom: item?.checkInFrom || item?.check_in_from || "",
    checkInUntil: item?.checkInUntil || item?.check_in_until || "",
    checkOutFrom: item?.checkOutFrom || item?.check_out_from || "",
    checkOutUntil: item?.checkOutUntil || item?.check_out_until || "",
    petsPolicy: item?.petsPolicy || item?.pets_policy || item?.pets || "",
    parties:
      item?.parties || item?.parties_policy || item?.parties_allowed || "",
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
    descriptionFacilities:
      item?.descriptionFacilities || item?.description_facilities || "",
    descriptionDining:
      item?.descriptionDining || item?.description_dining || "",
    childrenPolicy: item?.childrenPolicy || item?.children_policy || "",
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
