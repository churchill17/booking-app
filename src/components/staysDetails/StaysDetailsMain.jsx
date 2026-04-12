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

  const data = {
    name: property.name || "",
    stars: property.stars || 0,
    address: [property.address, property.city, property.country]
      .filter(Boolean)
      .join(", "),
    rating: property.rating || 0,
    reviewCount: property.reviewCount || 0,
    ratingLabel: property.ratingLabel || "",
    locationScore: property.locationScore || 0,
    coupleLocationScore: property.coupleLocationScore || 0,
    description: {
      accommodations: property.accommodations || "",
      descriptionFacilities: property.descriptionFacilities || "",
      descriptionDining: property.descriptionDining || "",
      locationDescription: property.locationDescription || "",
    },
    highlights:
      Array.isArray(property.highlights) && property.highlights.length > 0
        ? property.highlights.map((h) => ({
            icon: h.icon || "",
            text: h.text || "",
          }))
        : [],
    popularFacilities: property.popularFacilities,
    images: Array.isArray(property.images)
      ? property.images.map((img) => ({
          alt: property.name,
          src: img.image_url || img.src || img,
        }))
      : [],
    rooms: Array.isArray(property.rooms)
      ? property.rooms.map((room) => ({
          id: room.id,
          name: room.name || room.space_type || "Room",
          availability: room.availability || null,
          bedType: room.bedType || room.bed_type || "",
          size: room.size || "27 m²",
          features: room.features,
          amenities: room.amenities,
          choices: room.choices,
          originalPrice: room.originalPrice,
          currentPrice: room.currentPrice,
          discount: room.discount,
          deal: room.deal,
          guests: room.guests || property.guests,
        }))
      : [],
    guestReviews: property.guestReviews || {
      overall: property.guestReviews?.overall || 0,
      totalReviews: property.guestReviews?.totalReviews || 0,
      categories: property.guestReviews?.categories || [],
      reviews: property.guestReviews?.reviews || [],
    },
    facilities: property.facilities || {
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
      general: [],
      wellness: [],
      cleaning: [],
      business: [],
      languages: [],
    },
    houseRules: {
      checkInFrom: property.checkInFrom || property.check_in_from,
      checkInUntil: property.checkInUntil || property.check_in_until,
      checkOutFrom: property.checkOutFrom || property.check_out_from,
      checkOutUntil: property.checkOutUntil || property.check_out_until,
      cancellation: property.cancellation || "",
      childrenPolicy: property.childrenPolicy || property.children_policy || "",
      cotPolicy: property.cotPolicy || property.cot_policy || "",
      ageRestriction: property.ageRestriction || property.age_restriction || "",
      petsPolicy:
        property.petsPolicy ||
        property.pets_policy ||
        property.pets ||
        "No pets policy specified.",
      paymentMethods: property.paymentMethods || [],
      parties:
        property.parties || property.parties_allowed
          ? "Parties allowed."
          : "Parties/events are not allowed.",
      finePrint: property.finePrint || "",
    },
    faqs: property.faqs || [],
    currency: property.currency || "NGN",
    taxesIncluded:
      typeof property.taxesIncluded !== "undefined"
        ? property.taxesIncluded
        : typeof property.taxes_included !== "undefined"
          ? property.taxes_included
          : false,
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
