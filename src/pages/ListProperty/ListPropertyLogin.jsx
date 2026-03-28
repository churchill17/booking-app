import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { getStoredUser, storeUser } from "../../utils/authUser";
import { getBookingApiUrl } from "../../utils/api";
import AuthFormField from "../../components/listproperty/components/AuthFormField.jsx";

export default function ListPropertyLogin() {
  const loginApiUrl = getBookingApiUrl("login.php");
  const navigate = useNavigate();
  const existingUser = getStoredUser("host");
  const [email, setEmail] = useState(existingUser?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const nextErrors = {};
    if (!email) nextErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!password) nextErrors.password = "Password is required";
    return nextErrors;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(loginApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          context: "host",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Login failed. Please try again.");
      }

      const responseUser = data?.user || {};
      const profile = existingUser || {};
      storeUser({
        firstName: responseUser.firstName || profile.firstName || "Host",
        lastName: responseUser.lastName || profile.lastName || "User",
        email: email.trim(),
        role: "host",
      });
      console.log("ListPropertyLogin role: host");
      localStorage.setItem("token", data.token);
      navigate("/list-property");
    } catch (error) {
      setSubmitError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--lightBeige)",
        display: "grid",
        placeItems: "center",
        padding: "24px 16px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#fff",
          border: "1px solid var(--warmGray)",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1 style={{ color: "var(--midnightBlue)", marginBottom: 8 }}>
          Log in
        </h1>
        <p style={{ color: "var(--warmGray)", marginBottom: 18 }}>
          Continue your property listing.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <AuthFormField
            label="Email"
            id="list-property-login-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            autoComplete="email"
            error={errors.email}
          />

          <AuthFormField
            label="Password"
            id="list-property-login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            autoComplete="current-password"
            error={errors.password}
            rightIcon={
              showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />
            }
            rightIconLabel={showPassword ? "Hide password" : "Show password"}
            onRightIconClick={() => setShowPassword((prev) => !prev)}
          />

          {submitError ? (
            <p style={{ color: "#b42318", marginBottom: 10 }}>{submitError}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 46,
              borderRadius: 8,
              border: "none",
              background: "var(--teal)",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.85 : 1,
            }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p
            style={{
              marginTop: 14,
              textAlign: "center",
              color: "var(--midnightBlue)",
            }}
          >
            Need an account?{" "}
            <Link
              to="/list-property/signup"
              style={{ color: "var(--teal)", fontWeight: 700 }}
            >
              Create account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
