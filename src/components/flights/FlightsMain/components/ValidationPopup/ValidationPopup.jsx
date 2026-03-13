import "./ValidationPopup.css";

export default function ValidationPopup({ errors, onClose }) {
  const messages = Object.values(errors).filter(Boolean);
  if (!messages.length) return null;

  return (
    <div className="fd-validation-overlay" onClick={onClose}>
      <div className="fd-validation-popup" onClick={(e) => e.stopPropagation()}>
        <div className="fd-val-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b42318"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span>Please complete your search</span>
          <button type="button" className="fd-val-close" onClick={onClose}>
            ×
          </button>
        </div>

        <ul className="fd-val-list">
          {messages.map((msg, i) => (
            <li key={i} className="fd-val-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b42318"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
