const AUTH_USER_KEY = "bookingUser";

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
