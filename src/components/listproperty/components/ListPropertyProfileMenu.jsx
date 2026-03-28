import { logoutUser } from "../../../utils/authUser";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import "./ListPropertyProfileMenu.css";

export default function ListPropertyProfileMenu({ onClose, anchorRef }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  useLayoutEffect(() => {
    function updateMenuPosition() {
      if (anchorRef && anchorRef.current && menuRef.current) {
        // Use offsetTop/offsetLeft relative to the nearest positioned ancestor
        setMenuStyle({
          position: "absolute",
          top:
            anchorRef.current.offsetTop +
            anchorRef.current.offsetHeight +
            8 +
            "px",
          left: anchorRef.current.offsetLeft - 95 + "px", // Move left by 10px
          zIndex: 30,
        });
      }
    }
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [anchorRef]);

  const handleLogout = () => {
    logoutUser("host"); // Only logs out list property user
    onClose();
    navigate("/");
    window.location.reload();
  };
  return (
    <div
      className="list-property-profile-menu-overlay"
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
      }}
    >
      <div
        className="list-property-profile-menu-container"
        ref={menuRef}
        style={menuStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="list-property-profile-menu-close"
          onClick={onClose}
          aria-label="Close profile menu"
        >
          ×
        </button>
        <div className="list-property-profile-menu-actions">
          <button className="list-property-profile-menu-action">
            My Account
          </button>
          <button className="list-property-profile-menu-action">
            Bookings and Trips
          </button>
          <button className="list-property-profile-menu-action">Reviews</button>
          <button
            className="list-property-profile-menu-action list-property-profile-menu-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
