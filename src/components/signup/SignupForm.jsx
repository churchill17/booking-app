import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SignupSocialButton from "./SignupSocialButton";
import SignupInputGroup from "./SignupInputGroup";
import { storeUser } from "../../utils/authUser";
import { getBookingApiUrl } from "../../utils/api";
import "./SignupForm.css";

export default function SignupForm() {
  const signupApiUrl = getBookingApiUrl("signup.php");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await fetch(signupApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Sign up failed. Please try again.");
      }

      storeUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
      });
      navigate("/otp");
    } catch (error) {
      setSubmitError(error.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-card">
        <div className="signup-card-accent" />

        <p className="signup-card-eyebrow">Welcome back</p>
        <h1 className="signup-card-title">
          Create
          <br />
          an account
        </h1>
        <p className="signup-card-subtitle">
          Use your Booking.com account to access
          <br />
          our services worldwide.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <SignupInputGroup
            label="First name"
            id="first-name"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (errors.firstName)
                setErrors((prev) => ({ ...prev, firstName: "" }));
            }}
            error={errors.firstName}
            autoComplete="given-name"
          />

          <SignupInputGroup
            label="Last name"
            id="last-name"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (errors.lastName)
                setErrors((prev) => ({ ...prev, lastName: "" }));
            }}
            error={errors.lastName}
            autoComplete="family-name"
          />

          <SignupInputGroup
            label="Email address"
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={errors.email}
          />

          <SignupInputGroup
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: "" }));
            }}
            error={errors.password}
            autoComplete="new-password"
            rightIcon={
              showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />
            }
            rightIconLabel={showPassword ? "Hide password" : "Show password"}
            onRightIconClick={() => setShowPassword((prev) => !prev)}
          />

          <button
            className="signup-btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="signup-form-switch">
            Already have an account? <Link to="/log-in">Sign in</Link>
          </p>

          {submitError && <p className="signup-submit-error">{submitError}</p>}
        </form>

        <div className="signup-divider">
          <span className="signup-divider-line" />
          <span className="signup-divider-text">
            or use one of these options
          </span>
          <span className="signup-divider-line" />
        </div>

        <div className="signup-social-buttons">
          <SignupSocialButton
            icon={<FcGoogle size={22} />}
            label="Google"
            onClick={async () => {
              const response = await fetch(
                "https://ibooknova.com.ng/booking_api/google_auth.php",
              );
              const data = await response.json();
              window.location.href = data.url;
            }}
          />
          <SignupSocialButton
            icon={<FaApple size={22} color="#000" />}
            label="Apple"
            onClick={() => {}}
          />
          <SignupSocialButton
            icon={<FaFacebook size={22} color="#1877F2" />}
            label="Facebook"
            onClick={() => {}}
          />
        </div>

        <div className="signup-card-footer">
          <p>
            By signing in or creating an account, you agree with our{" "}
            <a href="#">Terms &amp; conditions</a> and{" "}
            <a href="#">Privacy statement</a>
          </p>
        </div>
      </div>

      <footer className="signup-page-footer">
        All rights reserved. Copyright (2006–2026) – Booking.com™
      </footer>
    </main>
  );
}
