import { Link } from "react-router-dom";
import "./FlightsFooter.css";

const FOOTER_LINKS = [
  {
    label: "Booking.com Privacy Policy",
    href: "https://www.booking.com/content/privacy.html",
  },
  {
    label: "Booking.com Terms of Use",
    href: "https://www.booking.com/content/terms.html",
  },
  { label: "KAYAK Privacy Policy", href: "https://www.kayak.com/privacy" },
  { label: "KAYAK Terms of Use", href: "https://www.kayak.com/terms" },
];

export default function Footer() {
  return (
    <footer className="site-footer-bottom">
      <nav className="footer-links" aria-label="Footer legal links">
        {FOOTER_LINKS.map((link, i) => (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
