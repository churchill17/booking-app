import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";

export default function PrivacyNotice() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">Legal</span>
        <h1>Privacy Notice</h1>
        <p className="fp-subtitle">Last updated: January 2026</p>

        <div className="fp-card">
          <h2>Who we are</h2>
          <p>IbookNova is an online accommodation booking platform operated by Booking Inc. We are committed to protecting your personal data and respecting your privacy. This notice explains what data we collect, why we collect it, and how we use it.</p>
        </div>

        <div className="fp-card">
          <h2>What data we collect</h2>
          <ul>
            <li><strong>Account data:</strong> Your name, email address, phone number, and password when you register.</li>
            <li><strong>Booking data:</strong> Check-in/check-out dates, number of guests, payment details (card type and last 4 digits only — full card data is handled by our payment processor).</li>
            <li><strong>Usage data:</strong> Pages you visit, searches you perform, and features you use on the platform.</li>
            <li><strong>Device data:</strong> IP address, browser type, and operating system for security and fraud prevention.</li>
            <li><strong>Communications:</strong> Messages you send to us or to property hosts through our platform.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>How we use your data</h2>
          <ul>
            <li>To create and manage your account.</li>
            <li>To process and confirm your bookings.</li>
            <li>To send booking confirmations, receipts, and important updates.</li>
            <li>To provide customer support.</li>
            <li>To improve our platform and personalise your experience.</li>
            <li>To detect and prevent fraud and unauthorised access.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Who we share your data with</h2>
          <p>We share your data only where necessary:</p>
          <ul>
            <li><strong>Property hosts:</strong> Your name, contact details, and booking information so they can prepare for your arrival.</li>
            <li><strong>Payment processors:</strong> To complete transactions securely.</li>
            <li><strong>Service providers:</strong> Companies that help us operate (e.g. email, cloud hosting) under strict data protection agreements.</li>
            <li><strong>Legal authorities:</strong> Where required by Nigerian law or a valid court order.</li>
          </ul>
          <p>We do not sell your personal data to third parties.</p>
        </div>

        <div className="fp-card">
          <h2>Your rights</h2>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Object to or restrict certain processing of your data.</li>
          </ul>
          <p>To exercise any of these rights, email us at <strong>privacy@ibooknova.com</strong>.</p>
        </div>

        <div className="fp-card">
          <h2>Data retention</h2>
          <p>We retain your account data for as long as your account is active. Booking records are kept for 7 years for financial and legal compliance. You may request deletion of your account at any time; residual data required by law will be retained for the minimum period required.</p>
        </div>

        <div className="fp-card">
          <h2>Contact</h2>
          <p>For privacy-related questions or complaints, contact our Data Protection Officer at <strong>privacy@ibooknova.com</strong> or write to us at our registered office address.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
