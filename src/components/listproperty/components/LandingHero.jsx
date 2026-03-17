import { PrimaryBtn, SecondaryBtn } from "../ui.jsx";
import Fact from "./Fact.jsx";
import "./LandingHero.css";

export default function LandingHero({ user, onContinue, onCreateNew }) {
  const firstName = user?.firstName || "Host";

  return (
    <section className="lp-landing">
      <div className="lp-landing__grid">
        <article className="lp-landing__card">
          <span className="lp-landing__badge">Continue your registration</span>

          <h1 className="lp-landing__title">Welcome back, {firstName}</h1>
          <p className="lp-landing__subtitle">
            Finish listing your property in just a few steps. You can continue
            where you left off or start a new listing.
          </p>

          <div className="lp-landing__actions">
            <PrimaryBtn
              onClick={onContinue}
              style={{ minWidth: "var(--lp-landing-primary-min-width, 220px)" }}
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
      </div>
    </section>
  );
}
