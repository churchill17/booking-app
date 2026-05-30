import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";

export default function ContentGuidelines() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">Community</span>
        <h1>Content Guidelines & Reporting</h1>
        <p className="fp-subtitle">Guidelines for reviews, photos, and all content shared on iBookNova.</p>

        <div className="fp-card">
          <h2>Our content standards</h2>
          <p>iBookNova is built on honest, helpful information shared by our community of guests and hosts. All content published on the platform — including reviews, photos, and property descriptions — must meet the following standards.</p>
        </div>

        <div className="fp-card">
          <h2>Guest reviews</h2>
          <ul>
            <li>Reviews must be based on a genuine, completed stay booked through iBookNova.</li>
            <li>Be honest and specific — describe your actual experience to help future guests make informed decisions.</li>
            <li>Reviews must not contain hate speech, threats, discriminatory language, or personal attacks on staff.</li>
            <li>Do not include personally identifiable information about other guests or staff.</li>
            <li>Reviews must not be submitted in exchange for a discount, refund, or any other incentive.</li>
            <li>Profanity and inappropriate language will be removed.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Property photos and descriptions</h2>
          <ul>
            <li>Photos must accurately represent the property at the time of listing.</li>
            <li>Images must not be stock photos, digitally altered to mislead, or taken from other listings.</li>
            <li>Property descriptions must be accurate and not contain false claims about amenities, location, or services.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>What is not allowed</h2>
          <ul>
            <li>Fake or incentivised reviews.</li>
            <li>Content that promotes illegal activities.</li>
            <li>Spam or repetitive submissions.</li>
            <li>Content that infringes the copyright or intellectual property of others.</li>
            <li>Listings for properties you do not own or have authority to list.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>How to report content</h2>
          <p>If you see a review, photo, or listing that violates these guidelines, please report it so we can investigate:</p>
          <ul>
            <li>Email us at <strong>content@iBookNova.com</strong> with a link and description of the issue.</li>
          </ul>
          <p>We review all reports and aim to respond within 3 business days. Content that violates our guidelines will be removed. Repeated violations may result in account suspension.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
