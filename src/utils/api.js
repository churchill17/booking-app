import { BOOKING_API_BASE_URL } from "../config/env";

export function getBookingApiUrl(path) {
  const normalizedPath = String(path).replace(/^\/+/, "");
  return `${BOOKING_API_BASE_URL}/${normalizedPath}`;
}
