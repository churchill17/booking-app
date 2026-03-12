export default function SignupSocialButton({ icon, label, onClick }) {
  return (
    <button
      className="signup-social-btn"
      onClick={onClick}
      type="button"
      aria-label={`Continue with ${label}`}
    >
      {icon}
      <span className="signup-social-btn-label">{label}</span>
    </button>
  );
}
