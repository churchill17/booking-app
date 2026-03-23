import "./StaysMain.css";
import HeroSearch from "./HeroSearch";
import LastMinuteStays from "./LastMinuteStays";
import PopularCities from "./PopularCities";
import PopularStays from "./PopularStays";
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
      <LastMinuteStays stays={content.lastMinute} title={lastMinuteTitle} />
      <PopularCities propertyType={propertyType} />
      <PopularStays propertyType={propertyType} />
      <FAQSection faqs={content.faqs} />
      <AccommodationTypes types={content.accommodationTypes} />
    </main>
  );
}
