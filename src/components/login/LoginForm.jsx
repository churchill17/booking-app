import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import LoginSocialButton from "./LoginSocialButton";
import "./LoginForm.css";
import LoginInputGroup from "./LoginInputGroup";
import { storeUser } from "../../utils/authUser";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
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
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await fetch(
        "https://ibooknova.com.ng/booking_api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

    if (data.success === false) {
    setErrors({ general: data.message });
    return;
}

   storeUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email || email.trim(),
    id: data.id,
    role: data.is_host ? "host" : "guest",
});
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-card-accent" />

        <p className="login-card-eyebrow">Welcome back</p>
        <h1 className="login-card-title">Sign in or create</h1>
        <p className="login-card-subtitle">
          Use your Booking.com account to access
          <br />
          our services worldwide.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <LoginInputGroup
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

          <LoginInputGroup
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: "" }));
            }}
            error={errors.password}
          />

          <button
            className="login-btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Log in"}
          </button>

          <p className="login-form-switch">
            Don't have an account? <Link to="/sign-up">Create one</Link>
          </p>
        </form>

        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-text">
            or use one of these options
          </span>
          <span className="login-divider-line" />
        </div>

        <div className="login-social-buttons">
          <LoginSocialButton
            icon={<FcGoogle size={22} />}
            label="Google"
            onClick={() => {}}
          />
          <LoginSocialButton
            icon={<FaApple size={22} color="#000" />}
            label="Apple"
            onClick={() => {}}
          />
          <LoginSocialButton
            icon={<FaFacebook size={22} color="#1877F2" />}
            label="Facebook"
            onClick={() => {}}
          />
        </div>

        <div className="login-card-footer">
          <p>
            By signing in or creating an account, you agree with our{" "}
            <a href="#">Terms &amp; conditions</a> and{" "}
            <a href="#">Privacy statement</a>
          </p>
        </div>
      </div>

      <footer className="login-page-footer">
        All rights reserved. Copyright (2006–2026) – Booking.com™
      </footer>
    </main>
  );
}
