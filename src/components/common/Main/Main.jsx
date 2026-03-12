import Hero from "./Hero/Hero.jsx";
import Hotel from "./Hotel/Hotel.jsx";
import Offer from "./Offer/Offer.jsx";
import Property from "./Property/Property.jsx";
import Trending from "./Trending/Trending.jsx";
import Weekend from "./Weekend/Weekend.jsx";
import Unique from "./Unique/Unique.jsx";
import Guest from "./Guest/Guest.jsx";
import Deals from "./Deals/Deals.jsx";
import Travel from "./Travel/Travel.jsx";
import "./Main.css";

export default function Main() {
  return (
    <>
      <main>
        <Hero />
        <Hotel />
        <Offer />
        <Property />
        <Trending />
        <Weekend />
        <Unique />
        <Guest />
        <Deals />
        <Travel />
      </main>
    </>
  );
}
