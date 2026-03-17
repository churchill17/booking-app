import { C } from "../ui.constants.js";
import "./InternalNav.css";

export default function InternalNav({ user, onHome }) {
  return (
    <nav className="lp-internal-nav">
      <button className="lp-internal-nav__back" onClick={onHome}>
        ← Back to site
      </button>
      {user && (
        <div className="lp-internal-nav__user">
          <div className="lp-internal-nav__avatar">
            {user.firstName?.[0]?.toUpperCase()}
          </div>
          <span className="lp-internal-nav__name">{user.firstName}</span>
        </div>
      )}
    </nav>
  );
}
