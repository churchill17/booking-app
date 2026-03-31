import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProperty } from "../host/services/hostApi";
import StaysDetailsHeader from "./StaysDetailsHeader";
import PhotoGallery from "./PhotoGallery";
import PropertyOverview from "./PropertyOverview";
import AvailabilityTable from "./AvailabilityTable";
import GuestReviews from "./GuestReviews";
import FacilitiesSection from "./FacilitiesSection";
import HouseRules from "./HouseRules";
import StaysDetailsFAQ from "./StaysDetailsFAQ";
import "./StaysDetailsMain.css";
import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";

const StaysDetailsMain = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await getPublicProperty(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
        setError("Could not load property.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  if (error)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  if (!property)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Property not found.
      </div>
    );

  const amenities = property.amenities || [];

  const data = {
    name: property.name || "",
    stars: 0,
    address: [property.address, property.city, property.country]
      .filter(Boolean)
      .join(", "),
    rating: 0,
    reviewCount: 0,
    ratingLabel: "",
    locationScore: 0,
    coupleLocationScore: 0,
    description: {
      accommodations: property.about_property || "",
      facilities: "",
      dining: "",
      location: property.about_neighbourhood || "",
    },
    highlights: [
      property.breakfast && { icon: "🍳", text: "Breakfast included" },
      property.parking &&
        property.parking !== "No" && {
          icon: "🅿️",
          text: `Parking: ${property.parking}`,
        },
      property.apartment_size && {
        icon: "📐",
        text: `${property.apartment_size} ${property.size_unit || ""}`,
      },
    ].filter(Boolean),
    popularFacilities: amenities,
    images: (property.images || []).map((img) => ({
      alt: property.name,
      src: img.image_url,
      placeholder: "🏨",
    })),
    rooms: (property.rooms || []).map((room) => ({
      id: room.id,
      name: room.space_type || "Room",
      availability: null,
      bed:
        [
          room.single_beds > 0 && `${room.single_beds} single bed(s)`,
          room.double_beds > 0 && `${room.double_beds} double bed(s)`,
          room.king_beds > 0 && `${room.king_beds} king bed(s)`,
          room.super_king_beds > 0 &&
            `${room.super_king_beds} super king bed(s)`,
          room.sofa_beds > 0 && `${room.sofa_beds} sofa bed(s)`,
        ]
          .filter(Boolean)
          .join(", ") || "—",
      size: "",
      features: [],
      amenities: amenities,
      choices: [],
      originalPrice: "",
      currentPrice: property.nightly_rate
        ? `${property.currency || "NGN"} ${property.nightly_rate}`
        : "",
      discount: "",
      deal: "",
      guests: property.guests || 1,
    })),
    guestReviews: {
      overall: 0,
      totalReviews: 0,
      categories: [],
      reviews: [],
      topics: [],
    },
    // All facility groups default to empty arrays to prevent .map() crash
    facilities: {
      general: (property.amenities || []).map((a) => ({ name: a, extra: null })),
    },
    houseRules: {
      checkInFrom: property.check_in_from,
      checkInUntil: property.check_in_until,
      checkOutFrom: property.check_out_from,

      checkOutUntil: property.check_out_until,
      cancellation: "",
      children: property.allow_children
        ? "Children are welcome."
        : "No children allowed.",
      cotPolicy: "",
      ageRestriction: "",
      pets: property.pets || "No pets policy specified.",
      paymentMethods: [],
      parties: property.parties_allowed
        ? "Parties allowed."
        : "Parties/events are not allowed.",
      finePrint: "",
    },
    faqs: [],
  };

  return (
    <div className="stays-details-main">
      <Header />
      <StaysDetailsHeader data={data} />

      <PhotoGallery images={data.images} />

      <section id="overview">
        <PropertyOverview
          description={data.description}
          highlights={data.highlights}
          popularFacilities={data.popularFacilities}
          coupleLocationScore={data.coupleLocationScore}
        />
      </section>

      <section id="info-prices">
        <AvailabilityTable rooms={data.rooms} />
      </section>

      <section id="guest-reviews">
        <GuestReviews guestReviews={data.guestReviews} />
      </section>

      <section id="facilities">
        <FacilitiesSection facilities={data.facilities} />
      </section>

      <section id="house-rules">
        <HouseRules houseRules={data.houseRules} />
      </section>

      <section id="important-legal">
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "16px",
            margin: "2rem 0",
            color: "#333",
          }}
        >
          <h2>Important & Legal</h2>
          <p>
            All important and legal information about this property will be
            displayed here.
          </p>
        </div>
      </section>

      <StaysDetailsFAQ faqs={data.faqs} />

      <Footer />
    </div>
  );
};

export default StaysDetailsMain;
