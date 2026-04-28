import "./StaysMain.css";

import { useEffect, useState } from "react";

import FAQSection from "./FAQSection";
import AccommodationTypes from "./AccommodationTypes";
import HeroSearch from "./HeroSearch";
import LastMinuteStays from "./LastMinuteStays";
import PopularStays from "./PopularStays";
import Header from "../common/Header/Header";

import { getPublicListings } from "../host/services/hostApi";
import { formatPrice, getLowestRoomPricing } from "../../utils/pricing";

export default function StaysMain({ propertyType }) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getPublicListings();
        setListings(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    if (!item.type || !propertyType) return false;
    const itemType = String(item.type).toLowerCase();
    const propType = String(propertyType).toLowerCase();
    return (
      itemType === propType ||
      itemType + "s" === propType ||
      itemType === propType + "s"
    );
  });

  const mapStay = (item) => ({
    ...(() => {
      const pricing = getLowestRoomPricing(item);
      return {
        hasDiscount: pricing.hasDiscount,
        originalPrice: formatPrice(pricing.originalPrice),
        currentPrice: formatPrice(pricing.currentPrice),
      };
    })(),
    id: item.id,
    name: item.name,
    location: [item.city, item.country].filter(Boolean).join(", "),
    score: item.avgRating || 0,
    rating: "",
    ratingLabel: "",
    reviewCount: "",
    description: item.type,
    image:
      item.mainImage ||
      (Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]?.image_url || item.images[0]?.src || item.images[0]
        : ""),
    lastMinuteBookings: item.lastMinuteBookings || false,
  });

  // Only show listings with lastMinuteBookings for LastMinuteStays
  const lastMinuteStays = filteredListings
    .filter((item) => item.lastMinuteBookings)
    .slice(0, 4)
    .map(mapStay);
  const popularStays = filteredListings.slice(0, 4).map(mapStay);

  const faqs = [];
  const accommodationTypes = [];

  const lastMinuteTitle = `Last minute ${propertyType?.toLowerCase()} near you tonight`;
  const popularStaysTitle = `Popular ${propertyType?.toLowerCase()} near you`;

  return (
    <>
      <Header />
      <main className="stays-main">
        <HeroSearch
          hero={{
            title: "Find the perfect stay",
            subtitle: "Browse real properties from our hosts",
          }}
          propertyType={propertyType}
        />
        {filteredListings.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            No properties found for this type.
          </p>
        ) : (
          <>
            <LastMinuteStays stays={lastMinuteStays} title={lastMinuteTitle} />
            <PopularStays
              stays={popularStays}
              propertyType={propertyType}
              title={popularStaysTitle}
            />
          </>
        )}
        <FAQSection faqs={faqs} />
        <AccommodationTypes types={accommodationTypes} />
      </main>
    </>
  );
}
