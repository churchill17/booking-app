import { useMemo } from "react";
import { PrimaryBtn, SecondaryBtn } from "../ui.jsx";
import { useNavigate } from "react-router-dom";
import Fact from "./Fact.jsx";
import "./LandingHero.css";

export default function LandingHero({
  user,
  drafts = [],
  onContinue,
  onCreateNew,
}) {
  const firstName = user?.firstName || "Host";
  const navigate = useNavigate();
  const unfinished = useMemo(() => {
    if (!Array.isArray(drafts) || drafts.length === 0) return [];
    return drafts.map((d) => ({
      id: d.id,
      propertyName: d.data?.propertyName || "New property",
      raw: { updated_at: d.lastEdit },
      createdAt: d.lastEdit,
      isApproved: false,
    }));
  }, [drafts]);
  const sectionOne = [
    {
      title: "Step-by-step listing wizard",
      points: [
        "Complete our guided wizard to list your property in a few simple steps — property details, location, rooms, amenities, photos, pricing and more.",
      ],
    },
    {
      title: "Your rules, your guests",
      points: [
        "Set clear house rules, guest policies, cancellation terms and age restrictions to manage guest expectations upfront.",
      ],
    },
    {
      title: "Control your pricing",
      points: [
        "Set your room rates and manage your property details directly from your host dashboard at any time.",
      ],
    },
  ];

  const sectionTwo = [
    {
      title: "Secure payment processing",
      points: [
        "Guest payments are processed securely through our payment system. Register your bank details during setup to receive your earnings.",
      ],
    },
    {
      title: "Track your bookings",
      points: [
        "View all upcoming and past bookings, guest details and booking status from one host dashboard.",
      ],
    },
    {
      title: "Host dashboard analytics",
      points: [
        "Monitor your property performance with booking summaries and an earnings overview from your host dashboard.",
      ],
    },
  ];

  const sectionThree = [
    {
      title: "Easy property management",
      points: [
        "Update your property photos, room details, amenities and pricing at any time from your host profile.",
      ],
    },
    {
      title: "Know your guests",
      points: [
        "View guest details and booking information before and during their stay, all in one place.",
      ],
    },
    {
      title: "Build your reputation",
      points: [
        "After each stay, guests can leave reviews that help build your property's reputation on iBookNova.",
      ],
    },
  ];

  return (
    <>
      <article className="lp-landing__feature-panel lp-landing__feature-panel--rules lp-welcome-panel">
        {/* Left: Welcome and actions */}
        <div className="lp-welcome-left">
          <div className="lp-welcome-heading">
            <h1>Welcome, {firstName}!</h1>
            <p>Ready to list your property and start earning?</p>
          </div>
          <div className="lp-welcome-actions">
            <SecondaryBtn onClick={() => navigate("/host")}>
              Return to dashboard
            </SecondaryBtn>
            <SecondaryBtn onClick={onCreateNew}>
              Create new listing
            </SecondaryBtn>
          </div>
        </div>

        {/* Right: Scrollable drafts */}
        <div className="lp-welcome-right">
          <div className="lp-drafts-header">
            <div className="lp-landing__fact-line">
              <strong>Continue your registration</strong>
              <br />
              Welcome back, {firstName}!
            </div>
          </div>
          <div className="lp-draft-list">
            {unfinished.length === 0 && (
              <p className="lp-drafts-empty">No unfinished properties found.</p>
            )}
            {unfinished.map((item) => {
              const name =
                item.propertyName && item.propertyName !== "Untitled property"
                  ? item.propertyName
                  : "New property";
              const raw = item.raw || {};
              const lastEdit =
                raw.updated_at ||
                raw.updatedAt ||
                item.createdAt ||
                item.raw?.created_at ||
                item.raw?.createdAt ||
                "";
              let dateStr = "-";
              if (lastEdit) {
                const d = new Date(lastEdit);
                if (!isNaN(d.getTime())) {
                  dateStr = d.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                }
              }
              return (
                <div key={item.id} className="lp-draft-card">
                  <div className="lp-draft-card__row">
                    <div>
                      <div className="lp-draft-card__name">{name}</div>
                      <div className="lp-draft-card__date">Last edited: {dateStr}</div>
                    </div>
                    <PrimaryBtn onClick={() => onContinue(item.id)}>
                      Continue
                    </PrimaryBtn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>

      <article
        className="lp-landing__feature-panel lp-landing__feature-panel--rules"
        style={{
          marginBottom: "30px",
        }}
      >
        <div className="lp-landing__section-head">
          <h2>Get started: Your property, your rules</h2>
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
          <PrimaryBtn
            onClick={onCreateNew}
            fullWidth
          >
            Continue
          </PrimaryBtn>
        </div>
      </article>

      <article
        className="lp-landing__feature-panel lp-landing__feature-panel--payments"
        style={{
          marginBottom: "30px",
        }}
      >
        <div className="lp-landing__section-head">
          <h2>Get paid for your listings</h2>
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
    </>
  );
}
