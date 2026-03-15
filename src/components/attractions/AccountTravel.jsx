import "./AccountTravel.css";

export default function AccountTravel() {
  return (
    <section className="account-travel">
      <div className="account-travel__container">
        <h2 className="account-travel__section-title">Your account, your travel</h2>
        <div className="account-travel__card">
          <div className="account-travel__card-body">
            <p className="account-travel__card-heading">All your trip details in one place</p>
            <p className="account-travel__card-sub">
              Sign in to book faster and manage your trip with ease
            </p>
            <div className="account-travel__actions">
              <button className="account-travel__btn--signin">Sign in</button>
              <button className="account-travel__btn--register">Register</button>
            </div>
          </div>
          <div className="account-travel__genius">
            <div className="account-travel__genius-box">
              <span className="account-travel__genius-ribbon">🎁</span>
              <span className="account-travel__genius-label">Genius</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
