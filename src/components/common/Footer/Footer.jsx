import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer>
        <div className="footer-links">
          <div className="foot-links">
            <h3>Discover</h3>
            <Link to="/manage-trips">Manage your trips</Link>
          </div>
          <div className="foot-links">
            <h3>Support</h3>
            <Link to="/contact">Contact Customer Service</Link>
            <Link to="/manage-trips">Manage your trips</Link>
            <Link to="/safety">Safety resource centre</Link>
          </div>
          <div className="foot-links">
            <h3>Terms and Settings</h3>
            <Link to="/privacy">Privacy Notice</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <div className="foot-links">
            <h3>About</h3>
            <Link to="/about">About IbookNova</Link>
            <Link to="/content-guidelines">Content guidelines and reporting</Link>
            <Link to="/sustainability">Sustainability</Link>
          </div>
        </div>

        <hr />

        <div>
          <p>
            ibooknova is part of Booking Inc, a global leader in online travel
            and related services. © 2026 IbookNova. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
