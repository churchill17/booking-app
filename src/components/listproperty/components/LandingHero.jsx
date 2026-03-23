import { PrimaryBtn, SecondaryBtn } from "../ui.jsx";
import Fact from "./Fact.jsx";
import "./LandingHero.css";

export default function LandingHero({ user, onContinue, onCreateNew }) {
  const firstName = user?.firstName || "Host";
  const sectionOne = [
    {
      title: "Your rental, your rules",
      points: [
        "Accept or decline bookings with Request to Book.",
        "Manage guests' expectations by setting up clear house rules.",
      ],
    },
    {
      title: "Get to know your guests",
      points: [
        "Communicate with your guests before accepting their stay with pre-booking messaging.*",
        "Access guest travel history insights.",
      ],
    },
    {
      title: "Stay protected",
      points: [
        "Up to euro, dollar, or pound equivalent of 1 million in liability protection against claims from guests and neighbors at no extra cost with Partner Liability Insurance.",
        "Selection of damage protection options to choose from.",
      ],
    },
  ];

  const sectionTwo = [
    {
      title: "Payments made easy",
      points: [
        "We facilitate the payment process for you, freeing up your time to grow your business.",
      ],
    },
    {
      title: "Greater revenue security",
      points: [
        "Whenever guests complete prepaid reservations at your property and pay online, you're guaranteed payment.",
      ],
    },
    {
      title: "More control over your cash flow",
      points: [
        "Choose payout method and timing based on regional availability.",
      ],
    },
    {
      title: "Daily payouts in select markets",
      points: [
        "Get payouts faster. We'll send your payouts 24 hours after guests check out.",
      ],
    },
    {
      title: "One-stop solution for multiple listings",
      points: [
        "Save time managing finances with group invoicing and reconciliation.",
      ],
    },
    {
      title: "Reduced risk",
      points: [
        "We help you stay compliant with regulatory changes and reduce the risk of fraud and chargebacks.",
      ],
    },
  ];

  const sectionThree = [
    {
      title: "Import your property details",
      points: [
        "Seamlessly import your property information from other travel sites and avoid double-bookings with calendar sync.",
      ],
    },
    {
      title: "Start fast with review scores",
      points: [
        "Your review scores from other travel sites are converted and displayed on your property page before your first Booking.com guests leave reviews.",
      ],
    },
    {
      title: "Stand out in the market",
      points: [
        "The New to Booking.com label helps you stand out in search results.",
      ],
    },
  ];

  return (
    <section className="lp-landing">
      <div className="lp-landing__grid">
        <article className="lp-landing__card">
          <div className="lp-landing__intro">
            <span className="lp-landing__badge">
              Continue your registration
            </span>

            <h1 className="lp-landing__title">Welcome back, {firstName}</h1>
            <p className="lp-landing__subtitle">
              Finish listing your property in just a few steps. You can continue
              where you left off or start a new listing.
            </p>

            <div className="lp-landing__actions">
              <PrimaryBtn
                onClick={onContinue}
                style={{
                  minWidth: "var(--lp-landing-primary-min-width, 220px)",
                }}
              >
                Continue registration
              </PrimaryBtn>
              <SecondaryBtn
                onClick={onCreateNew}
                style={{
                  minWidth: "var(--lp-landing-secondary-min-width, 180px)",
                }}
              >
                Create new listing
              </SecondaryBtn>
            </div>
          </div>

          <div className="lp-landing__facts">
            <Fact
              label="Fast setup"
              text="Add your details, amenities, and photos in minutes."
            />
            <Fact
              label="More bookings"
              text="Get discovered by guests searching your destination."
            />
            <Fact
              label="Free to list"
              text="Create your listing now and publish when ready."
            />
          </div>
        </article>

        <article className="lp-landing__feature-panel">
          <div className="lp-landing__section-head">
            <h2>Host worry-free. We've got your back</h2>
          </div>
          <div className="lp-landing__feature-grid">
            {sectionOne.map((item) => (
              <div key={item.title} className="lp-landing__feature-card">
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lp-landing__cta-row">
            <PrimaryBtn onClick={onCreateNew} fullWidth>
              Reach new guests today
            </PrimaryBtn>
          </div>
          <p className="lp-landing__note">
            *Available for guest bookings made on mobile apps. Web version
            coming soon.
          </p>
        </article>

        <article className="lp-landing__feature-panel lp-landing__feature-panel--payments">
          <div className="lp-landing__section-head">
            <h2>Take control of your finances with Payments by Booking.com</h2>
          </div>
          <div className="lp-landing__feature-grid lp-landing__feature-grid--two-col">
            {sectionTwo.map((item) => (
              <div key={item.title} className="lp-landing__feature-card">
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lp-landing__cta-row">
            <PrimaryBtn onClick={onCreateNew} fullWidth>
              Start earning today
            </PrimaryBtn>
          </div>
        </article>

        <article className="lp-landing__feature-panel lp-landing__feature-panel--simple">
          <div className="lp-landing__section-head">
            <h2>Simple to start and stay ahead</h2>
          </div>
          <div className="lp-landing__feature-grid">
            {sectionThree.map((item) => (
              <div key={item.title} className="lp-landing__feature-card">
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lp-landing__cta-row">
            <PrimaryBtn onClick={onCreateNew} fullWidth>
              Get started today
            </PrimaryBtn>
          </div>
        </article>
      </div>
    </section>
  );
}
