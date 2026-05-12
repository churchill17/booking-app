import { getBookingApiUrl } from "../../../utils/api";
import { isTokenExpired, logoutUser } from "../../../utils/authUser";

const LIST_PROPERTY_URL = getBookingApiUrl("list_property.php");
const HOST_DASHBOARD_URL = getBookingApiUrl("host_dashboard.php");
const HOST_PROPERTIES_URL = getBookingApiUrl("host_properties.php");
const HOST_BOOKINGS_URL = getBookingApiUrl("host_bookings.php");
const GET_PROPERTIES_URL = getBookingApiUrl("get_properties.php");
const GET_PROPERTY_URL = getBookingApiUrl("get_property.php");
const SEARCH_PROPERTIES_URL = getBookingApiUrl("search_properties.php");
const CREATE_BOOKING_URL = getBookingApiUrl("create_booking.php");
const DELETE_PROPERTY_URL = getBookingApiUrl("delete_property.php");
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
    popularFacilities: Array.isArray(item?.popular_facilities)
      ? item.popular_facilities
      : Array.isArray(item?.popularFacilities)
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
  const images = Array.isArray(item?.images) ? item.images : [];
  const firstImage =
    images[0]?.image_url ||
    images[0]?.src ||
    (typeof images[0] === "string" ? images[0] : "");
  return {
    id: item?.id,
    type: item?.type || "property",
    mainImage: item?.main_image || firstImage || "",
    images,
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
    lastMinuteBookings: item?.lastMinuteBookings ?? false,
    rooms: Array.isArray(item?.rooms)
      ? item.rooms.map((room) => ({
          id: room.id,
          originalPrice: room.originalPrice || room.original_price || "",
          currentPrice: room.currentPrice || room.current_price || "",
          discount: room.discount || "",
          deal: room.deal || "",
        }))
      : [],
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
async function requestPublicJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const payload = await readPayload(response);
  return { response, payload };
}

