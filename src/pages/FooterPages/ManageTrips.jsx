import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";

export default function ManageTrips() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">My Account</span>
        <h1>Manage Your Trips</h1>
        <p className="fp-subtitle">View, modify, or cancel your bookings in a few easy steps.</p>

        <div className="fp-card">
          <h2>How to view your bookings</h2>
          <div className="fp-steps">
            <div className="fp-step">
              <div className="fp-step-number">1</div>
              <div className="fp-step-text">
                <h3>Log in to your account</h3>
                <p>Go to the top of the page and click Log in. Enter your email address and password.</p>
              </div>
            </div>
            <div className="fp-step">
              <div className="fp-step-number">2</div>
              <div className="fp-step-text">
                <h3>Open your profile</h3>
                <p>Click your name or the profile icon in the top navigation bar.</p>
              </div>
            </div>
            <div className="fp-step">
              <div className="fp-step-number">3</div>
              <div className="fp-step-text">
                <h3>Select "My Trips"</h3>
                <p>All your upcoming and past bookings will be listed here with their status.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fp-card">
          <h2>Modifying a booking</h2>
          <p>Some bookings allow free date changes up to 48 hours before check-in. To request a change:</p>
          <ul>
            <li>Open the booking you want to modify from My Trips.</li>
            <li>Click <strong>Change dates</strong> or <strong>Edit guests</strong>.</li>
            <li>Select your new dates and confirm. Any price difference will be shown before you confirm.</li>
          </ul>
          <p>If the option is not available, the property's cancellation policy does not allow free changes. Contact Customer Service for assistance.</p>
        </div>

        <div className="fp-card">
          <h2>Cancelling a booking</h2>
          <p>To cancel a reservation, open it in My Trips and click <strong>Cancel booking</strong>. Your refund eligibility depends on the property's cancellation policy shown at the time of booking.</p>
          <ul>
            <li><strong>Free cancellation:</strong> Full refund processed within 5–7 business days.</li>
            <li><strong>Non-refundable:</strong> No refund is issued on cancellation.</li>
            <li><strong>Partial refund:</strong> Amount refunded is stated in the booking terms.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Need help?</h2>
          <p>If you are unable to manage your booking online, our support team is available to assist you. Visit the <strong>Contact Customer Service</strong> page for contact options.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
