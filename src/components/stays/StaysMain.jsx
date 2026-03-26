import "./StaysMain.css";

import { useEffect, useState } from "react";
import HeroSearch from "./HeroSearch";
import LastMinuteStays from "./LastMinuteStays";
import PopularStays from "./PopularStays";
import AccommodationTypes from "./AccommodationTypes";
import FAQSection from "./FAQSection";
import { getListings } from "../host/services/hostApi";

export default function StaysMain({ propertyType }) {
  const [listings, setListings] = useState([]);
  // Removed unused loading and error state

  useEffect(() => {
    async function fetchListings() {
      // Removed unused loading and error state
      try {
        const data = await getListings();
        setListings(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchListings();
  }, []);

  // Filter and map listings for last minute stays (e.g., by createdAt or availability)
  const lastMinuteStays = listings.slice(0, 4).map((item) => ({
    id: item.id,
    name: item.propertyName,
    location: [item.address, item.city, item.country]
      .filter(Boolean)
      .join(", "),
    score: item.avgRating || 0,
    reviewCount: item.totalReviews || 0,
    reviewLabel:
      item.avgRating >= 8.5
        ? "Fabulous"
        : item.avgRating >= 7
          ? "Very good"
          : "Good",
    description: item.type,
    price: item.price ? `NGN ${item.price}` : "",
    image: item.mainImage,
  }));  
  
  const popularStays = listings.slice(0, 4).map((item) => ({
    id: item.id,
    name: item.propertyName,
    location: [item.address, item.city, item.country]
      .filter(Boolean)
      .join(", "),
    score: item.avgRating || 0,
    reviewCount: item.totalReviews || 0,
    reviewLabel:
      item.avgRating >= 8.5
        ? "Fabulous"
        : item.avgRating >= 7
          ? "Very good"
          : "Good",
    description: item.type,
    price: item.price ? `NGN ${item.price}` : "",
    image: item.mainImage,
  }));  

  // FAQ and accommodation types could be static or fetched if available from backend
  // For now, keep as empty arrays or static fallback
  const faqs = [];
  const accommodationTypes = [];

  const lastMinuteTitle = `Last minute ${propertyType.toLowerCase()} near you tonight`; 

  const popularStaysTitle = `Popular ${propertyType.toLowerCase()} near you`;

  return (
    <main className="stays-main">
      <HeroSearch
        hero={{
          title: "Find the perfect stay",
          subtitle: "Browse real properties from our hosts",
        }}
        propertyType={propertyType}
      />
      <LastMinuteStays stays={lastMinuteStays} title={lastMinuteTitle} />
      <PopularStays stays={popularStays} propertyType={propertyType}  title={popularStaysTitle} />
      <FAQSection faqs={faqs} />
      <AccommodationTypes types={accommodationTypes} />
    </main>
  );
}
