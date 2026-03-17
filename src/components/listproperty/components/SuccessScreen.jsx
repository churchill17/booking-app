import { PrimaryBtn } from "../ui.jsx";
import "./SuccessScreen.css";

const NEXT_STEPS = [
  ["📋", "Review pending", "Our team will verify your listing"],
  ["✉️", "Email confirmation", "Check your inbox for next steps"],
  ["📅", "Set your calendar", "Open available dates to start getting bookings"],
];

export default function SuccessScreen({ propertyName, onDashboard }) {
  return (
    <div className="lp-success">
      <div className="lp-success__inner">
        <div className="lp-success__emoji">🎉</div>

        <div className="lp-success__card">
          <h1 className="lp-success__title">You're live!</h1>
          <p className="lp-success__desc">
            <strong className="lp-success__property-name">
              {propertyName || "Your property"}
            </strong>{" "}
            has been submitted and is now open for bookings.
          </p>
          <p className="lp-success__sub">
            Your listing will be reviewed within 24 hours. You'll receive an
            email confirmation once it's live.
          </p>

          <div className="lp-success__steps">
            {NEXT_STEPS.map(([icon, title, desc], i) => (
              <div key={i} className="lp-success__step">
                <span className="lp-success__step-icon">{icon}</span>
                <div>
                  <div className="lp-success__step-title">{title}</div>
                  <div className="lp-success__step-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <PrimaryBtn
            onClick={onDashboard}
            fullWidth
            style={{
              fontSize: "var(--lp-success-btn-font-size, 15px)",
              padding: "var(--lp-success-btn-padding, 14px)",
            }}
          >
            Go to my dashboard →
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}
