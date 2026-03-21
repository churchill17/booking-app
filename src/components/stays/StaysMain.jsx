import "./StaysMain.css";
import HeroSearch from "./HeroSearch";
import LastMinuteHotels from "./LastMinuteHotels";
import PopularCities from "./PopularCities";
import PopularHotels from "./PopularHotels";
import AccommodationTypes from "./AccommodationTypes";
import FAQSection from "./FAQSection";
import { STAYS_CONTENT } from "./staysContent";

export default function StaysMain({ propertyType }) {
  const content = STAYS_CONTENT[propertyType] || STAYS_CONTENT["Hotels"];
  // Dynamic title for last minute section
  const lastMinuteTitle =
    content.lastMinuteTitle ||
    `Last minute ${propertyType.toLowerCase()} near you tonight`;
  return (
    <main className="stays-main">
      <HeroSearch hero={content.hero} propertyType={propertyType} />
      <LastMinuteHotels hotels={content.lastMinute} title={lastMinuteTitle} />
      <PopularCities propertyType={propertyType} />
      <PopularHotels propertyType={propertyType} />
      <FAQSection faqs={content.faqs} />
      <AccommodationTypes types={content.accommodationTypes} />
    </main>
  );
}
