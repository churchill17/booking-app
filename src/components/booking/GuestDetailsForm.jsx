import React, { useState } from "react";
import "./GuestDetailsForm.css";

const GuestDetailsForm = ({ user = {}, onNext, onBack, initialValues = null }) => {
  const [form, setForm] = useState({
    firstName: initialValues?.firstName || "",
    lastName: initialValues?.lastName || "",
    email: initialValues?.email || user?.email || "",
    country: initialValues?.country || "Nigeria",
    phone: initialValues?.phone || "",
    bookingFor: initialValues?.bookingFor || "self",
    arrivalTime: initialValues?.arrivalTime || "",
    specialRequests: initialValues?.specialRequests || "",
  });

  const [errors, setErrors] = useState({});

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{7,}$/.test(form.phone.replace(/\s/g, ""))) {
      errs.phone = "Enter a valid phone number";
    }
    return errs;
  };

  return (
    <div className="gdf">
      <h2 className="gdf__section-title">
        <span className="gdf__title-accent">01</span>
        Guest Details
      </h2>

      <div className="gdf__notice">
        <span className="gdf__notice-icon">✦</span>
        Fill in the <strong>required fields</strong> marked with an asterisk to continue.
      </div>

      <div className="gdf__grid gdf__grid--two">
        <div className="gdf__field">
          <label className="gdf__label">First Name <span className="gdf__required">*</span></label>
          <input
            className={`gdf__input${errors.firstName ? " gdf__input--error" : ""}`}
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handle}
            placeholder="e.g. Churchill"
          />
          {errors.firstName && <p className="gdf__error">{errors.firstName}</p>}
        </div>
        <div className="gdf__field">
          <label className="gdf__label">Last Name <span className="gdf__required">*</span></label>
          <input
            className={`gdf__input${errors.lastName ? " gdf__input--error" : ""}`}
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handle}
            placeholder="e.g. Amaechi"
          />
          {errors.lastName && <p className="gdf__error">{errors.lastName}</p>}
        </div>
      </div>

      <div className="gdf__field">
        <label className="gdf__label">Email Address <span className="gdf__required">*</span></label>
        <input
          className={`gdf__input${errors.email ? " gdf__input--error" : ""}`}
          type="email"
          name="email"
          value={form.email}
          onChange={handle}
          placeholder="your@email.com"
        />
        {errors.email
          ? <p className="gdf__error">{errors.email}</p>
          : <p className="gdf__hint">Booking confirmation will be sent here</p>
        }
      </div>

      <div className="gdf__grid gdf__grid--two">
        <div className="gdf__field">
          <label className="gdf__label">Country / Region <span className="gdf__required">*</span></label>
          <div className="gdf__select-wrapper">
            <select className="gdf__select" name="country" value={form.country} onChange={handle}>
              <option>Nigeria</option>
              <option>Ghana</option>
              <option>Kenya</option>
              <option>South Africa</option>
              <option>United Kingdom</option>
              <option>United States</option>
            </select>
            <span className="gdf__select-arrow">▾</span>
          </div>
        </div>
        <div className="gdf__field">
          <label className="gdf__label">Phone Number <span className="gdf__required">*</span></label>
          <div className={`gdf__phone-group${errors.phone ? " gdf__phone-group--error" : ""}`}>
            <div className="gdf__phone-prefix">
              <span>🇳🇬</span>
              <span>+234</span>
              <span className="gdf__select-arrow">▾</span>
            </div>
            <input
              className="gdf__input gdf__input--phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handle}
              placeholder="080 0000 0000"
            />
          </div>
          {errors.phone
            ? <p className="gdf__error">{errors.phone}</p>
            : <p className="gdf__hint">Used to verify and contact you about your stay</p>
          }
        </div>
      </div>

      <div className="gdf__divider" />

      <h2 className="gdf__section-title">
        <span className="gdf__title-accent">02</span>
        Booking Preferences
      </h2>

      <div className="gdf__field">
        <label className="gdf__label">Who are you booking for? <span className="gdf__optional">(optional)</span></label>
        <div className="gdf__radio-group">
          <label className={`gdf__radio-card ${form.bookingFor === "self" ? "gdf__radio-card--active" : ""}`}>
            <input type="radio" name="bookingFor" value="self" checked={form.bookingFor === "self"} onChange={handle} />
            <span className="gdf__radio-icon">👤</span>
            <span>I am the main guest</span>
          </label>
          <label className={`gdf__radio-card ${form.bookingFor === "other" ? "gdf__radio-card--active" : ""}`}>
            <input type="radio" name="bookingFor" value="other" checked={form.bookingFor === "other"} onChange={handle} />
            <span className="gdf__radio-icon">👥</span>
            <span>Booking for someone else</span>
          </label>
        </div>
      </div>

      <div className="gdf__divider" />

      <h2 className="gdf__section-title">
        <span className="gdf__title-accent">03</span>
        Special Requests
      </h2>
      <p className="gdf__section-sub">We'll do our best — requests aren't guaranteed but we'll try.</p>

      <div className="gdf__field">
        <label className="gdf__label">Special Requests <span className="gdf__optional">(optional)</span></label>
        <textarea
          className="gdf__textarea"
          name="specialRequests"
          value={form.specialRequests}
          onChange={handle}
          placeholder="e.g. late check-in, high floor, extra pillows..."
          rows={4}
        />
      </div>

      <div className="gdf__divider" />

      <h2 className="gdf__section-title">
        <span className="gdf__title-accent">04</span>
        Check-in Details
      </h2>

      <div className="gdf__check-in-info">
        <div className="gdf__check-in-item">
          <span className="gdf__check-in-icon">✓</span>
          <span>Room ready for check-in between <strong>14:00 and 00:00</strong></span>
        </div>
        <div className="gdf__check-in-item">
          <span className="gdf__check-in-icon">🛎</span>
          <span>24-hour front desk — help whenever you need it!</span>
        </div>
      </div>

      <div className="gdf__field">
        <label className="gdf__label">Estimated Arrival Time <span className="gdf__optional">(optional)</span></label>
        <div className="gdf__select-wrapper">
          <select className="gdf__select" name="arrivalTime" value={form.arrivalTime} onChange={handle}>
            <option value="">Please select</option>
            <option>14:00 – 15:00</option>
            <option>15:00 – 16:00</option>
            <option>16:00 – 17:00</option>
            <option>17:00 – 18:00</option>
            <option>18:00 – 19:00</option>
            <option>19:00 – 20:00</option>
            <option>20:00 – 21:00</option>
            <option>21:00 – 22:00</option>
            <option>22:00 – 23:00</option>
          </select>
          <span className="gdf__select-arrow">▾</span>
        </div>
      </div>

      <div className="gdf__actions">
        {onBack && (
          <button className="gdf__back-btn" onClick={onBack}>
            ← Back
          </button>
        )}
        <button
          className="gdf__next-btn"
          onClick={() => {
            const errs = validate();
            if (Object.keys(errs).length) { setErrors(errs); return; }
            onNext && onNext(form);
          }}
        >
          Next: Final Details
          <span className="gdf__btn-arrow">→</span>
        </button>
        <span className="gdf__price-match">
          <span>🏷</span> We Price Match
        </span>
      </div>
    </div>
  );
};

export default GuestDetailsForm;
