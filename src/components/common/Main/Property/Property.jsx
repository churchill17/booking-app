import PropertyType from "./PropertyType.jsx";
import { PROPERTY_TYPE } from "../../data.js";
import "./Property.css";
import { useRef, useState, useEffect } from "react";

export default function Property() {
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
  }, []);

  return (
    <section>
      <h2>Check property types</h2>
      <div className="scroll-wrapper">
        {canScrollLeft && (
          <button className="scroll-arrow left" onClick={() => scroll("left")}>
            &lt;
          </button>
        )}

        <div className="property-type horizontal-scroll" ref={scrollRef}>
          {PROPERTY_TYPE.map((propertyType) => (
            <PropertyType key={propertyType.title} {...propertyType} />
          ))}
        </div>
        {canScrollRight && (
          <button
            className="scroll-arrow right"
            onClick={() => scroll("right")}
          >
            &gt;
          </button>
        )}
      </div>
    </section>
  );
}
