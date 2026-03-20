import "./HotelsMain.css";
import HeroSearch from "./HeroSearch";
import LastMinuteHotels from "./LastMinuteHotels";
import PopularCities from "./PopularCities";
import PopularHotels from "./PopularHotels";
import AccommodationTypes from "./AccommodationTypes";
import FAQSection from "./FAQSection";

export default function HotelsMain() {
  return (
    <main className="hotels-main">
      <HeroSearch />
      <LastMinuteHotels />
      <PopularCities />
      <PopularHotels />
      <FAQSection />
      <AccommodationTypes />
    </main>
  );
}
