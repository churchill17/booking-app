const AUTH_USER_KEY_GUEST = "bookingGuest";
const AUTH_USER_KEY_HOST = "bookingHost";

function getKey(role) {
  return role === "host" ? AUTH_USER_KEY_HOST : AUTH_USER_KEY_GUEST;
}

export function getStoredUser(role = "guest") {
  try {
    const rawValue = localStorage.getItem(getKey(role));
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);
    if (!parsed?.firstName) return null;

    return {
      ...parsed,
      role: parsed?.role || role,
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
  localStorage.setItem(
    getKey(normalizedUser.role),
    JSON.stringify(normalizedUser),
  );
}

export function logoutUser(role = "guest") {
  localStorage.removeItem(getKey(role));
  localStorage.removeItem("token");
}
