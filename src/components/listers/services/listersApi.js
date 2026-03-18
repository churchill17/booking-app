import { getBookingApiUrl } from "../../../utils/api";

const LIST_PROPERTY_URL = getBookingApiUrl("list_property.php");

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
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const ensureSuccess = (response, payload, fallbackMessage) => {
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || fallbackMessage);
  }
};

const normalizeListing = (item) => {
  const listing = item?.listing || {};
  const legal = item?.legal || {};

  const id =
    item?.id ||
    item?.listing_id ||
    item?.property_id ||
    item?.propertyId ||
    item?._id ||
    listing?.id ||
    listing?.listing_id;

  return {
    raw: item,
    id,
    propertyName:
      listing?.propertyName ||
      item?.propertyName ||
      item?.property_name ||
      item?.name ||
      "Untitled property",
    address: listing?.address || item?.address || "",
    city: listing?.city || item?.city || "",
    country: listing?.country || item?.country || "",
    status:
      item?.status || item?.listing_status || listing?.status || "Pending",
    createdAt: item?.created_at || item?.createdAt || "",
    price: item?.price || item?.nightly_rate || item?.nightlyRate || "",
    legal,
    listing,
  };
};

const extractListings = (payload) => {
  const candidates = [
    payload?.listings,
    payload?.data,
    payload?.results,
    payload?.items,
  ];

  const list = candidates.find(Array.isArray) || [];
  return list.map(normalizeListing);
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

export async function getListings() {
  try {
    const { response, payload } = await requestJson("GET");
    ensureSuccess(response, payload, "Could not load listings.");
    return extractListings(payload);
  } catch {
    const { response, payload } = await requestJson("POST", {
      action: "list",
    });
    ensureSuccess(response, payload, "Could not load listings.");
    return extractListings(payload);
  }
}

export async function createListing(input) {
  const payloadBody = {
    action: "create",
    role: "host",
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
  } catch {
    const { response, payload } = await requestJson("POST", updateBody);
    ensureSuccess(response, payload, "Could not update listing.");
    return payload;
  }
}

export async function deleteListing(id) {
  const deleteBody = {
    action: "delete",
    id,
    listingId: id,
    listing_id: id,
  };

  try {
    const { response, payload } = await requestJson("DELETE", deleteBody);
    ensureSuccess(response, payload, "Could not delete listing.");
    return payload;
  } catch {
    const { response, payload } = await requestJson("POST", deleteBody);
    ensureSuccess(response, payload, "Could not delete listing.");
    return payload;
  }
}
