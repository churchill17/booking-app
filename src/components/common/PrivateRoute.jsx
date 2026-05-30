import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser, isTokenExpired } from "../../utils/authUser";

// ── Helper: check if a valid admin session exists ─────────────
function isAdminLoggedIn() {
  const token = localStorage.getItem("adminToken");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function GuestRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser("guest");
  if (!user || isTokenExpired()) {
    return <Navigate to="/log-in" state={{ from: location }} replace />;
  }
  return children;
}

export function HostRoute({ children }) {
  // Admin is allowed through any HostRoute — they have their own
  // auth token and should not be bounced to /list-property/login
  if (isAdminLoggedIn()) return children;

  const user = getStoredUser("host");
  if (!user || isTokenExpired()) {
    return <Navigate to="/list-property/login" replace />;
  }
  return children;
}