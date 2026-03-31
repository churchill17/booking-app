import { getBookingApiUrl } from "../../../utils/api";

const LIST_PROPERTY_URL = getBookingApiUrl("list_property.php");
const HOST_DASHBOARD_URL = getBookingApiUrl("host_dashboard.php");
const HOST_PROPERTIES_URL = getBookingApiUrl("host_properties.php");
const HOST_BOOKINGS_URL = getBookingApiUrl("host_bookings.php");
const GET_PROPERTIES_URL = getBookingApiUrl("get_properties.php");
const GET_PROPERTY_URL = getBookingApiUrl("get_property.php");

// Simple auth header using token from localStorage
const withAuthHeaders = (extra = {}) => {
  const token = localStorage.getItem("token");
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
  const isAvailable = Number(item?.is_available) === 1;
  return {
    raw: item,
    id: item?.id,
    propertyName: item?.name || "Untitled property",
    type: item?.type || "property",
    address: item?.address || "",
    city: item?.city || "",
    country: item?.country || "",
    price: item?.price || item?.nightly_rate || "",
    pricingType: item?.pricing_type || "per_night",
    status: isApproved ? "Approved" : "Pending Approval",
    isApproved,
    isAvailable,
    avgRating: Number(item?.avg_rating || 0),
    totalReviews: Number(item?.total_reviews || 0),
    totalBookings: Number(item?.total_bookings || 0),
    mainImage: item?.main_image || "",
    amenities: Array.isArray(item?.amenities) ? item.amenities : [],
    images: Array.isArray(item?.images) ? item.images : [],
    createdAt: item?.created_at || item?.createdAt || "",
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
    price: item?.nightly_rate || item?.price || "",
    avgRating: Number(item?.avg_rating || 0),
    amenities: Array.isArray(item?.amenities) ? item.amenities : [],
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
  const deleteBody = { action: "delete", id, listingId: id, listing_id: id };
  try {
    const { response, payload } = await requestJson("DELETE", deleteBody);
    ensureSuccess(response, payload, "Could not delete listing.");
    return payload;
  } catch (error) {
    return error;
  }
}

export async function getPublicProperty(id) {
  const response = await fetch(`${GET_PROPERTY_URL}?id=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const payload = await readPayload(response);
  ensureSuccess(response, payload, "Could not load property.");
  return payload?.property || null;
}
