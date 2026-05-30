import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";

export default function TermsOfService() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">Legal</span>
        <h1>Terms of Service</h1>
        <p className="fp-subtitle">Last updated: May 2026. Please read these terms carefully before using iBookNova.</p>

        <div className="fp-card">
          <h2>1. Acceptance of terms</h2>
          <p>By accessing or using the iBookNova platform (website and mobile app), you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.</p>
        </div>

        <div className="fp-card">
          <h2>2. Our service</h2>
          <p>iBookNova is an online marketplace that connects travellers with accommodation providers in Nigeria. We facilitate bookings but are not the accommodation provider. The contract for your stay is between you and the property host.</p>
        </div>

        <div className="fp-card">
          <h2>3. Account registration</h2>
          <ul>
            <li>You must be at least 18 years old to create an account.</li>
            <li>You are responsible for keeping your login credentials secure.</li>
            <li>You must provide accurate information when registering and keep it up to date.</li>
            <li>One person may not create multiple accounts.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>4. Bookings and payments</h2>
          <ul>
            <li>A booking is confirmed only after successful payment and a confirmation email is sent to you.</li>
            <li>Prices shown include all taxes and fees unless otherwise stated.</li>
            <li>Payment is processed securely through our payment partners.</li>
            <li>iBookNova reserves the right to cancel any booking suspected of fraud.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>5. Cancellations and refunds</h2>
          <p>Cancellation policies vary by property and are clearly shown before you confirm a booking. Refund eligibility depends on the policy selected at the time of booking. iBookNova's service fee is non-refundable unless the cancellation is due to our error.</p>
        </div>

        <div className="fp-card">
          <h2>6. Guest responsibilities</h2>
          <ul>
            <li>Respect the property, its rules, and other guests.</li>
            <li>Report any damage to the property to the host and to iBookNova promptly.</li>
            <li>Do not use bookings for unlawful purposes.</li>
            <li>The number of guests must not exceed the number stated in your booking.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>7. Limitation of liability</h2>
          <p>iBookNova is not liable for the actions or omissions of property hosts, the condition of accommodation, or losses arising from circumstances beyond our reasonable control. Our total liability to you shall not exceed the total amount paid for the specific booking giving rise to the claim.</p>
        </div>

        <div className="fp-card">
          <h2>8. Changes to these terms</h2>
          <p>We may update these terms from time to time. We will notify you of significant changes by email or a notice on the platform. Continued use of iBookNova after changes are posted constitutes your acceptance.</p>
        </div>

        <div className="fp-card">
          <h2>9. Governing law</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria.</p>
        </div>

        <div className="fp-card">
          <h2>10. Contact</h2>
          <p>For questions about these terms, contact us at <strong>legal@ibooknova.com</strong>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
