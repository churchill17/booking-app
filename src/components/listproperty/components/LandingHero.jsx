import { useEffect, useState } from "react";
import { PrimaryBtn, SecondaryBtn } from "../ui.jsx";
import { useNavigate } from "react-router-dom";
import { getListings } from "../../host/services/hostApi";
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
  const [unfinished, setUnfinished] = useState([]);
  useEffect(() => {
    getListings().then((listings) => {
      // Filter for unfinished (not approved) properties
      let unfinishedProps = listings.filter((item) => !item.isApproved);
      // Add local drafts
      if (Array.isArray(drafts) && drafts.length > 0) {
        const localDrafts = drafts.map((d) => ({
          id: d.id,
          propertyName: d.data.propertyName || "New property",
          raw: { updated_at: d.lastEdit },
          createdAt: d.lastEdit,
          isApproved: false,
        }));
        unfinishedProps = [...localDrafts, ...unfinishedProps];
      }
      setUnfinished(unfinishedProps);
    });
  }, [drafts]);
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
    <>
      <article
        className="lp-landing__feature-panel lp-landing__feature-panel--rules"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 32,
          overflow: "hidden",
          height: "auto",
          marginBottom: "30px",
        }}
      >
        {/* Left: Welcome and actions */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div>
              <h1>Welcome, {firstName}!</h1>
              <p>Ready to list your property and start earning?</p>
            </div>
          </div>
          <div
            className="lp-landing__actions"
            style={{ display: "flex", gap: 12, marginBottom: 18 }}
          >
            <SecondaryBtn
              onClick={() => navigate("/host")}
              style={{ minWidth: 140 }}
            >
              Return to dashboard
            </SecondaryBtn>
            <SecondaryBtn onClick={onCreateNew} style={{ minWidth: 140 }}>
              Create new listing
            </SecondaryBtn>
          </div>
        </div>
        {/* Right: Scrollable registration info */}
        <div
          style={{
            flex: 1,
            height: 270,
            overflowY: "auto",
            background: "#f8f5ef",
            borderRadius: 14,
            padding: 18,
            boxShadow: "0 4px 12px #1824350f",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <div className="lp-landing__fact-line">
              <strong>Continue your registration</strong> <br />
              Welcome back, {firstName}!
            </div>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {unfinished.length === 0 && (
              <div style={{ color: "#888", fontSize: 15 }}>
                No unfinished properties found.
              </div>
            )}
            {unfinished.map((item) => {
              const name =
                item.propertyName && item.propertyName !== "Untitled property"
                  ? item.propertyName
                  : "New property";
              // Prefer updatedAt, fallback to createdAt
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
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    padding: 14,
                    boxShadow: "0 2px 8px #18243514",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 2,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {name}
                      </div>
                      <div style={{ color: "#888", fontSize: 13 }}>
                        Last edited: {dateStr}
                      </div>
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
          <PrimaryBtn onClick={onContinue} fullWidth>
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
    </>
  );
}
