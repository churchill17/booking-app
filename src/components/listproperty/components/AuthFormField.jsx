import "./AuthFormField.css";

export default function AuthFormField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  error,
  rightIcon,
  rightIconLabel,
  onRightIconClick,
}) {
  return (
    <label className="lp-auth-field">
      <span className="lp-auth-field__label">{label}</span>
      <div className="lp-auth-field__input-wrap">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`lp-auth-field__input ${error ? "is-error" : ""}`}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        {rightIcon ? (
          <button
            type="button"
            className="lp-auth-field__icon-btn"
            onClick={onRightIconClick}
            aria-label={rightIconLabel || "Toggle value visibility"}
          >
            {rightIcon}
          </button>
        ) : null}
      </div>
      {error ? <span className="lp-auth-field__error">{error}</span> : null}
    </label>
  );
}