export async function searchListings(query) {
const url = `${SEARCH_PROPERTIES_URL}?${query}`;
const { response, payload } = await requestPublicJson(url);
  ensureSuccess(response, payload, "Could not search properties.");

  const rawList = Array.isArray(payload?.properties) ? payload.properties : [];

  const properties = rawList.map((p) => ({
    id: p.id,
    name: p.name ?? "Property",
    propertyName: p.name ?? "Property",
    type: p.type ?? "",
    city: p.city ?? "",
    country: p.country ?? "",
    location: p.city ?? "",
    mainImage: p.main_image ?? p.mainImage ?? "",
    images: Array.isArray(p.images) ? p.images : [],
    stars: p.stars ?? 0,
    avgRating: Number(p.avg_rating ?? p.avgRating ?? 0),
    score: Number(p.avg_rating ?? 0),
    ratingLabel: p.rating_label ?? p.ratingLabel ?? "",
    reviewCount: Number(p.total_reviews ?? p.reviewCount ?? 0),
    originalPrice: p.original_price ?? p.originalPrice ?? "",
    currentPrice: p.current_price ?? p.currentPrice ?? "",
    price: p.current_price ?? p.original_price ?? "",
    currency: p.currency ?? "NGN",
    taxesIncluded:
      typeof p.taxes_included !== "undefined"
        ? Boolean(p.taxes_included)
        : typeof p.taxesIncluded !== "undefined"
          ? Boolean(p.taxesIncluded)
          : false,
    availability: p.availability ?? "",
    lastMinuteBookings: Boolean(p.last_minute_bookings ?? p.lastMinuteBookings),
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    popularFacilities: Array.isArray(p.popular_facilities)
      ? p.popular_facilities
      : Array.isArray(p.popularFacilities)
        ? p.popularFacilities
        : [],
    rooms: Array.isArray(p.rooms)
      ? p.rooms.map((r) => ({
          id: r.id,
          name: r.name ?? r.space_type ?? "Room",
          bedType: r.bed_type ?? r.bedType ?? "",
          size: r.size ?? "",
          availability: r.availability ?? "",
          originalPrice: r.original_price ?? r.originalPrice ?? "",
          currentPrice: r.current_price ?? r.currentPrice ?? "",
          discount: r.discount ?? "",
          deal: r.deal ?? "",
        }))
      : [],
    roomType:
      Array.isArray(p.rooms) && p.rooms.length > 0
        ? (p.rooms[0].name ?? p.rooms[0].space_type ?? "")
        : "",
    faqs: Array.isArray(p.faqs) ? p.faqs : [],
    paymentMethods: Array.isArray(p.paymentMethods) ? p.paymentMethods : [],
  }));

  // Derive filter metadata from results
  const typeCounts = {};
  const bedTypeCounts = {};
  const prices = [];

  rawList.forEach((p) => {
    const t = (p.type || "").trim();
    if (t) typeCounts[t] = (typeCounts[t] || 0) + 1;

    (p.rooms || []).forEach((r) => {
      const bt = (r.bed_type || r.bedType || "").trim();
      if (bt) bedTypeCounts[bt] = (bedTypeCounts[bt] || 0) + 1;
    });

    const price = Number(p.current_price || p.original_price || 0);
    if (price > 0) prices.push(price);
  });

  return {
    properties,
    propertyTypes: Object.entries(typeCounts).map(([label, count]) => ({
      label,
      count,
    })),
    facilities: payload?.facilities ?? [],
    amenities: payload?.amenities ?? [],
    paymentMethods: payload?.paymentMethods ?? [],
    bedTypes: Object.entries(bedTypeCounts).map(([label, count]) => ({
      label,
      count,
    })),
reviewScores: (() => {
  const thresholds = [
    { label: "9+: Exceptional",  min: 9.0 },
    { label: "8+: Very Good",    min: 8.0 },
    { label: "7+: Good",         min: 7.0 },
    { label: "6+: Pleasant",     min: 6.0 },
  ];
  return thresholds
    .map(({ label, min }) => ({
      label,
      count: rawList.filter(p => Number(p.avg_rating || 0) >= min).length,
    }))
    .filter(s => s.count > 0);
})(),
popularFilters: [
  ...Object.entries(typeCounts).slice(0, 2).map(([label, count]) => ({ label, count })),
  ...(payload?.facilities || []).slice(0, 3),
],
    budgetMin: prices.length ? Math.floor(Math.min(...prices)) : 0,
    budgetMax: prices.length ? Math.ceil(Math.max(...prices)) : 300000,
    availableStars: [],
    currency: payload?.currency ?? "NGN",
    chips: [],
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
  const response = await fetch(DELETE_PROPERTY_URL, {
    method: "DELETE",
    headers: withAuthHeaders(),
    body: JSON.stringify({ id }),
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not delete listing.");
  return payload;
}

/** Recursively unwrap multi-serialised JSON until we have plain strings. */
function toStringArr(v, depth = 0) {
  if (!v || depth > 8) return [];
  if (Array.isArray(v)) {
    const out = [];
    for (const item of v) {
      if (typeof item !== "string") continue;
      const t = item.trim();
      if (t.startsWith("[") || t.startsWith('"')) {
        try {
          out.push(...toStringArr(JSON.parse(t), depth + 1));
          continue;
        } catch {
          /* plain */
        }
      }
      if (t) out.push(item);
    }
    return [...new Set(out)];
  }
  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("[") || t.startsWith('"')) {
      try {
        return toStringArr(JSON.parse(t), depth + 1);
      } catch {
        /* fall through */
      }
    }
    return t ? [t] : [];
  }
  return [];
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
    popularFacilities: Array.isArray(item?.popular_facilities)
      ? item.popular_facilities
      : Array.isArray(item?.popularFacilities)
        ? item.popularFacilities
        : [],
    rooms: (() => {
      const normalizeRoom = (room) => ({
        id: room.id,
        name: room.space_type || room.name || "Room",
        availability: room.availability || null,
        bedType: room.bed_type || room.bedType || "",
        size: room.size || "",
        features: room.features,
        amenities: room.amenities,
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
        allowChildren: room.allow_children !== undefined
  ? Number(room.allow_children) === 1
  : true,
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
          name: "Standard Room",
          availability: null,
          bedType: item?.bed_type || "",
          size: item?.apartment_size
            ? `${item.apartment_size} ${item?.size_unit || "m²"}`.trim()
            : "",
          features: [],
          amenities: Array.isArray(item?.amenities)
            ? item.amenities.slice(0, 6)
            : [],
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
    stars: item?.stars || 0,
    reviewCount: item?.reviewCount || 0,
    ratingLabel: item?.ratingLabel || "",
    locationScore: item?.locationScore || 0,
    coupleLocationScore: item?.coupleLocationScore || 0,
    accommodations: toStringArr(item?.accommodations),
    descriptionDining: toStringArr(
      item?.descriptionDining || item?.description_dining,
    ),
    location: toStringArr(item?.location_description || item?.location),
    finePrint: item?.finePrint || item?.fine_print || "",
    guestReviews: item?.guestReviews
      ? {
          overall: item.guestReviews.overall || 0,
          totalReviews: item.guestReviews.totalReviews || 0,
          categories: Array.isArray(item.guestReviews.categories)
            ? item.guestReviews.categories
            : [],
          reviews: Array.isArray(item.guestReviews.reviews)
            ? item.guestReviews.reviews
            : [],
        }
      : { overall: 0, totalReviews: 0, categories: [], reviews: [] },
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
  const response = await fetch(CREATE_BOOKING_URL, {
    method: "POST",
    headers: withAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not create booking.");
  return payload;
}
