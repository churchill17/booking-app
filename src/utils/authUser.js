const AUTH_USER_KEY = "bookingUser";
const LIST_PROPERTY_USER_KEY = "listPropertyUser";

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

export function storeUser(user, type = "guest") {
  const key = type === "host" ? LIST_PROPERTY_USER_KEY : AUTH_USER_KEY;
  const normalizedUser = {
    ...user,
    role: user?.role || (type === "host" ? "host" : "guest"),
  };
  localStorage.setItem(key, JSON.stringify(normalizedUser));
}


export function logoutUser(type = "guest") {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(LIST_PROPERTY_USER_KEY);
  localStorage.removeItem("token");
}

export function isTokenExpired() {
  const token = localStorage.getItem("token");
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}