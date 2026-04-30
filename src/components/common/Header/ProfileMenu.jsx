import { logoutUser } from "../../../utils/authUser";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import "./ProfileMenu.css";

export default function ProfileMenu({ onClose, anchorRef }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  useLayoutEffect(() => {
    function updateMenuPosition() {
      if (anchorRef && anchorRef.current && menuRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setMenuStyle({
          position: "fixed",
          top: rect.bottom + 8 + "px",
          right: window.innerWidth - rect.right + "px",
          zIndex: 2000,
        });
      }
    }
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [anchorRef]);

  const handleLogout = () => {
    logoutUser("guest");
    onClose();
    navigate("/");
    window.location.reload();
  };
  return (
    <div
      className="profile-menu-overlay"
      onClick={onClose}
    >
      <div
        className="profile-menu-container"
        ref={menuRef}
        style={menuStyle}
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
          <button
            className="profile-menu-action"
            onClick={() => {
              onClose();
              navigate("/reviews");
            }}
          >
            Reviews
          </button>
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
