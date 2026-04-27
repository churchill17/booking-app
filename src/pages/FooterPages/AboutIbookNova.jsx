import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";
import "./AboutIbookNova.css";

export default function AboutIbookNova() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">About</span>
        <h1>About IbookNova</h1>
        <p className="fp-subtitle">
          A centralized digital booking and coordination platform designed to
          simplify travel and accommodation through one unified system.
        </p>

        <div className="fp-card">
          <h2>Who we are</h2>
          <p>
            IbookNova is an online accommodation booking platform that connects
            travelers with verified hotels, guesthouses, apartments, and unique
            stays across Nigeria. Built to serve both leisure and business
            travelers, IbookNova focuses on convenience, reliability, and
            curated service delivery.
          </p>
          <p>
            By integrating verified property owners into one ecosystem, IbookNova
            enables customers to search, compare, book, and manage their stays
            efficiently — while giving property partners increased visibility,
            demand access, and streamlined booking management.
          </p>
        </div>

        <div className="fp-card">
          <h2>Our vision</h2>
          <p>
            To become a trusted infrastructure platform for hospitality and
            travel services, starting in Nigeria and expanding across emerging
            markets.
          </p>
        </div>

        <div className="fp-card about-services-card">
          <h2>What you can do on IbookNova</h2>
          <div className="about-services-grid">

            <div className="about-service-item about-service-active">
              <div className="about-service-icon">🔍</div>
              <div className="about-service-body">
                <h3>Search and filter stays</h3>
                <p>
                  Search by destination, check-in and check-out dates, number
                  of guests and rooms. Refine results by star rating, budget,
                  review score, property type, facilities, and bed type.
                </p>
              </div>
            </div>

            <div className="about-service-item about-service-active">
              <div className="about-service-icon">🏨</div>
              <div className="about-service-body">
                <h3>Book hotels and stays</h3>
                <p>
                  Browse hotels, guesthouses, apartments, holiday homes, resorts,
                  and more. View photos, amenities, house rules, and guest
                  reviews before booking. Complete your reservation in three
                  simple steps.
                </p>
              </div>
            </div>

            <div className="about-service-item about-service-active">
              <div className="about-service-icon">👤</div>
              <div className="about-service-body">
                <h3>Manage your account and trips</h3>
                <p>
                  Create an account to track your bookings, manage trip details,
                  submit guest details, and view booking confirmations all in
                  one place.
                </p>
              </div>
            </div>

            <div className="about-service-item about-service-active">
              <div className="about-service-icon">⭐</div>
              <div className="about-service-body">
                <h3>Read and leave reviews</h3>
                <p>
                  Genuine guest reviews help you choose the right property.
                  After your stay, share your experience to help fellow
                  travelers make informed decisions.
                </p>
              </div>
            </div>

            <div className="about-service-item about-service-active">
              <div className="about-service-icon">🏠</div>
              <div className="about-service-body">
                <h3>List and manage your property</h3>
                <p>
                  Property owners can list their accommodation through our
                  guided setup wizard, manage room types and pricing, track
                  bookings, and view analytics — all from the host dashboard.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="fp-card">
          <h2>For property owners</h2>
          <p>
            IbookNova gives accommodation providers across Nigeria a platform to
            reach thousands of travelers. Whether you run a single guesthouse or
            a chain of hotels, listing with us is straightforward and gives you
            access to our growing customer base. Visit our{" "}
            <strong>List Your Property</strong> page to get started.
          </p>
        </div>

        <div className="fp-card">
          <h2>Get in touch</h2>
          <ul>
            <li>General enquiries: <strong>hello@ibooknova.com</strong></li>
            <li>Press: <strong>press@ibooknova.com</strong></li>
            <li>Partnerships: <strong>partners@ibooknova.com</strong></li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
