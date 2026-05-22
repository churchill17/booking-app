import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "./BookingMain.css";

import BookingHeader from "./BookingHeader";
import HotelCard from "./HotelCard";
import GuestDetailsForm from "./GuestDetailsForm";
import GoodToKnow from "./GoodToKnow";
import BookingConfirmation from "./BookingConfirmation";
import {
  getPublicProperty,
  initializePayment,
  verifyPayment,
} from "../host/services/hostApi";
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

  const checkInISO = searchParams.get("checkIn") || toISO(saved?.checkIn) || "";
  const checkOutISO =
    searchParams.get("checkOut") || toISO(saved?.checkOut) || "";
  const adults = parseInt(searchParams.get("adults"), 10) || saved?.adults || 1;
  const children =
    parseInt(searchParams.get("children"), 10) || saved?.children || 0;
  const rooms = parseInt(searchParams.get("rooms"), 10) || saved?.rooms || 1;
  const step = parseInt(searchParams.get("step"), 10) || 1;

  // ── Multi-room selections from AvailabilityTable ──────────────
  const roomsJson = searchParams.get("rooms_json");
  const roomSelections = roomsJson
    ? (() => {
        try {
          return JSON.parse(decodeURIComponent(roomsJson));
        } catch {
          return null;
        }
      })()
    : null;

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
  const [bookingResult] = useState(null);

  // Load Paystack inline script
  useEffect(() => {
    if (!document.getElementById("paystack-inline-script")) {
      const script = document.createElement("script");
      script.id = "paystack-inline-script";
      script.src = "https://js.paystack.co/v2/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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

  const totalPrice = roomSelections
    ? roomSelections.reduce(
        (sum, r) => sum + Number(r.currentPrice || 0) * r.qty * nights,
        0,
      )
    : basePrice * nights;

  const originalTotal = roomSelections
    ? roomSelections.reduce(
        (sum, r) =>
          sum + Number(r.originalPrice || r.currentPrice || 0) * r.qty * nights,
        0,
      )
    : basePrice * nights;

  const totalRoomsSelected = roomSelections
    ? roomSelections.reduce((sum, r) => sum + r.qty, 0)
    : rooms;

  const roomSummaryLine = roomSelections
    ? roomSelections.map((r) => `${r.qty}× ${r.name}`).join(", ")
    : room.name || "Room";

  // ── Stored user ───────────────────────────────────────────────
  const storedUser = getStoredUser("guest") || {};

  // ── Data objects for child components ─────────────────────────
  const hotelData = {
    name: property.name || "Property",
    image: property.mainImage || "",
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

    selection: [
      `${nights} night${nights !== 1 ? "s" : ""}`,
      `${totalRoomsSelected} room${totalRoomsSelected !== 1 ? "s" : ""}`,
      `${adults} adult${adults !== 1 ? "s" : ""}`,

      children > 0 ? `${children} child${children !== 1 ? "ren" : ""}` : "",
    ]
      .filter(Boolean)
      .join(", "),
    roomType: roomSummaryLine,
    guests: [
      `${adults} adult${adults !== 1 ? "s" : ""}`,
      children > 0 ? `${children} child${children !== 1 ? "ren" : ""}` : "",
    ]
      .filter(Boolean)
      .join(", "),
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

  const handleComplete = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const initData = await initializePayment({
        property_id: propertyId,
        room_detail_id: roomId || null,
        check_in: checkInISO,
        check_out: checkOutISO,
        guests: adults + children,
        nights,
        guest_first_name: guestForm?.firstName || "",
        guest_last_name: guestForm?.lastName || "",
        guest_email: guestForm?.email || storedUser.email || "",
        guest_phone: guestForm?.phone || "",
        special_requests: guestForm?.specialRequests || "",
        booking_for: guestForm?.bookingFor || "self",
        arrival_time: guestForm?.arrivalTime || "",
      });

      if (!initData.success) {
        setSubmitError(initData.message || "Could not initialize payment.");
        setSubmitting(false);
        return;
      }

      const { reference, access_code } = initData;

      // Step 2: Open Paystack popup
      const PaystackPop = window.PaystackPop;
      if (!PaystackPop) {
        setSubmitError(
          "Payment provider failed to load. Please refresh and try again.",
        );
        setSubmitting(false);
        return;
      }

      const paystackInstance = new PaystackPop();
      paystackInstance.newTransaction({
        key: "pk_test_95c775e02b43baa6a46ab8afaaef6c6cefc5a8f9",
        accessCode: access_code,
        onSuccess: async (transaction) => {
          // Step 3: Verify on YOUR backend
          try {
            const verifyData = await verifyPayment(transaction.reference);
            if (!verifyData.success) {
              setSubmitError(
                "Payment could not be verified. Please contact support with ref: " +
                  reference,
              );
              setSubmitting(false);
              return;
            }

            // Payment verified — show confirmation
            setBookingRef(reference);
            goToStep(4);
          } catch {
            setSubmitError(
              "Verification failed. Please contact support with ref: " +
                reference,
            );
          } finally {
            setSubmitting(false);
          }
        },
        onCancel: () => {
          setSubmitError("Payment was cancelled. You can try again.");
          setSubmitting(false);
        },
      });
    } catch (err) {
      setSubmitError(err.message || "Payment failed. Please try again.");
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

                {/* Date pickers */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <label
                      style={{
                        fontSize: 13,
                        color: "#888",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Check-in <span style={{ color: "#e25c5c" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={checkInISO ? checkInISO.substring(0, 10) : ""}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        const params = new URLSearchParams(searchParams);
                        params.set("checkIn", e.target.value);
                        navigate(`?${params.toString()}`, { replace: true });
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: checkInISO
                          ? "1px solid #ddd"
                          : "1px solid #e25c5c",
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <label
                      style={{
                        fontSize: 13,
                        color: "#888",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Check-out <span style={{ color: "#e25c5c" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={checkOutISO ? checkOutISO.substring(0, 10) : ""}
                      min={
                        checkInISO
                          ? checkInISO.substring(0, 10)
                          : new Date().toISOString().split("T")[0]
                      }
                      onChange={(e) => {
                        const params = new URLSearchParams(searchParams);
                        params.set("checkOut", e.target.value);
                        navigate(`?${params.toString()}`, { replace: true });
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: checkOutISO
                          ? "1px solid #ddd"
                          : "1px solid #e25c5c",
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

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
                      color: "#1a6bb5",
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

                {(!checkInISO || !checkOutISO) && (
                  <p style={{ fontSize: 13, color: "#e25c5c", margin: 0 }}>
                    Please select your check-in and check-out dates to continue.
                  </p>
                )}

                <button
                  style={{
                    alignSelf: "flex-end",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: checkInISO && checkOutISO ? "#1a6bb5" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.85rem 1.75rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor:
                      checkInISO && checkOutISO ? "pointer" : "not-allowed",
                    fontFamily: "Georgia, serif",
                  }}
                  onClick={() => {
                    if (!checkInISO || !checkOutISO) return;
                    handleSelectionNext();
                  }}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    padding: "0.5rem 0",
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
                    Confirm & Pay
                  </h2>

                  {/* Booking summary */}
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: 10,
                      padding: "1rem 1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.88rem",
                        color: "#555",
                      }}
                    >
                      <span>Property</span>
                      <strong style={{ color: "#182435" }}>
                        {property.name}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.88rem",
                        color: "#555",
                      }}
                    >
                      <span>Room</span>
                      <strong style={{ color: "#182435" }}>
                        {roomSummaryLine}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.88rem",
                        color: "#555",
                      }}
                    >
                      <span>Dates</span>
                      <strong style={{ color: "#182435" }}>
                        {bookingData.checkIn.date} → {bookingData.checkOut.date}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.88rem",
                        color: "#555",
                      }}
                    >
                      <span>Guests</span>
                      <strong style={{ color: "#182435" }}>
                        {bookingData.guests}
                      </strong>
                    </div>
                    <div
                      style={{
                        height: 1,
                        background: "#e5e5e5",
                        margin: "0.25rem 0",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "1rem",
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ color: "#182435" }}>Total</span>
                      <span style={{ color: "#1a6bb5" }}>
                        {bookingData.totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Security note */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      background: "#f0f7ff",
                      borderRadius: 8,
                      padding: "0.85rem 1rem",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>🔒</span>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#182435",
                        }}
                      >
                        Secure payment via Paystack
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        Your card details are handled entirely by Paystack.
                        iBookNova never sees or stores your card information.
                      </p>
                    </div>
                  </div>

                  {submitError && (
                    <p
                      style={{
                        color: "#e07b3f",
                        fontSize: "0.82rem",
                        margin: 0,
                        textAlign: "center",
                        background: "#fff5f0",
                        padding: "0.75rem",
                        borderRadius: 8,
                      }}
                    >
                      {submitError}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => goToStep(2)}
                      style={{
                        flex: 1,
                        padding: "0.85rem",
                        border: "1.5px solid #ddd",
                        borderRadius: 10,
                        background: "#fff",
                        color: "#182435",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.88rem",
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleComplete}
                      disabled={submitting}
                      style={{
                        flex: 2,
                        padding: "0.85rem",
                        border: "none",
                        borderRadius: 10,
                        background: submitting ? "#ccc" : "#1a6bb5",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontSize: "0.95rem",
                        fontFamily: "Georgia, serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      🔒{" "}
                      {submitting
                        ? "Processing…"
                        : `Pay ${bookingData.totalPrice}`}
                    </button>
                  </div>
                </div>
              </div>
              {goodToKnow.length > 0 && <GoodToKnow points={goodToKnow} />}
            </>
          )}
          {/* ── Step 4: Confirmation ── */}
          {step === 4 && (
            <div className="bm__panel bm__panel--confirm">
              <BookingConfirmation
                hotel={hotelData}
                booking={{
                  ...bookingData,
                  refNumber: bookingRef,
                  roomType: bookingResult?.roomName || bookingData.roomType,
                }}
                user={userData}
                receiptData={{
                  propertyName: property.name || "Property",
                  propertyImage: property.mainImage || "",
                  propertyAddress: [
                    property.address,
                    property.city,
                    property.country,
                  ]
                    .filter(Boolean)
                    .join(", "),
                  propertyStars: property.stars || 0,
                  propertyRating: property.avgRating || 0,
                  propertyRatingLabel: property.ratingLabel || "",
                  propertyReviewCount: property.totalReviews || 0,
                  refNumber: bookingRef,
                  checkInDate: bookingData.checkIn.date,
                  checkInTime: bookingData.checkIn.time,
                  checkOutDate: bookingData.checkOut.date,
                  checkOutTime: bookingData.checkOut.time,
                  nights,
                  roomType: bookingResult?.roomName || room.name || "Room",
                  guests: bookingData.guests,
                  breakfast: breakfastChoice,
                  cancelDeadline: bookingData.cancelDeadline,
                  amenities: (property.amenities || []).slice(0, 6).map(String),
                  guestFirstName: guestForm?.firstName || "",
                  guestLastName: guestForm?.lastName || "",
                  guestEmail: guestForm?.email || storedUser.email || "",
                  guestPhone: guestForm?.phone || "",
                  arrivalTime: guestForm?.arrivalTime || "",
                  specialRequests: guestForm?.specialRequests || "",
                  currency,
                  basePrice,
                  originalPrice: originalTotal,
                  totalPrice,
                  taxesIncluded: !!property.taxesIncluded,
                  issuedAt: new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                }}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BookingMain;
