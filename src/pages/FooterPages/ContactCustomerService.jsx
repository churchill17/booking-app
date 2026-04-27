import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";

export default function ContactCustomerService() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">Support</span>
        <h1>Contact Customer Service</h1>
        <p className="fp-subtitle">We're here to help. Reach us through any of the channels below.</p>

        <div className="fp-contact-grid">
          <div className="fp-contact-card">
            <h3>Live Chat</h3>
            <p>Available Mon – Fri, 8am – 10pm WAT</p>
            <p>Sat – Sun, 9am – 6pm WAT</p>
            <a href="#">Start a chat</a>
          </div>
          <div className="fp-contact-card">
            <h3>Email Support</h3>
            <p>We respond within 24 hours on business days.</p>
            <a href="mailto:support@ibooknova.com">support@ibooknova.com</a>
          </div>
          <div className="fp-contact-card">
            <h3>Phone</h3>
            <p>Mon – Fri, 8am – 8pm WAT</p>
            <a href="tel:+2348000000000">+234 800 000 0000</a>
          </div>
          <div className="fp-contact-card">
            <h3>WhatsApp</h3>
            <p>Quick responses during business hours.</p>
            <a href="#">Message us on WhatsApp</a>
          </div>
        </div>

        <hr className="fp-divider" />

        <div className="fp-card">
          <h2>Before you contact us</h2>
          <p>Many issues can be resolved quickly by checking the following:</p>
          <ul>
            <li>Visit <strong>Manage your trips</strong> to view, modify, or cancel your booking.</li>
            <li>Check your email inbox (and spam folder) for your booking confirmation.</li>
            <li>Review the property's cancellation policy in your booking details.</li>
            <li>Check the property contact details listed in your confirmation email to reach the accommodation directly.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Booking-related complaints</h2>
          <p>If you have a complaint about a stay, please contact us within 30 days of check-out with your booking reference number. We will investigate and respond within 5 business days.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
