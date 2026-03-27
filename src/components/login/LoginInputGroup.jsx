export default function LoginInputGroup({ label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  rightIcon,
  rightIconLabel,
  onRightIconClick, }) {
    const hasRightIcon = Boolean(rightIcon && onRightIconClick);
  return (
    <div className="login-input-group">
      <label className="login-input-group-label" htmlFor={id}>{label}</label>
      <div className="login-input-group-field">
        <input
          id={id}
          type={type}
          className={`login-input-group-input${error ? ' error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete ?? (type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off')}
        />
         {hasRightIcon && (
          <button
            type="button"
            className="login-input-right-icon-btn"
            aria-label={rightIconLabel || "Toggle input visibility"}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && <div className="login-input-group-error">⚠ {error}</div>}
    </div>
  );
}