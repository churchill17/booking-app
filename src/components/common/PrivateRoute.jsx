import { Navigate, useLocation } from "react-router-dom";
import { getStoredUser, isTokenExpired } from "../../utils/authUser";

export function GuestRoute({ children }) {
  const location = useLocation();
  const user = getStoredUser("guest");
  if (!user || isTokenExpired()) {
    return <Navigate to="/log-in" state={{ from: location }} replace />;
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