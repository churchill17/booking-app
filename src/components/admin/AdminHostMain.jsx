import React, { useCallback, useEffect, useState } from "react";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminPropertyPage  from "./AdminPropertyPage";
import AdminAnalyticsPage from "./AdminAnalyticsPage";
import AdminBookingsPage  from "./AdminBookingsPage";
import AdminCustomerPage  from "./AdminCustomerPage";
import {
  deleteListing,
  adminGetProperties,
  adminGetBookings,
  adminGetStats,
  adminApproveProperty,
} from "../host/services/hostApi";

/* ── Normalize raw property from admin_get_properties.php ─────────────── */
function normalizeAdminProperty(item) {
  const isApproved = Number(item?.is_approved) === 1;
  return {
    raw: item,
    id: item?.id,
    propertyName: item?.name || "Untitled property",
    type: item?.type || "property",
    address: item?.address || "",
    city: item?.city || "",
    country: item?.country || "",
    originalPrice: item?.original_price || "",
    currentPrice:  item?.current_price  || "",
    pricingType:   item?.pricing_type   || "per_night",
    currency:      item?.currency       || "NGN",
    status:        isApproved ? "Approved" : "Pending Approval",
    isApproved,
    avgRating:     Number(item?.avg_rating    || 0),
    totalReviews:  Number(item?.total_reviews || 0),
    totalBookings: Number(item?.total_bookings || 0),
    mainImage: item?.main_image || item?.mainImage || "",
    images:    Array.isArray(item?.images) ? item.images : [],
    rooms: Array.isArray(item?.rooms)
      ? item.rooms.map((r) => ({
          id:            r.id,
          name:          r.space_type || r.name || "Room",
          bedType:       r.bed_type   || "",
          guests:        r.guests     || 1,
          originalPrice: r.original_price || "",
          currentPrice:  r.current_price  || "",
          features:  Array.isArray(r.features)  ? r.features  : [],
          amenities: Array.isArray(r.amenities) ? r.amenities : [],
        }))
      : [],
    highlights:        Array.isArray(item?.highlights)         ? item.highlights         : [],
    popularFacilities: Array.isArray(item?.popular_facilities) ? item.popular_facilities : [],
    amenities:         Array.isArray(item?.amenities)          ? item.amenities          : [],
    faqs:              Array.isArray(item?.faqs)               ? item.faqs               : [],
    checkInFrom:    item?.check_in_from    || "",
    checkInUntil:   item?.check_in_until   || "",
    checkOutFrom:   item?.check_out_from   || "",
    checkOutUntil:  item?.check_out_until  || "",
    smokingAllowed: Boolean(item?.smoking_allowed),
    lastMinuteBookings: Boolean(item?.last_minute_bookings),
    cancellation:    item?.cancellation    || "",
    childrenPolicy:  item?.children_policy || "",
    petsPolicy:      item?.pets_policy     || "",
    cotPolicy:       item?.cot_policy      || "",
    ageRestriction:  item?.age_restriction || "",
    parties:         item?.parties         || "",
    finePrint:       item?.fine_print      || "",
    aboutProperty:   item?.about_property  || "",
    cleaningFee:     item?.cleaning_fee    || "",
    weekendRate:     item?.weekend_rate    || "",
    taxesIncluded:   Boolean(item?.taxes_included),
    createdAt:       item?.created_at      || "",
    // Host info from JOIN
    hostName:  item?.host_name        || "",
    hostEmail: item?.host_email       || "",
    firstName: item?.host_first_name  || item?.firstName || "",
    lastName:  item?.host_last_name   || item?.lastName  || "",
    email:     item?.host_email       || item?.email     || "",
    phone:     item?.phone            || "",
    // Legal
    addressLine1:         item?.address_line1          || "",
    addressLine2:         item?.address_line2          || "",
    informationCertified: item?.information_certified  || "",
  };
}

