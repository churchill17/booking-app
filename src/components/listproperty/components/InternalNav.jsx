import { C } from "../ui.constants.js";
import "./InternalNav.css";
import ProfileMenu from "../../common/Header/ProfileMenu";
import { useRef, useState } from "react";

export default function InternalNav({ user, onHome }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileBtnRef = useRef(null);

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
            <ProfileMenu
              onClose={() => setShowProfileMenu(false)}
              anchorRef={profileBtnRef}
              role="host"
            />
          )}
        </div>
      )}
    </nav>
  );
}
