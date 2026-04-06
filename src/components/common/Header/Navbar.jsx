import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useRef } from "react";
import { useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { getStoredUser } from "../../../utils/authUser";
import "./Navbar.css";
import logo from "../../../assets/img/logo.jpg";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileHint, setShowProfileHint] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // On home page, only show guest user; elsewhere, prefer host
  let user;
  if (location.pathname === "/") {
    user = getStoredUser("guest");
  } 
  const profileBtnRef = useRef(null);

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

  function handleProfileClick() {
    if (user) {
      closeMenu();
      setShowProfileMenu(true);
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
              type="button"
              className="nav-profile-btn"
              aria-label={`Profile ${user.firstName}`}
              onClick={handleProfileClick}
            >
              <IoPersonCircleOutline size={26} />
              <span className="nav-profile-name">{user.firstName}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="nav-auth-btn"
                onClick={() => navigate("/sign-up")}
              >
                Sign up
              </button>
              <button
                type="button"
                className="nav-auth-btn"
                onClick={() => navigate("/log-in")}
              >
                Sign in
              </button>
            </>
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
            x
          </button>

          <div className="nav-bar-top">
            <CurrencySelector />
            <LanguageSelector />
            <Link to="/help" onClick={closeMenu}>
              Help
            </Link>
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
          </div>

          <div className="nav-bar-bottom">
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
              <li>
                <NavLink
                  to="/flights"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link-active" : ""
                  }
                >
                  Flights
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/car-rental"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link-active" : ""
                  }
                >
                  Car rental
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/attractions"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link-active" : ""
                  }
                >
                  Attractions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/airport-taxis"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link-active" : ""
                  }
                >
                  Airport taxis
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/host"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link-active" : ""
                  }
                >
                  Host
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
