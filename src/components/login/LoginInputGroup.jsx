export default function LoginInputGroup({ label, id, type = 'text', placeholder, value, onChange, error, autoComplete }) {
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
      </div>
      {error && <div className="login-input-group-error">⚠ {error}</div>}
    </div>
  );
}