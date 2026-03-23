import React, { useCallback, useEffect, useState } from "react";
import "./HostMain.css";
import DashboardPage from "./DashboardPage";
import PropertyPage from "./PropertyPage";
import AnalyticsPage from "./AnalyticsPage";
import BookingsPage from "./BookingsPage";
import CustomerPage from "./CustomerPage";
import SettingsPage from "./SettingsPage";
import {
  getBookings,
  createListing,
  deleteListing,
  getDashboardStats,
  getListings,
  updateListing,
} from "./services/hostApi";

export default function HostMain({ activePage, setActivePage }) {
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
    setIsLoading(true);
    setError("");
    try {
      const data = await getListings();
      setListings(data);
    } catch (err) {
      setError(err?.message || "Could not load listings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError("");
    try {
      const data = await getDashboardStats();
      setDashboardHost(data.host);
      setDashboardStats(data.stats);
    } catch (err) {
      setDashboardError(err?.message || "Could not load dashboard stats.");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true);
    setBookingsError("");
    try {
      const data = await getBookings();
      setBookings(data);
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
          <DashboardPage
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
      case "property":
        return (
          <PropertyPage
            listings={listings}
            isLoading={isLoading}
            error={error}
            onRefresh={loadListings}
            onCreateListing={handleCreateListing}
            onUpdateListing={handleUpdateListing}
            onDeleteListing={handleDeleteListing}
          />
        );
      case "analytics":
        return <AnalyticsPage />;
      case "bookings":
        return (
          <BookingsPage
            bookings={bookings}
            isLoading={bookingsLoading}
            error={bookingsError}
            onRefresh={refreshBookings}
          />
        );
      case "customer":
        return <CustomerPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
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

  return <main className="host-main">{renderPage()}</main>;
}
