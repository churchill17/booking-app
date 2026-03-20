import ExploreCard from "./ExploreCard.jsx";
import { EXPLORE_CARD } from "../../data.js";
import "./Unique.css";

export default function Unique() {
  return (
    <section className="unique-stays">
      <h2>Discover our finest unique stays</h2>
      <p>Explore everything from luxury villas to unique igloos and boats.</p>
      <div className="unique-card">
        {EXPLORE_CARD.map((exploreCard) => (
          <ExploreCard key={exploreCard.title} {...exploreCard} />
        ))}
      </div>
    </section>
  );
}
