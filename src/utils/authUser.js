const AUTH_USER_KEY = "bookingUser";
const AUTH_TOKEN_KEY = "token";

export function getStoredUser() {
  try {
    const rawValue = localStorage.getItem(AUTH_USER_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!parsed?.firstName) return null;

    return {
      ...parsed,
      role: parsed?.role || "guest",
    };
  } catch {
    return null;
  }
}

export function storeUser(user) {
  const normalizedUser = {
    ...user,
    role: user?.role || "guest",
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function storeAuthToken(token) {
  if (!token) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthHeaders(extra = {}) {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

const AUTH_ERROR_MESSAGES = [
  "no token provided",
  "token expired",
  "invalid token",
  "unauthorized",
];

export function isAuthError(message) {
  const normalizedMessage = String(message || "")
    .toLowerCase()
    .trim();

  return AUTH_ERROR_MESSAGES.some((authMessage) =>
    normalizedMessage.includes(authMessage),
  );
}

export function handleAuthError(message, redirectPath = "/log-in") {
  if (!isAuthError(message)) return false;
  clearAuthToken();
  localStorage.removeItem("bookingUser");
  window.location.href = redirectPath;
  return true;
}
