import Hero from "./Hero/Hero.jsx";
import Offer from "./Offer/Offer.jsx";
import Property from "./Property/Property.jsx";
import Trending from "./Trending/Trending.jsx";
import Hotel from "./Hotel/Hotel.jsx";
import Unique from "./Unique/Unique.jsx";
import Guest from "./Guest/Guest.jsx";
import Travel from "./Travel/Travel.jsx";
import "./Main.css";

export default function Main() {
  return (
    <>
      <main>
        <Hero />
        <Property />
        <Offer />
        <Trending />
        <Hotel />
        <Unique />
        <Guest />
        <Travel />
      </main>
    </>
  );
}
