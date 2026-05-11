import { useState } from "react";
import { Link } from "react-router-dom";
import AuthFormField from "../../components/listproperty/components/AuthFormField";
import { getBookingApiUrl } from "../../utils/api";

const cardStyle = {
  width: "100%",
  maxWidth: 460,
  background: "#fff",
  border: "1px solid var(--slateGray)",
  borderRadius: 14,
  padding: 28,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
};

const submitBtnStyle = {
  width: "100%",
  height: 46,
  borderRadius: 8,
  border: "none",
  background: "var(--steelBlue)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 4,
};

export default function ListPropertyForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Email address is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getBookingApiUrl("forgot-password.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), context: "host" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false)
        throw new Error(data?.message || "Something went wrong. Please try again.");
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--blueWhite)",
        display: "grid",
        placeItems: "center",
        padding: "24px 16px",
      }}
    >
      <section style={cardStyle}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>📧</div>
            <h1 style={{ color: "var(--darkNavyBlue)", marginBottom: 8 }}>Check your inbox</h1>
            <p style={{ color: "var(--slateGray)", lineHeight: 1.6, marginBottom: 8 }}>
              We sent a reset link to <strong style={{ color: "var(--darkNavyBlue)" }}>{email}</strong>.
              Open it and follow the instructions.
            </p>
            <p style={{ color: "var(--slateGray)", fontSize: 13, marginBottom: 24 }}>
              Didn't get it? Check your spam folder or{" "}
              <button
                onClick={() => setSent(false)}
                style={{
                  background: "none", border: "none", color: "var(--steelBlue)",
                  fontWeight: 600, cursor: "pointer", padding: 0, fontSize: "inherit",
                  textDecoration: "underline",
                }}
              >
                try again
              </button>.
            </p>
            <Link
              to="/list-property/login"
              style={{
                display: "block", textAlign: "center", textDecoration: "none",
                height: 46, lineHeight: "46px", borderRadius: 8,
                background: "var(--steelBlue)", color: "#fff", fontWeight: 700,
              }}
            >
              Back to log in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ color: "var(--darkNavyBlue)", marginBottom: 8 }}>Forgot password?</h1>
            <p style={{ color: "var(--slateGray)", marginBottom: 18, lineHeight: 1.6 }}>
              Enter the email linked to your host account and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <AuthFormField
                label="Email address"
                id="lp-forgot-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                autoComplete="email"
                error={error}
              />

              <button
                type="submit"
                disabled={loading}
                style={{ ...submitBtnStyle, opacity: loading ? 0.85 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <p style={{ marginTop: 14, textAlign: "center", color: "var(--darkNavyBlue)" }}>
                Remembered it?{" "}
                <Link to="/list-property/login" style={{ color: "var(--steelBlue)", fontWeight: 700, textDecoration: "none" }}>
                  Log in
                </Link>
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
