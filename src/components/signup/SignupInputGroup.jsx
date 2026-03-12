export default function SignupInputGroup({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  rightIcon,
  rightIconLabel,
  onRightIconClick,
}) {
  const hasRightIcon = Boolean(rightIcon && onRightIconClick);

  return (
    <div className="signup-input-group">
      <label className="signup-input-group-label" htmlFor={id}>
        {label}
      </label>
      <div className="signup-input-group-field">
        <input
          id={id}
          type={type}
          className={`signup-input-group-input${error ? " error" : ""}${hasRightIcon ? " has-right-icon" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={
            autoComplete ??
            (type === "email"
              ? "email"
              : type === "password"
                ? "current-password"
                : "off")
          }
        />

        {hasRightIcon && (
          <button
            type="button"
            className="signup-input-right-icon-btn"
            aria-label={rightIconLabel || "Toggle input visibility"}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && <div className="signup-input-group-error">⚠ {error}</div>}
    </div>
  );
}
