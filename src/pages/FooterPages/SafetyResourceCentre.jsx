import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";

export default function SafetyResourceCentre() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">Safety</span>
        <h1>Safety Resource Centre</h1>
        <p className="fp-subtitle">Your safety matters to us. Here's how we keep you protected before, during, and after your stay.</p>

        <div className="fp-card">
          <h2>Before you book</h2>
          <ul>
            <li>Read guest reviews carefully — look for recent comments about cleanliness and security.</li>
<li>Confirm the cancellation and refund policy before paying.</li>
            <li>Only complete payment through the iBookNova platform — never pay outside the app.</li>
            <li>If a deal seems too good to be true, report it to us immediately.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>During your stay</h2>
          <ul>
            <li>Keep a copy of your booking confirmation and the property's address with you.</li>
            <li>Share your trip details with a trusted contact before travelling.</li>
            <li>If you feel unsafe at a property, contact the host first, then our support team.</li>
            <li>Emergency services: dial <strong>112</strong> in Nigeria for Police, Ambulance, or Fire.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Property safety standards</h2>
          <p>All properties listed on iBookNova are expected to meet basic safety requirements including:</p>
          <ul>
            <li>Working smoke and carbon monoxide detectors where applicable.</li>
            <li>Clearly marked fire exits and extinguishers.</li>
            <li>Secure locks on all guest room doors and exterior entrances.</li>
            <li>Clean drinking water and sanitary facilities.</li>
          </ul>
          <p>If a property you stayed at failed to meet these standards, please report it so we can investigate and take action.</p>
        </div>

        <div className="fp-card">
          <h2>Report a safety concern</h2>
          <p>If you experience or witness a safety issue related to any iBookNova listing, contact our team immediately:</p>
          <ul>
            <li>Email: <strong>safety@ibooknova.com</strong></li>
            <li>Phone: <strong>+234 800 000 0001</strong> (24/7 safety line)</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
