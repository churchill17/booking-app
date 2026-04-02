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

  // Use highlights from property.highlights if available (array of {icon, text}), else fallback to old logic
  // Store icon as string for compatibility with ObjectArrayInput and preview rendering
  const highlights =
    Array.isArray(property.highlights) && property.highlights.length > 0
      ? property.highlights.map((h) => ({
          icon: h.icon || "",
          text: h.text || "",
        }))
      : [
          property.breakfast && {
            icon: "FaUtensils",
            text: "Breakfast included",
          },
          property.parking &&
            property.parking !== "No" && {
              icon: "FaParking",
              text: `Parking: ${property.parking}`,
            },
          property.apartment_size && {
            icon: "FaMapMarkerAlt",
            text: `${property.apartment_size} ${property.size_unit || ""}`,
          },
        ].filter(Boolean);

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
    highlights,
    popularFacilities: amenities,
    images: (property.images || []).map((img) => ({
      alt: property.name,
      src: img.image_url,
      placeholder: "🏨",
    })),
    rooms: (property.rooms || []).map((room) => ({
      id: room.id,
      name: room.space_type || room.name || "Room",
      availability: room.availability || null,
      bedType: room.bed_type || "",
      size: room.size || "27 m²",
      features: room.features || [
        "Private suite",
        "Garden view",
        "Inner courtyard view",
        "Air conditioning",
        "Ensuite bathroom",
        "Flat-screen TV",
        "Coffee machine",
        "Free WiFi",
      ],
      amenities: room.amenities || amenities,
      choices: room.choices || [
        "Continental breakfast included",
        "Total cost to cancel",
        "No prepayment needed – pay at the property",
      ],
      originalPrice: room.originalPrice,
      currentPrice: room.currentPrice,
      discount: room.discount,
      deal: room.deal,
      guests: room.guests || property.guests || 1,
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
      bathroom: [],
      foodAndDrink: [],
      safety: [],
      bedroom: [],
      outdoors: [],
      kitchen: [],
      internet: "",
      parking: "",
      receptionServices: [],
      familyFriendly: [],
      general: (property.amenities || []).map((a) => ({
        name: a,
        extra: null,
      })),
      wellness: [],
      cleaning: [],
      business: [],
      languages: [],
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
