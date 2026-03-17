import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { storeUser } from "../../utils/authUser";
import { getBookingApiUrl } from "../../utils/api";
import AuthFormField from "../../components/listproperty/components/AuthFormField.jsx";

export default function ListPropertySignup() {
  const signupApiUrl = getBookingApiUrl("owner_signup.php");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const validate = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!form.email) nextErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
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
      const response = await fetch(signupApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Sign up failed. Please try again.");
      }

      storeUser({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: "host",
      });

      navigate("/otp");
    } catch (error) {
      setSubmitError(error.message || "Sign up failed. Please try again.");
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
          Create account
        </h1>
        <p style={{ color: "var(--warmGray)", marginBottom: 18 }}>
          List your property and start welcoming guests.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <AuthFormField
            label="Email"
            id="list-property-signup-email"
            type="email"
            value={form.email}
            onChange={(event) => {
              setField("email", event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            autoComplete="email"
            error={errors.email}
          />

          <AuthFormField
            label="First name"
            id="list-property-signup-first-name"
            type="text"
            value={form.firstName}
            onChange={(event) => {
              setField("firstName", event.target.value);
              if (errors.firstName) {
                setErrors((prev) => ({ ...prev, firstName: "" }));
              }
            }}
            autoComplete="given-name"
            error={errors.firstName}
          />

          <AuthFormField
            label="Last name"
            id="list-property-signup-last-name"
            type="text"
            value={form.lastName}
            onChange={(event) => {
              setField("lastName", event.target.value);
              if (errors.lastName) {
                setErrors((prev) => ({ ...prev, lastName: "" }));
              }
            }}
            autoComplete="family-name"
            error={errors.lastName}
          />

          <AuthFormField
            label="Password"
            id="list-property-signup-password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(event) => {
              setField("password", event.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            autoComplete="new-password"
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
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p
            style={{
              marginTop: 14,
              textAlign: "center",
              color: "var(--midnightBlue)",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/list-property/login"
              style={{ color: "var(--teal)", fontWeight: 700 }}
            >
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
