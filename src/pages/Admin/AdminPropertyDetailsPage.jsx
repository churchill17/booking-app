import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminPropertyDetails from "../../components/admin/AdminPropertyDetails";
import { adminGetProperties } from "../../components/host/services/hostApi";

function getAdminUser() {
  try { return JSON.parse(localStorage.getItem("adminUser")); } catch { return null; }
}

export default function AdminPropertyDetailsPage() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getAdminUser();
    if (!user) { navigate("/list-property/login", { replace: true }); return; }
    adminGetProperties()
      .then(raw => {
        // Normalize minimally so AdminPropertyDetails can find the property
        setListings(raw.map(p => ({
          ...p,
          raw: p,
          id: p.id,
          propertyName: p.name || "Untitled",
          isApproved: Boolean(p.is_approved),
          status: p.is_approved ? "Approved" : "Pending Approval",
          mainImage: p.main_image || "",
          avgRating: Number(p.avg_rating || 0),
          totalReviews: Number(p.total_reviews || 0),
          totalBookings: Number(p.total_bookings || 0),
          firstName: p.host_first_name || "",
          lastName: p.host_last_name || "",
          email: p.host_email || "",
          phone: p.host_phone || "",
          hostName: `${p.host_first_name || ""} ${p.host_last_name || ""}`.trim(),
          rooms: Array.isArray(p.rooms) ? p.rooms : [],
          images: Array.isArray(p.images) ? p.images : [],
          amenities: Array.isArray(p.amenities) ? p.amenities : [],
          popularFacilities: Array.isArray(p.popular_facilities) ? p.popular_facilities : [],
          highlights: Array.isArray(p.highlights) ? p.highlights : [],
          faqs: Array.isArray(p.faqs) ? p.faqs : [],
        })));
      })
      .catch(() => navigate("/admin", { replace: true }));
  }, [navigate]);

  return <AdminPropertyDetails listings={listings} />;
}