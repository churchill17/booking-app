import { Navigate } from "react-router-dom";
import { getStoredUser, isTokenExpired } from "../../utils/authUser";

export function GuestRoute({ children }) {
  const user = getStoredUser("guest");
  if (!user || isTokenExpired()) {
    return <Navigate to="/log-in" replace />;
  }
  return children;
}

export function HostRoute({ children }) {
  const user = getStoredUser("host");
  if (!user || isTokenExpired()) {
    return <Navigate to="/list-property/login" replace />;
  }
  return children;
}