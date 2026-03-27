import PropertyType from "./PropertyType.jsx";
import { useEffect, useRef, useState } from "react";
import { getListings } from "../../../host/services/hostApi";
import "./Property.css";
// ...existing code...

export default function Property() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPropertyTypes() {
      setLoading(true);
      setError(null);
      try {
        const listings = await getListings();
        // Group by type, get first image for each type
        const typeMap = {};
        listings.forEach((item) => {
          const type = item.type || "Property";
          if (!typeMap[type]) {
            typeMap[type] = {
              image: item.mainImage || item.images?.[0] || "",
              title: type.charAt(0).toUpperCase() + type.slice(1),
              description: type.endsWith("s") ? type : type + "s",
              path: "/stays",
            };
          }
        });
        setPropertyTypes(Object.values(typeMap));
      } catch {
        setError("Failed to load property types");
      } finally {
        setLoading(false);
      }
    }
    fetchPropertyTypes();
  }, []);

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
  }, [propertyTypes]);

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
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {!loading && !error && propertyTypes.length === 0 && (
            <div>No property types found.</div>
          )}
          {!loading &&
            !error &&
            propertyTypes.map((propertyType) => (
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