/* ── Normalize raw booking from admin_get_bookings.php ────────────────── */
function normalizeAdminBooking(item) {
  return {
    raw: item,
    id:            item?.id            || item?.booking_id,
    booking_id:    item?.id            || item?.booking_id,
    guestFirstName: item?.guest_first_name || "",
    guestLastName:  item?.guest_last_name  || "",
    guestEmail:     item?.guest_email      || "",
    guestPhone:     item?.guest_phone      || "",
    propertyName:   item?.property_name    || "",
    propertyType:   item?.property_type    || "",
    propertyCity:   item?.property_city    || "",
    propertyImage:  item?.property_image   || "",
    checkIn:        item?.check_in         || "",
    checkOut:       item?.check_out        || "",
    nights:         Number(item?.nights        || 1),
    guests:         Number(item?.guests        || 1),
    totalPrice:     Number(item?.total_price   || 0),
    currency:       item?.currency             || "NGN",
    status:         String(item?.status        || "pending").toLowerCase(),
    paymentStatus:  String(item?.payment_status || "unpaid").toLowerCase(),
    bookingDate:    item?.booking_date || item?.created_at || "",
    serviceFee:     Number(item?.service_fee   || 0),
    hostAmount:     Number(item?.host_amount   || 0),
  };
}

export default function AdminHostMain({ activePage, setActivePage }) {
  const [listings,         setListings]         = useState([]);
  const [bookings,         setBookings]         = useState([]);
  const [isLoading,        setIsLoading]        = useState(true);
  const [error,            setError]            = useState("");
  const [bookingsLoading,  setBookingsLoading]  = useState(true);
  const [bookingsError,    setBookingsError]    = useState("");
  const [dashboardStats,   setDashboardStats]   = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError,   setDashboardError]   = useState("");

  const loadListings = useCallback(async () => {
    setIsLoading(true); setError("");
    try {
      const raw = await adminGetProperties();
      setListings(raw.map(normalizeAdminProperty));
    } catch (err) {
      setError(err?.message || "Could not load listings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true); setDashboardError("");
    try {
      const stats = await adminGetStats();
      setDashboardStats(stats);
    } catch (err) {
      setDashboardError(err?.message || "Could not load stats.");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true); setBookingsError("");
    try {
      const raw = await adminGetBookings();
      setBookings(raw.map(normalizeAdminBooking));
    } catch (err) {
      setBookingsError(err?.message || "Could not load bookings.");
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
    loadDashboard();
    loadBookings();
  }, [loadListings, loadDashboard, loadBookings]);

  const handleDeleteListing = async (id) => {
    await deleteListing(id);
    await loadListings();
  };

  const handleApproveListing = async (id, approve) => {
    await adminApproveProperty(id, approve);
    await loadListings();
  };

  const refreshAll = () => Promise.all([loadListings(), loadDashboard(), loadBookings()]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <AdminDashboardPage
            setActivePage={setActivePage}
            listings={listings}
            bookings={bookings}
            isLoading={isLoading}
            error={error}
            onRefresh={refreshAll}
            dashboardStats={dashboardStats}
            dashboardLoading={dashboardLoading}
            dashboardError={dashboardError}
          />
        );
      case "property":
        return (
          <AdminPropertyPage
            listings={listings}
            isLoading={isLoading}
            error={error}
            onRefresh={loadListings}
            onDeleteListing={handleDeleteListing}
            onApproveListing={handleApproveListing}
          />
        );
      case "analytics":
        return (
          <AdminAnalyticsPage
            bookings={bookings}
            listings={listings}
            stats={dashboardStats}
          />
        );
      case "bookings":
        return (
          <AdminBookingsPage
            bookings={bookings}
            isLoading={bookingsLoading}
            error={bookingsError}
            onRefresh={loadBookings}
          />
        );
      case "customer":
        return (
          <AdminCustomerPage
            bookings={bookings}
            isLoading={bookingsLoading}
          />
        );
      default:
        return (
          <AdminDashboardPage
            setActivePage={setActivePage}
            listings={listings}
            bookings={bookings}
            isLoading={isLoading}
            error={error}
            onRefresh={refreshAll}
            dashboardStats={dashboardStats}
            dashboardLoading={dashboardLoading}
            dashboardError={dashboardError}
          />
        );
    }
  };

  return <main className="admin-host-main">{renderPage()}</main>;
}