import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import "./FooterPage.css";

export default function Sustainability() {
  return (
    <div className="footer-page">
      <Header />
      <div className="footer-page-content">
        <span className="fp-badge">Sustainability</span>
        <h1>Sustainability</h1>
        <p className="fp-subtitle">Our commitment to responsible travel and a greener future for Nigerian hospitality.</p>

        <div className="fp-card">
          <h2>Our commitment</h2>
          <p>At IbookNova, we believe travel should be good for people and places. We are committed to making it easier for travellers to make sustainable choices and for property owners to adopt greener practices — contributing to a healthier environment and stronger local communities across Nigeria.</p>
        </div>

        <div className="fp-card">
          <h2>Sustainable stays</h2>
          <p>We are working to identify and highlight properties that demonstrate sustainable practices, including:</p>
          <ul>
            <li>Use of solar energy or other renewable power sources.</li>
            <li>Water conservation measures such as low-flow fixtures and rainwater harvesting.</li>
            <li>Waste reduction — recycling programmes and reduced single-use plastics.</li>
            <li>Local sourcing of food and supplies to support Nigerian businesses.</li>
            <li>Community engagement and employment of local staff.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Responsible travel tips</h2>
          <ul>
            <li>Choose properties that have adopted eco-friendly practices.</li>
            <li>Reuse towels and linens during your stay to reduce water and energy use.</li>
            <li>Support local restaurants, markets, and artisans during your visit.</li>
            <li>Dispose of waste responsibly and respect the natural environment.</li>
            <li>Travel with only what you need to reduce your carbon footprint.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Our operations</h2>
          <p>As a digital-first company, IbookNova operates without a physical retail footprint. We are working to reduce the environmental impact of our technology infrastructure by:</p>
          <ul>
            <li>Choosing cloud providers committed to renewable energy.</li>
            <li>Minimising unnecessary data storage and processing.</li>
            <li>Encouraging remote and flexible work to reduce commuter emissions.</li>
          </ul>
        </div>

        <div className="fp-card">
          <h2>Get involved</h2>
          <p>Are you a property owner who wants to be recognised for your sustainability efforts? Or do you have ideas for how IbookNova can do more? We'd love to hear from you at <strong>sustainability@ibooknova.com</strong>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
