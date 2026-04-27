import { useEffect, useState } from "react";
import Hero from "./Hero/Hero.jsx";
import Property from "./Property/Property.jsx";

import Hotel from "./Hotel/Hotel.jsx";
import Unique from "./Unique/Unique.jsx";
import Guest from "./Guest/Guest.jsx";
import { getPublicListings } from "../../host/services/hostApi";
import "./Main.css";

const MAX_CARDS = 12;

function matchType(item, ...types) {
  const t = (item.type || "").toLowerCase().trim();
  return types.some((target) => t === target || t === target + "s" || t + "s" === target);
}

export default function Main() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicListings()
      .then(setListings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hotelListings = listings
    .filter((item) => matchType(item, "hotel"))
    .slice(0, MAX_CARDS);

  const apartmentListings = listings
    .filter((item) => matchType(item, "apartment"))
    .slice(0, MAX_CARDS);

  const guesthouseListings = listings
    .filter((item) => matchType(item, "guesthouse", "guest house"))
    .slice(0, MAX_CARDS);

  return (
    <>
      <main>
        <Hero />
        <Property /> 
        <Hotel listings={hotelListings} loading={loading} />
        <Unique listings={apartmentListings} loading={loading} />
        <Guest listings={guesthouseListings} loading={loading} />
      </main>
    </>
  );
}
