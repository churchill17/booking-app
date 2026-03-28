const AUTH_USER_KEY = "bookingUser"; // guest
const LIST_PROPERTY_USER_KEY = "listPropertyUser"; // host/list property

// Get user by type: 'guest' (default) or 'host'
export function getStoredUser(type = "guest") {
  const key = type === "host" ? LIST_PROPERTY_USER_KEY : AUTH_USER_KEY;
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;
    const parsed = JSON.parse(rawValue);
    if (!parsed?.firstName) return null;
    return {
      ...parsed,
      role: parsed?.role || (type === "host" ? "host" : "guest"),
    };
  } catch {
    return null;
  }
}

// Store user by type: 'guest' (default) or 'host'
export function storeUser(user, type = "guest") {
  const key = type === "host" ? LIST_PROPERTY_USER_KEY : AUTH_USER_KEY;
  const normalizedUser = {
    ...user,
    role: user?.role || (type === "host" ? "host" : "guest"),
  };
  localStorage.setItem(key, JSON.stringify(normalizedUser));
}

// Logout user by type: 'guest' (default) or 'host'
export function logoutUser(type = "guest") {
  const key = type === "host" ? LIST_PROPERTY_USER_KEY : AUTH_USER_KEY;
  localStorage.removeItem(key);
  // Only remove token if logging out guest (global)
  if (type === "guest") {
    localStorage.removeItem("token");
  }
}
