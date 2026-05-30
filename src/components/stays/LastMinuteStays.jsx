import "./LastMinuteStays.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StayCard from "./StayCard";

export default function LastMinuteStays({ stays, title }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [stays]);

  return (
    <section className="last-minute">
      <div className="last-minute__header">
        <h2 className="last-minute__title">{title}</h2>
      </div>

      <div className="last-minute__scroll-wrapper">
        {stays.length > 4 && canScrollLeft && (
          <button
            className="last-minute__scroll-arrow last-minute__scroll-arrow--left"
            onClick={() => scroll("left")}
          >
            &lt;
          </button>
        )}
        <div className="last-minute__grid" ref={scrollRef}>
          {stays.map((stay) => (
            <StayCard
              key={stay.id}
              stay={stay}
              onClick={() => navigate(`/stays/${stay.id}`, { state: { from: { label: "Hotels", path: "/stays" } } })}
            />
          ))}
        </div>
        {stays.length > 4 && canScrollRight && (
          <button
            className="last-minute__scroll-arrow last-minute__scroll-arrow--right"
            onClick={() => scroll("right")}
          >
            &gt;
          </button>
        )}
      </div>
    </section>
  );
}
