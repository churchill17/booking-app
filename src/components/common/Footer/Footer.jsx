import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer>
        <div className="footer-links">
<div className="foot-links">
            <h3>Support</h3>
            <Link to="/contact">Contact Customer Service</Link>
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
            iBookNova — simplifying property discovery, booking, and hosting for guests and property owners worldwide. © {new Date().getFullYear()} iBookNova. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
