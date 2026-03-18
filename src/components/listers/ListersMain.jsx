import React, { useCallback, useEffect, useState } from "react";
import "./ListersMain.css";
import DashboardPage from "./DashboardPage";
import PropertyPage from "./PropertyPage";
import AnalyticsPage from "./AnalyticsPage";
import PaymentPage from "./PaymentPage";
import CustomerPage from "./CustomerPage";
import SettingsPage from "./SettingsPage";
import {
  createListing,
  deleteListing,
  getListings,
  updateListing,
} from "./services/listersApi";

export default function ListersMain({ activePage, setActivePage }) {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadListings();
  }, [loadListings]);

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
            onRefresh={loadListings}
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
      case "payment":
        return <PaymentPage />;
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
            onRefresh={loadListings}
          />
        );
    }
  };

  return <main className="listers-main">{renderPage()}</main>;
}
