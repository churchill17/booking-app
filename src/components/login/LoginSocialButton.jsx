export default function LoginSocialButton({ icon, label, onClick }) {
  return (
    <button className="login-social-btn" onClick={onClick} type="button" aria-label={`Continue with ${label}`}>
      {icon}
      <span className="login-social-btn-label">{label}</span>
    </button>
  );
}