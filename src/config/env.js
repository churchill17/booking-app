const bookingApiBaseUrl = import.meta.env.VITE_BOOKING_API_BASE_URL;

if (!bookingApiBaseUrl) {
  throw new Error(
    "Missing VITE_BOOKING_API_BASE_URL in .env. Add it and restart the dev server.",
  );
}

export const BOOKING_API_BASE_URL = bookingApiBaseUrl.replace(/\/+$/, "");
