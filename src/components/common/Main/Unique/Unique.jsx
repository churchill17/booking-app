import { useRef, useState, useEffect } from "react";
import ExploreCard from "./ExploreCard.jsx";
import "./Unique.css";

function getRatingLabel(avg) {
  if (!avg || avg <= 0) return "";
  if (avg >= 9.0) return "Superb";
  if (avg >= 8.0) return "Very Good";
  if (avg >= 7.0) return "Good";
  if (avg >= 6.0) return "Pleasant";
  return "Satisfactory";
}

function formatPrice(price) {
  if (!price) return "";
  return `NGN ${Number(price).toLocaleString()}`;
}

export default function Unique({ listings = [], loading = false }) {
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

  const cards = listings.map((item) => ({
    id: item.id,
    image: item.mainImage,
    title: item.name,
    city: [item.city, item.country].filter(Boolean).join(", "),
    review: item.avgRating > 0 ? item.avgRating.toFixed(1) : "",
    comment: getRatingLabel(item.avgRating),
    commentDescription: item.reviewCount || "",
    starting: "Starting from",
    price1: formatPrice(item.currentPrice || item.originalPrice),
  }));

  if (!loading && cards.length === 0) return null;

  return (
    <section className="unique-stays">
      <h2>Discover our finest unique stays</h2>
      <p>Explore everything from luxury villas to unique igloos and boats.</p>
      <div className="scroll-wrapper">
        {canScrollLeft && (
          <button className="scroll-arrow left" onClick={() => scroll("left")}>
            &lt;
          </button>
        )}
        <div className="unique-card horizontal-scroll" ref={scrollRef}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="unique-card-item hotel-card-skeleton" />
              ))
            : cards.map((card) => (
                <ExploreCard key={card.id ?? card.title} {...card} />
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
