import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { getStoredUser } from "../../../utils/authUser";
import "./Navbar.css";
import logo from "../../../assets/img/logo.jpg";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileHint, setShowProfileHint] = useState(false);
  const user = getStoredUser();

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
      navigate("/");
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
      <div className="nav">
        <div className="site-header-logo">
          <img src={logo} alt="" />
        </div>

        <div className="nav-mobile-actions">
          <button
            type="button"
            className="nav-profile-btn"
            aria-label={user ? `Profile ${user.firstName}` : "Sign in"}
            onClick={handleProfileClick}
          >
            <IoPersonCircleOutline size={26} />
            {user ? (
              <span className="nav-profile-name">{user.firstName}</span>
            ) : (
              showProfileHint && (
                <span className="nav-profile-hint">Sign in</span>
              )
            )}
          </button>

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
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "nav-link-active" : "")}
            >
              Stays
            </NavLink>
            <NavLink
              to="/flights"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "nav-link-active" : "")}
            >
              Flights
            </NavLink>
            <NavLink
              to="/car-rental"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "nav-link-active" : "")}
            >
              Car rental
            </NavLink>
            <NavLink
              to="/attractions"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "nav-link-active" : "")}
            >
              Attractions
            </NavLink>
            <NavLink
              to="/airport-taxis"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "nav-link-active" : "")}
            >
              Airport taxis
            </NavLink>
             <NavLink
              to="/listers"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "nav-link-active" : "")}
            >
              Listers
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
