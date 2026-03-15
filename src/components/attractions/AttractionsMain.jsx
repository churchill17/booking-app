import "./AttractionsMain.css";
import HeroSearch from "./HeroSearch";
import TopDestinations from "./TopDestinations";
import AccountTravel from "./AccountTravel";
import WeveGotYouCovered from "./WeveGotYouCovered";
import ExploreDestinations from "./ExploreDestinations";

export default function AttractionsMain() {
  return (
    <div className="attractions-main">
      {/* Image 1 & 2: Hero Search + Top Destinations */}
      <HeroSearch />
      <TopDestinations />

      {/* Image 3: Account + We've Got You Covered */}
      <AccountTravel />
      <WeveGotYouCovered />

      {/* Image 4: Explore More Destinations */}
      <ExploreDestinations />
    </div>
  );
}
