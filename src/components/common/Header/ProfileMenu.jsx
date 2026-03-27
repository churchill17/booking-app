import { logoutUser } from "../../../utils/authUser";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css";

export default function ProfileMenu({ onClose }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    onClose();
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="profile-menu-overlay" onClick={onClose}>
      <div
        className="profile-menu-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="profile-menu-close"
          onClick={onClose}
          aria-label="Close profile menu"
        >
          ×
        </button>
        <div className="profile-menu-actions">
          <button className="profile-menu-action">My Account</button>
          <button className="profile-menu-action">Bookings and Trips</button>
          <button className="profile-menu-action">Reviews</button>
          <button
            className="profile-menu-action profile-menu-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
