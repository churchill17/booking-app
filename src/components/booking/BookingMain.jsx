import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "./BookingMain.css";

import BookingHeader from "./BookingHeader";
import HotelCard from "./HotelCard";
import GuestDetailsForm from "./GuestDetailsForm";
import GoodToKnow from "./GoodToKnow";
import PaymentForm from "./PaymentForm";
import BookingConfirmation from "./BookingConfirmation";

import { getPublicProperty, createBooking } from "../host/services/hostApi";
import { getStoredUser } from "../../utils/authUser";
import { loadSearch } from "../../utils/searchStorage";

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fmt = (n, currency = "NGN") =>
  `${currency} ${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const BookingMain = () => {
  const { propertyId, roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const saved = loadSearch();
  const toISO = (d) => (d instanceof Date ? d.toISOString() : d || "");

  const checkInISO =
    searchParams.get("checkIn") || toISO(saved?.checkIn) || "";
  const checkOutISO =
    searchParams.get("checkOut") || toISO(saved?.checkOut) || "";
  const adults = parseInt(searchParams.get("adults"), 10) || saved?.adults || 1;
  const step = parseInt(searchParams.get("step"), 10) || 1;

  const goToStep = (n, replace = false) => {
    const params = new URLSearchParams(searchParams);
    params.set("step", n);
    navigate(`?${params.toString()}`, { replace });
  };
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestForm, setGuestForm] = useState(null);
  const [bookingRef, setBookingRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublicProperty(propertyId);
        setProperty(data);
      } catch {
        setError(
          "Could not load property details. Please go back and try again.",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [propertyId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          color: "#182435",
        }}
      >
        Loading booking details…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          color: "#e07b3f",
        }}
      >
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          color: "#182435",
        }}
      >
        Property not found.
      </div>
    );
  }

  // ── Find selected room ────────────────────────────────────────
  const room =
    (property.rooms || []).find((r) => String(r.id) === String(roomId)) ||
    property.rooms?.[0] ||
    {};

  // ── Date / price calculations ─────────────────────────────────
  const nights =
    checkInISO && checkOutISO
      ? Math.max(
          1,
          Math.round((new Date(checkOutISO) - new Date(checkInISO)) / 86400000),
        )
      : 1;

  const daysAway = checkInISO
    ? Math.round((new Date(checkInISO) - Date.now()) / 86400000)
    : null;

  const currency = property.currency || "NGN";
  const basePrice = Number(room.currentPrice || room.originalPrice || 0);
  const originalTotal = basePrice * nights;
  const totalPrice = originalTotal;

  // ── Stored user ───────────────────────────────────────────────
  const storedUser = getStoredUser("guest") || {};

  // ── Data objects for child components ─────────────────────────
  const hotelData = {
    name: property.name || "Property",
    stars: property.stars || 0,
    address: [property.address, property.city, property.country]
      .filter(Boolean)
      .join(", "),
    locationLabel: property.ratingLabel
      ? `${property.ratingLabel} location`
      : "",
    rating: String(property.avgRating || ""),
    ratingLabel: property.ratingLabel || "",
    reviewCount: property.totalReviews || 0,
    amenities: (property.amenities || [])
      .slice(0, 4)
      .map((a) => ({ icon: "✓", label: String(a) })),
  };

  const checkInTime = [property.checkInFrom, property.checkInUntil]
    .filter(Boolean)
    .join(" – ");
  const checkOutTime = [property.checkOutFrom, property.checkOutUntil]
    .filter(Boolean)
    .join(" – ");

  const breakfastChoice =
    (room.choices || []).find((c) => c.toLowerCase().includes("breakfast")) ||
    "";

  const bookingData = {
    checkIn: {
      date: formatDate(checkInISO) || "TBD",
      time: checkInTime,
    },
    checkOut: {
      date: formatDate(checkOutISO) || "TBD",
      time: checkOutTime,
    },
    urgency:
      daysAway !== null && daysAway >= 0 && daysAway <= 7
        ? `Just ${daysAway} day${daysAway !== 1 ? "s" : ""} away!`
        : "",
    selection: `${nights} night${nights !== 1 ? "s" : ""}, 1 room for ${adults} adult${adults !== 1 ? "s" : ""}`,
    roomType: `1 × ${room.name || "Room"}`,
    guests: `${adults} adult${adults !== 1 ? "s" : ""}`,
    breakfast: breakfastChoice,
    originalPrice: originalTotal > 0 ? fmt(originalTotal, currency) : "",
    discount: null,
    totalPrice: totalPrice > 0 ? fmt(totalPrice, currency) : "",
    totalPriceUSD: "",
    refNumber: bookingRef,
    cancelDeadline: formatDate(checkInISO) || "",
  };

  const goodToKnow = [
    ...(room.choices || []).map((c) => ({ text: c, type: "ok" })),
    ...(room.features || [])
      .filter((f) => !(room.choices || []).includes(f))
      .map((f) => ({ text: f, type: "ok" })),
  ].filter((p) => p.text);

  const userData = {
    email: storedUser.email || "",
  };

  const steps = ["Your selection", "Your details", "Finish booking"];

  // ── Step handlers ─────────────────────────────────────────────
  const handleSelectionNext = () => goToStep(2);

  const handleDetailsNext = (form) => {
    setGuestForm(form);
    goToStep(3);
  };

  const handleComplete = async (paymentForm) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createBooking({
        property_id: propertyId,
        room_id: roomId,
        check_in: checkInISO,
        check_out: checkOutISO,
        guests: adults,
        nights,
        total_price: totalPrice,
        currency,
        guest_first_name: guestForm?.firstName || "",
        guest_last_name: guestForm?.lastName || "",
        guest_email: guestForm?.email || storedUser.email || "",
        guest_phone: guestForm?.phone || "",
        special_requests: guestForm?.specialRequests || "",
        booking_for: guestForm?.bookingFor || "self",
        arrival_time: guestForm?.arrivalTime || "",
        card_holder: paymentForm?.cardName || "",
        card_number: paymentForm?.cardNumber?.replace(/\s/g, "") || "",
        card_expiry: paymentForm?.expiry || "",
      });
      setBookingRef(result?.booking_id || result?.ref || `STV-${Date.now()}`);
      navigate("/", { replace: true });
    } catch (err) {
      setSubmitError(err.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="bm">
      <BookingHeader steps={steps} currentStep={step} />

      <main className={`bm__layout ${step === 4 ? "bm__layout--confirm" : ""}`}>
        {step !== 4 && (
          <aside className="bm__aside">
            <HotelCard hotel={hotelData} booking={bookingData} />

            {step === 3 && (
              <div className="bm__aside-extra">
                <div
                  className="bm__panel"
                  style={{
                    padding: "1.25rem 1.4rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#182435",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Cancellation Policy
                  </h3>
                  <div className="pf__cancel-info">
                    <div className="pf__cancel-row pf__cancel-row--free">
                      <span className="pf__cancel-dot pf__cancel-dot--teal" />
                      <span>
                        Free cancellation before{" "}
                        <strong>{bookingData.cancelDeadline}</strong>
                      </span>
                    </div>
                    {totalPrice > 0 && (
                      <div className="pf__cancel-row">
                        <span className="pf__cancel-dot" />
                        <span>From 00:00 on that date</span>
                        <span className="pf__cancel-amount">
                          {bookingData.totalPrice}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pf__payment-schedule">
                    <span className="pf__schedule-icon">📅</span>
                    <div>
                      <p className="pf__schedule-title">No payment today</p>
                      <p className="pf__schedule-desc">
                        You'll pay when you stay. Payment handled by the
                        property.
                      </p>
                    </div>
                  </div>

                  <div style={{ height: "1px", background: "#eee" }} />

                  <h3
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#182435",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Promo Code
                  </h3>
                  <div className="pf__promo-group">
                    <input
                      className="pf__input pf__input--promo"
                      type="text"
                      placeholder="Enter promo code"
                    />
                    <button className="pf__promo-btn">Apply</button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}

        <section className="bm__content">
          {/* ── Step 1: Your selection ── */}
          {step === 1 && (
            <div className="bm__panel">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#182435",
                    margin: 0,
                  }}
                >
                  Review Your Selection
                </h2>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "#b3aca9",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  You're booking{" "}
                  <strong style={{ color: "#182435" }}>
                    {room.name || "a room"}
                  </strong>{" "}
                  at{" "}
                  <strong style={{ color: "#182435" }}>{property.name}</strong>{" "}
                  for {bookingData.selection}.
                </p>
                {checkInISO && checkOutISO && (
                  <p
                    style={{ fontSize: "0.88rem", color: "#b3aca9", margin: 0 }}
                  >
                    Check-in:{" "}
                    <strong style={{ color: "#182435" }}>
                      {bookingData.checkIn.date}
                    </strong>
                    {"  →  "}
                    Check-out:{" "}
                    <strong style={{ color: "#182435" }}>
                      {bookingData.checkOut.date}
                    </strong>
                  </p>
                )}
                {totalPrice > 0 && (
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#19907e",
                      fontWeight: 700,
                      margin: 0,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {bookingData.totalPrice}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#b3aca9",
                        fontWeight: 400,
                        marginLeft: "0.5rem",
                      }}
                    >
                      {nights} night{nights !== 1 ? "s" : ""}
                    </span>
                  </p>
                )}
                <button
                  style={{
                    alignSelf: "flex-end",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "#19907e",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.85rem 1.75rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                  onClick={handleSelectionNext}
                >
                  Continue to Your Details →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Guest details ── */}
          {step === 2 && (
            <>
              <div className="bm__panel">
                <GuestDetailsForm
                  user={userData}
                  onNext={handleDetailsNext}
                  onBack={() => goToStep(1)}
                />
              </div>
              {goodToKnow.length > 0 && <GoodToKnow points={goodToKnow} />}
            </>
          )}

          {/* ── Step 3: Payment ── */}
          {step === 3 && (
            <>
              <div className="bm__panel">
                <PaymentForm
                  onComplete={handleComplete}
                  onBack={() => goToStep(2)}
                  submitting={submitting}
                  submitError={submitError}
                />
              </div>
              {goodToKnow.length > 0 && <GoodToKnow points={goodToKnow} />}
            </>
          )}

          {/* ── Step 4: Confirmation ── */}
          {step === 4 && (
            <div className="bm__panel bm__panel--confirm">
              <BookingConfirmation
                hotel={hotelData}
                booking={bookingData}
                user={userData}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BookingMain;
