import { useState } from "react";
import TabButton from "./TabButton.jsx";
import DifferentCities from "./DifferentCities.jsx";
import { DIFFERENT_CITIES } from "../../data.js";
import "./Trending.css";

export default function Trending() {
  const [selectedTopic, setSelectedTopic] = useState("popular");

  function handleSelect(selectedButton) {
    setSelectedTopic(selectedButton);
    console.log(selectedButton);
  }

  return (
    <section>
      <h2>Trending destinations</h2>
      <p>Top destinations to start planning your trip</p>
      <div className="trending-destinations">
        <menu>
          <TabButton
            isSelected={selectedTopic === "popular"}
            onSelect={() => handleSelect("popular")}
          >
            Popular
          </TabButton>
          <TabButton
            isSelected={selectedTopic === "historicalTours"}
            onSelect={() => handleSelect("historicalTours")}
          >
            Historical Tours
          </TabButton>
          <TabButton
            isSelected={selectedTopic === "culinaryExperience"}
            onSelect={() => handleSelect("culinaryExperience")}
          >
            Culinary Experience
          </TabButton>
          <TabButton
            isSelected={selectedTopic === "musicFestivals"}
            onSelect={() => handleSelect("musicFestivals")}
          >
            Music Festivals
          </TabButton>
          <TabButton
            isSelected={selectedTopic === "shopping"}
            onSelect={() => handleSelect("shopping")}
          >
            Shopping
          </TabButton>
          <TabButton
            isSelected={selectedTopic === "wellness"}
            onSelect={() => handleSelect("wellness")}
          >
            Wellness
          </TabButton>
        </menu>
      </div>
      <div className="scroll-wrapper">
        <button
          className="scroll-arrow left"
          onClick={() => {
            const el = document.querySelector(
              ".different-cities.horizontal-scroll",
            );
            if (el) el.scrollBy({ left: -300, behavior: "smooth" });
          }}
        >
          {"<"}
        </button>
        <div
          className="different-cities horizontal-scroll"
          style={{ display: "flex", gap: 16 }}
        >
          {DIFFERENT_CITIES[selectedTopic].map((city) => (
            <DifferentCities
              key={city.title}
              image={city.image}
              title={city.title}
            />
          ))}
        </div>
        <button
          className="scroll-arrow right"
          onClick={() => {
            const el = document.querySelector(
              ".different-cities.horizontal-scroll",
            );
            if (el) el.scrollBy({ left: 300, behavior: "smooth" });
          }}
        >
          {">"}
        </button>
      </div>
    </section>
  );
}
