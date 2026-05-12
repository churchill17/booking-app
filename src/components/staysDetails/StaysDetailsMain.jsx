import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  const { state } = useLocation();
  const cardPreview = state?.cardPreview || null;
  const from = state?.from || null;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardReserveRoomId, setCardReserveRoomId] = useState(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await getPublicProperty(id);
        console.group("=== STAYS DETAILS DEBUG ===");
        console.log("Full property object:", data);
        console.group("Descriptions");
        console.log("accommodations:", data?.accommodations);
        console.log("descriptionFacilities:", data?.descriptionFacilities);
        console.log("descriptionDining:", data?.descriptionDining);
        console.log("location:", data?.location);
        console.groupEnd();
        console.group("Rooms");
        console.log("rooms:", data?.rooms);
        console.groupEnd();
        console.group("Media & Highlights");
        console.log("images:", data?.images);
        console.log("highlights:", data?.highlights);
        console.log("popularFacilities:", data?.popularFacilities);
        console.groupEnd();
        console.group("Ratings & Reviews");
        console.log("avgRating:", data?.avgRating);
        console.log("totalReviews:", data?.totalReviews);
        console.log("ratingLabel:", data?.ratingLabel);
        console.log("guestReviews:", data?.guestReviews);
        console.groupEnd();
        console.group("House Rules");
        console.log("checkInFrom:", data?.checkInFrom);
        console.log("checkInUntil:", data?.checkInUntil);
        console.log("checkOutFrom:", data?.checkOutFrom);
        console.log("checkOutUntil:", data?.checkOutUntil);
        console.log("cancellation:", data?.cancellation);
        console.log("petsPolicy:", data?.petsPolicy);
        console.log("parties:", data?.parties);
        console.log("finePrint:", data?.finePrint);
        console.log("paymentMethods:", data?.paymentMethods);
        console.groupEnd();
        console.group("Facilities");
        console.log("facilities (object):", data?.facilities);
        console.log("amenities:", data?.amenities);
        console.groupEnd();
        console.group("FAQs & Misc");
        console.log("faqs:", data?.faqs);
        console.log("currency:", data?.currency);
        console.log("taxesIncluded:", data?.taxesIncluded);
        console.log("aboutProperty:", data?.aboutProperty);
        console.groupEnd();
        console.groupEnd();
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

  const avgRating = Number(property.avgRating || property.avg_rating || 0);
  const ratingLabel =
    property.ratingLabel ||
    (avgRating >= 9
      ? "Superb"
      : avgRating >= 8
        ? "Very good"
        : avgRating >= 7
          ? "Good"
          : avgRating >= 6
            ? "Pleasant"
            : "");

  const data = {
    ...property,
    rating: avgRating,
    reviewCount: property.totalReviews || property.total_reviews || 0,
    ratingLabel,
    address: [property.address, property.city, property.country].filter(Boolean).join(", "),
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
          size: room.size || "",
          features: Array.isArray(room.features)
            ? room.features
            : room.features
              ? String(room.features).split(",").map((s) => s.trim())
              : [],
          amenities: Array.isArray(room.amenities)
            ? room.amenities
            : room.amenities
              ? String(room.amenities).split(",").map((s) => s.trim())
              : [],
          originalPrice: room.originalPrice || room.original_price || "",
          currentPrice: room.currentPrice || room.current_price || "",
          discount: room.discount || "",
          deal: room.deal || "",
          guests: room.guests || property.guests || 1,
        }))
      : [],
    highlights:
      Array.isArray(property.highlights) && property.highlights.length > 0
        ? property.highlights.map((h) => ({ icon: h.icon || "", text: h.text || "" }))
        : [],
    accommodations: property.accommodations,
    dining: property.descriptionDining,
    location: property.location,
    houseRules: {
      checkInFrom: property.checkInFrom || property.check_in_from || "",
      checkInUntil: property.checkInUntil || property.check_in_until || "",
      checkOutFrom: property.checkOutFrom || property.check_out_from || "",
      checkOutUntil: property.checkOutUntil || property.check_out_until || "",
      cancellation: property.cancellation || "",
      childrenPolicy: property.childrenPolicy || property.children_policy || "",
      cotPolicy: property.cotPolicy || property.cot_policy || "",
      ageRestriction: property.ageRestriction || property.age_restriction || "",
      petsPolicy: property.petsPolicy || property.pets_policy || property.pets || "",
      paymentMethods: Array.isArray(property.paymentMethods) ? property.paymentMethods : [],
      parties: property.parties || property.parties_policy || "",
      finePrint: property.finePrint || property.fine_print || "",
    },
  };

  const handleCardReserve = () => {
    const matched = cardPreview?.roomName
      ? data.rooms.find((r) => r.name === cardPreview.roomName) || data.rooms[0]
      : data.rooms[0];
    if (matched) {
      setCardReserveRoomId(String(matched.id));
      setTimeout(() => {
        document.getElementById("info-prices")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <>
      <Header />
      <div className="stays-details-main">
      <StaysDetailsHeader
          data={data}
          from={from}
          city={cardPreview?.cityLabel || property?.city || ""}
        />

      <PhotoGallery
        images={data.images}
        propertyName={data.name}
        rooms={data.rooms}
      />

      <section id="overview">
        <PropertyOverview
          accommodations={data.accommodations}
          dining={data.dining}
          location={data.location}
          highlights={data.highlights}
          popularFacilities={data.popularFacilities}
          coupleLocationScore={data.coupleLocationScore}
          cardPreview={cardPreview}
          onCardReserve={handleCardReserve}
        />
      </section>

      <section id="info-prices">
        <AvailabilityTable
          rooms={data.rooms}
          taxesIncluded={!!property.taxesIncluded}
          currency={data.currency || "NGN"}
          propertyId={id}
          preSelectRoomId={cardReserveRoomId}
        />
      </section>

      <section id="guest-reviews">
        <GuestReviews
          overall={data.rating}
          totalReviews={data.reviewCount}
          rating={data.rating}
          ratingLabel={data.ratingLabel}
          categories={(data.guestReviews && data.guestReviews.categories) || []}
          reviews={(data.guestReviews && data.guestReviews.reviews) || []}
          rooms={data.rooms && data.rooms.length > 0 ? data.rooms[0] : {}}
        />
      </section>

      <section id="facilities">
        <FacilitiesSection
          popularFacilities={data.popularFacilities || []}
          amenities={data.amenities || []}
        />
      </section>

      <section id="house-rules">
        <HouseRules houseRules={data.houseRules} propertyName={data.name} />
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

      <StaysDetailsFAQ faqs={data.faqs} propertyName={data.name} />

      <Footer />
    </div>
    </>
  );
};

export default StaysDetailsMain;
