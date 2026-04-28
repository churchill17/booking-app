import { useRef, useState, useEffect } from "react";
import HotelCard from "./HotelCard.jsx";
import "./Hotel.css";
import { formatPrice, getLowestRoomPricing } from "../../../../utils/pricing";

function getRatingLabel(avg) {
  if (!avg || avg <= 0) return "";
  if (avg >= 9.0) return "Superb";
  if (avg >= 8.0) return "Very Good";
  if (avg >= 7.0) return "Good";
  if (avg >= 6.0) return "Pleasant";
  return "Satisfactory";
}

export default function Hotel({ listings = [], loading = false }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(checkScroll, 50);
    return () => clearTimeout(id);
  }, [listings]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const cards = listings.map((item) => {
    const pricing = getLowestRoomPricing(item);
    return {
      id: item.id,
      image: item.mainImage,
      title: item.name,
      city: [item.city, item.country].filter(Boolean).join(", "),
      review: item.avgRating > 0 ? item.avgRating.toFixed(1) : "",
      comment: getRatingLabel(item.avgRating),
      commentDescription: item.reviewCount || "",
      price1: pricing.hasDiscount ? formatPrice(pricing.originalPrice) : "",
      price2: formatPrice(pricing.hasDiscount ? pricing.currentPrice : pricing.originalPrice),
    };
  });

  if (!loading && cards.length === 0) return null;

  return (
    <section className="hotel-deals">
      <h2>Hotels you&apos;ll love</h2>
      <p>You can book any of these hotels</p>
      <div className="scroll-wrapper">
        {canScrollLeft && (
          <button className="scroll-arrow left" onClick={() => scroll("left")}>
            &lt;
          </button>
        )}
        <div className="hotel-deals-scroll horizontal-scroll" ref={scrollRef}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="hotel-card-item hotel-card-skeleton" />
              ))
            : cards.map((card) => (
                <HotelCard key={card.id ?? card.title} {...card} />
              ))}
        </div>
        {canScrollRight && (
          <button className="scroll-arrow right" onClick={() => scroll("right")}>
            &gt;
          </button>
        )}
      </div>
    </section>
  );
}
