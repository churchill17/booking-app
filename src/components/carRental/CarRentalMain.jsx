import HeroSearch from "./HeroSearch";
import TrustAndFAQ from "./TrustAndFAQ";
import PopularDestinations from "./PopularDestinations";
import "./CarRentalMain.css";

export default function CarRentalMain() {
  return (
    <main className="car-rental-main">
      {/* Section 1 — Hero banner + search bar + savings card */}
      <HeroSearch />

      {/* Section 2 — Trust features + FAQ accordion */}
      <TrustAndFAQ />

      {/* Section 3 — Popular car hire destinations */}
      <PopularDestinations />
    </main>
  );
}
