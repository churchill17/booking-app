import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthFormField from "../../components/listproperty/components/AuthFormField";
import { getBookingApiUrl } from "../../utils/api";

const cardStyle = {
  width: "100%",
  maxWidth: 460,
  background: "#fff",
  border: "1px solid var(--warmGray)",
  borderRadius: 14,
  padding: 28,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
};

const submitBtnStyle = {
  width: "100%",
  height: 46,
  borderRadius: 8,
  border: "none",
  background: "var(--teal)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  marginTop: 4,
};

export default function ListPropertyResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!confirm) errs.confirm = "Please confirm your password";
    else if (confirm !== password) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(getBookingApiUrl("reset-password.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, context: "host" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false)
        throw new Error(data?.message || "Reset failed. Please try again.");
      setDone(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── No token ── */
  if (!token) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--lightBeige)", display: "grid", placeItems: "center", padding: "24px 16px" }}>
        <section style={cardStyle}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>⚠️</div>
            <h1 style={{ color: "var(--midnightBlue)", marginBottom: 8 }}>Invalid link</h1>
            <p style={{ color: "var(--warmGray)", lineHeight: 1.6, marginBottom: 24 }}>
              This reset link is missing or expired. Please request a new one.
            </p>
            <Link
              to="/list-property/forgot-password"
              style={{
                display: "block", textAlign: "center", textDecoration: "none",
                height: 46, lineHeight: "46px", borderRadius: 8,
                background: "var(--teal)", color: "#fff", fontWeight: 700,
              }}
            >
              Request new link
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--lightBeige)", display: "grid", placeItems: "center", padding: "24px 16px" }}>
      <section style={cardStyle}>
        {done ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
            <h1 style={{ color: "var(--midnightBlue)", marginBottom: 8 }}>Password updated!</h1>
            <p style={{ color: "var(--warmGray)", lineHeight: 1.6, marginBottom: 24 }}>
              Your password has been reset. You can now log in with your new password.
            </p>
            <Link
              to="/list-property/login"
              style={{
                display: "block", textAlign: "center", textDecoration: "none",
                height: 46, lineHeight: "46px", borderRadius: 8,
                background: "var(--teal)", color: "#fff", fontWeight: 700,
              }}
            >
              Log in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ color: "var(--midnightBlue)", marginBottom: 8 }}>Reset password</h1>
            <p style={{ color: "var(--warmGray)", marginBottom: 18, lineHeight: 1.6 }}>
              Choose a strong password you haven't used before.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <AuthFormField
                label="New password"
                id="lp-reset-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                }}
                autoComplete="new-password"
                error={errors.password}
                rightIcon={showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                rightIconLabel={showPassword ? "Hide password" : "Show password"}
                onRightIconClick={() => setShowPassword((p) => !p)}
              />

              <AuthFormField
                label="Confirm new password"
                id="lp-reset-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your new password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" }));
                }}
                autoComplete="new-password"
                error={errors.confirm}
                rightIcon={showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                rightIconLabel={showConfirm ? "Hide password" : "Show password"}
                onRightIconClick={() => setShowConfirm((p) => !p)}
              />

              {submitError && (
                <p style={{ color: "#b42318", fontSize: 13, marginBottom: 10 }}>{submitError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ ...submitBtnStyle, opacity: loading ? 0.85 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Resetting…" : "Reset password"}
              </button>

              <p style={{ marginTop: 14, textAlign: "center", color: "var(--midnightBlue)" }}>
                <Link to="/list-property/login" style={{ color: "var(--teal)", fontWeight: 700, textDecoration: "none" }}>
                  Back to log in
                </Link>
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
