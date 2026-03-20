import React, { useState, useCallback, useEffect } from "react";
import PropertyDetails from "./PropertyDetails";
import { getListings, updateListing, deleteListing } from "./services/hostApi";

export default function PropertyDetailsWrapper() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getListings();
      setListings(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleEdit = async (property) => {
    await updateListing(property.id, property);
    await loadListings();
  };
  const handleDelete = async (id) => {
    await deleteListing(id);
    await loadListings();
  };

  return (
    <PropertyDetails
      listings={listings}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  );
}
