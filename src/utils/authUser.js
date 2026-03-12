const AUTH_USER_KEY = "bookingUser";

export function getStoredUser() {
  try {
    const rawValue = localStorage.getItem(AUTH_USER_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!parsed?.firstName) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function storeUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}
