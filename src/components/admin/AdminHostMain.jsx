import React, { useCallback, useEffect, useState } from "react";
import "./AdminHostMain.css";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminPropertyPage from "./AdminPropertyPage";
import AdminAnalyticsPage from "./AdminAnalyticsPage";
import AdminBookingsPage from "./AdminBookingsPage";
import AdminCustomerPage from "./AdminCustomerPage";
import {
  deleteListing,
  updateListing,
  adminGetProperties,
  adminGetBookings,
  adminGetStats,
  adminApproveProperty,
} from "../host/services/hostApi";
export default function AdminHostMain({ activePage, setActivePage }) {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");
  const [dashboardHost, setDashboardHost] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

 const loadListings = useCallback(async () => {
  setIsLoading(true); setError("");
  try { setListings(await adminGetProperties()); }
  catch (err) { setError(err?.message || "Could not load listings."); }
  finally { setIsLoading(false); }
}, []);

  const loadDashboard = useCallback(async () => {
  setDashboardLoading(true); setDashboardError("");
  try {
    const stats = await adminGetStats();
    setDashboardStats(stats);
    // Admin doesn't have a "host" profile — use placeholder
    setDashboardHost({ firstName: "Admin", lastName: "" });
  }
  catch (err) { setDashboardError(err?.message || "Could not load stats."); }
  finally { setDashboardLoading(false); }
}, []);

const loadBookings = useCallback(async () => {
  setBookingsLoading(true); setBookingsError("");
  try { setBookings(await adminGetBookings()); }
  catch (err) { setBookingsError(err?.message || "Could not load bookings."); }
  finally { setBookingsLoading(false); }
}, []);

  useEffect(() => {
    loadListings();
    loadDashboard();
    loadBookings();
  }, [loadBookings, loadDashboard, loadListings]);

  const refreshDashboard = async () => {
    await Promise.all([loadListings(), loadDashboard()]);
  };

  const refreshBookings = async () => {
    await loadBookings();
  };

  const handleCreateListing = async (payload) => {
    await createListing(payload);
    await loadListings();
  };

  const handleUpdateListing = async (id, updates) => {
    await updateListing(id, updates);
    await loadListings();
  };

  const handleDeleteListing = async (id) => {
    await deleteListing(id);
    await loadListings();
  };

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
            onRefresh={refreshDashboard}
            dashboardHost={dashboardHost}
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
      onApproveListing={async (id, approve) => {
        await adminApproveProperty(id, approve);
        await loadListings();
      }}
    />
  );
      case "analytics":
        return <AdminAnalyticsPage />;
      case "bookings":
        return (
          <AdminBookingsPage
            bookings={bookings}
            isLoading={bookingsLoading}
            error={bookingsError}
            onRefresh={refreshBookings}
          />
        );
      case "customer":
        return <AdminCustomerPage />;
      default:
        return (
          <AdminDashboardPage
            setActivePage={setActivePage}
            listings={listings}
            isLoading={isLoading}
            error={error}
            onRefresh={refreshDashboard}
            dashboardHost={dashboardHost}
            dashboardStats={dashboardStats}
            dashboardLoading={dashboardLoading}
            dashboardError={dashboardError}
          />
        );
    }
  };

  return <main className="admin-host-main">{renderPage()}</main>;
}
