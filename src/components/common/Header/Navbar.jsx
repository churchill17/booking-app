import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useRef } from "react";
import { useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { getStoredUser } from "../../../utils/authUser";
import "./Navbar.css";
import logo from "../../../assets/img/logo.jpeg";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileHint, setShowProfileHint] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = getStoredUser("guest");
  const profileBtnRef = useRef(null);
  const mobileProfileBtnRef = useRef(null);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function openProfileMenu(buttonEl) {
    profileBtnRef.current = buttonEl;
    closeMenu();
    setShowProfileMenu(true);
  }

  function handleProfileClick(e) {
    if (user) {
      openProfileMenu(e.currentTarget);
      return;
    }
    if (!showProfileHint) {
      setShowProfileHint(true);
      setTimeout(() => setShowProfileHint(false), 1300);
      return;
    }
    setShowProfileHint(false);
    navigate("/log-in");
  }

  return (
    <>
      {showProfileMenu && user && (
        <ProfileMenu
          user={user}
          onClose={() => setShowProfileMenu(false)}
          anchorRef={profileBtnRef}
        />
      )}
      <div className="nav">
        <div className="site-header-logo">
          <img src={logo} alt="" />
        </div>

        <div className="nav-mobile-actions">
          {user ? (
            <button
              ref={mobileProfileBtnRef}
              className="nav-profile-btn nav-profile-btn--named"
              aria-label="Profile menu"
              onClick={() => openProfileMenu(mobileProfileBtnRef.current)}
            >
              <IoPersonCircleOutline size={24} />
              <span className="nav-profile-name">{user.firstName}</span>
            </button>
          ) : (
            <div className="nav-profile-btn-wrapper">
              <button
                className="nav-profile-btn"
                aria-label="Profile"
                onMouseEnter={() => setShowProfileHint(true)}
                onMouseLeave={() => setShowProfileHint(false)}
                onFocus={() => setShowProfileHint(true)}
                onBlur={() => setShowProfileHint(false)}
                onClick={() => navigate("/log-in")}
              >
                <IoPersonCircleOutline size={28} />
              </button>
              {showProfileHint && (
                <div className="nav-profile-hint-mobile">Sign in</div>
              )}
            </div>
          )}
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>

        <nav className={`nav-bar ${isMenuOpen ? "nav-bar-open" : ""}`}>
          <button
            type="button"
            className="nav-close-btn"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            &#x2715;
          </button>

          <ul className="nav-list">
            <li>
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link-active" : ""
                }
              >
                Stays
              </NavLink>
            </li>
          </ul>

          <Link to="/list-property" onClick={closeMenu}>
            List your property
          </Link>
          {user ? (
            <button
              className="nav-auth-btn nav-auth-btn-profile"
              onClick={handleProfileClick}
              ref={profileBtnRef}
            >
              <IoPersonCircleOutline size={22} />
              <span>{user.firstName}</span>
            </button>
          ) : (
            <>
              <button
                className="nav-auth-btn"
                onClick={() => {
                  closeMenu();
                  navigate("/sign-up");
                }}
              >
                Sign up
              </button>
              <button
                className="nav-auth-btn"
                onClick={() => {
                  closeMenu();
                  navigate("/log-in");
                }}
              >
                Log in
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Navbar;
