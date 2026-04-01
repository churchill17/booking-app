import "./InternalNav.css";
import { useRef, useState, useEffect } from "react";
import ListPropertyProfileMenu from "./ListPropertyProfileMenu.jsx";
import { getStoredUser } from "../../../utils/authUser";

export default function InternalNav({ onHome }) {
  const [user, setUser] = useState(() => getStoredUser("host"));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileBtnRef = useRef(null);

  useEffect(() => {
    const updateUser = () => setUser(getStoredUser("host"));
    updateUser();
    window.addEventListener("visibilitychange", updateUser);
    return () => window.removeEventListener("visibilitychange", updateUser);
  }, []);

  return (
    <nav className="lp-internal-nav">
      <button className="lp-internal-nav__back" onClick={onHome} />
      {user && (
        <div className="lp-internal-nav__user" style={{ position: "relative" }}>
          <div
            className="lp-internal-nav__avatar"
            ref={profileBtnRef}
            onClick={() => setShowProfileMenu((v) => !v)}
            style={{ cursor: "pointer" }}
          >
            {user.firstName?.[0]?.toUpperCase()}
          </div>
          <span
            className="lp-internal-nav__name"
            onClick={() => setShowProfileMenu((v) => !v)}
            style={{ cursor: "pointer" }}
          >
            {user.firstName}
          </span>
          {showProfileMenu && (
            <ListPropertyProfileMenu
              onClose={() => setShowProfileMenu(false)}
              anchorRef={profileBtnRef}
            />
          )}
        </div>
      )}
    </nav>
  );
}
