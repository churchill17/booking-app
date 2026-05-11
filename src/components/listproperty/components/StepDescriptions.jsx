import React, { useState } from "react";
import { C } from "../ui.constants.js";
import { Card, StepHeading, FormField, InfoBox } from "../ui.jsx";

/* ─── Pill options per field & property type ─────────────────────── */

const ACCOMMODATIONS = {
  hotel: [
    "Spacious rooms & suites", "Contemporary décor", "Classic luxury interiors",
    "Panoramic city views", "Sea-view rooms", "Private balconies",
    "High-thread-count linen", "Soundproofed rooms", "Interconnected family rooms",
    "Accessible rooms available", "Presidential & penthouse suites",
    "Daily turndown service", "In-room safe & minibar", "Flat-screen TV in all rooms",
    "Pillow menu available", "Eco-certified rooms", "Smart room controls",
    "Walk-in rain showers", "Jacuzzi suites",
  ],
  resort: [
    "Beachfront bungalows", "Overwater villas", "Private plunge pools",
    "Garden view villas", "Honeymoon suites with jacuzzi", "Family suites & kids bunks",
    "Thatched-roof cottages", "Open-air bathrooms", "Personal butler service",
    "Cliffside suites with ocean views", "Private beach access from room",
    "Outdoor shower on terrace",
  ],
  apartment: [
    "Open-plan living spaces", "Fully equipped kitchen", "Studio to multi-bedroom options",
    "Newly renovated interiors", "Modern minimalist design", "Homely & welcoming atmosphere",
    "Separate dining area", "Work-from-home friendly", "Bright & airy rooms",
    "Private balcony or terrace", "High ceilings & large windows",
  ],
  home: [
    "Multiple en-suite bedrooms", "Spacious living & dining areas",
    "Character features & period charm", "Contemporary family home",
    "Private garden & outdoor space", "Fully furnished throughout",
    "Cosy & welcoming feel", "Open-plan kitchen-diner",
    "Loft-style layout", "Bright natural light throughout",
  ],
  "holiday home": [
    "Multiple en-suite bedrooms", "Spacious living & dining areas",
    "Fully furnished throughout", "Private garden & outdoor space",
    "Cosy family atmosphere", "Open-plan kitchen-diner",
    "Work-from-home friendly", "Bright natural light throughout",
  ],
  villa: [
    "Grand open-plan living areas", "Multiple bedroom suites",
    "Private infinity pool", "Indoor-outdoor living flow",
    "State-of-the-art kitchen", "Home theatre", "Al fresco dining area",
    "Staff quarters available", "Fully air-conditioned throughout",
    "Designer furnishings", "Floor-to-ceiling windows",
  ],
  villas: [
    "Grand open-plan living areas", "Multiple bedroom suites",
    "Private infinity pool", "Indoor-outdoor living flow",
    "State-of-the-art kitchen", "Home theatre", "Al fresco dining area",
    "Fully air-conditioned throughout", "Designer furnishings",
  ],
  boat: [
    "Private en-suite cabins", "Master stateroom", "Open-plan saloon",
    "Fully equipped galley", "Aft deck with seating", "Bow sun loungers",
    "Air-conditioned throughout", "Teak decking",
  ],
  campsite: [
    "Fully furnished glamping tents", "Raised wooden decking",
    "King-size beds in the wild", "Outdoor bathtub", "Private fire pit",
    "Canvas walls with zip closures", "Handcrafted wooden furniture",
  ],
  "luxury tent": [
    "Fully furnished luxury tents", "King-size bed", "Private deck",
    "Outdoor bathtub under the stars", "Fire pit", "Stargazing platform",
    "Handcrafted & artisanal interiors", "Electricity & charging points",
  ],
  "guest house": [
    "Cosy en-suite rooms", "Homely & welcoming atmosphere",
    "Shared lounge & communal areas", "Bright & airy bedrooms",
    "Comfortable beds with quality linen", "Quiet rooms away from traffic",
  ],
  default: [
    "Spacious & well-appointed rooms", "Contemporary décor", "Private balconies",
    "En-suite bathrooms", "Fully furnished throughout", "Air-conditioned rooms",
    "Flat-screen TV in all rooms", "Comfortable beds with quality linen",
    "Homely & welcoming atmosphere", "Bright natural light",
    "Accessible rooms available", "Family rooms available",
  ],
};

const DINING = {
  hotel: [
    "On-site restaurant (breakfast, lunch & dinner)", "24-hour room service",
    "À la carte fine dining", "Buffet breakfast included",
    "Rooftop restaurant with views", "Poolside bar & grill",
    "Lobby café & patisserie", "In-room minibar", "Private dining on request",
    "Vegetarian & vegan options", "Halal-certified kitchen",
    "International & local cuisine", "Afternoon tea service",
    "Live cooking stations", "Cocktail bar & lounge",
    "Specialty coffee & artisan drinks",
  ],
  resort: [
    "All-inclusive dining option", "Multiple themed restaurants",
    "Beachfront seafood restaurant", "Swim-up bar",
    "Beach BBQ evenings", "Cocktail & mocktail bar",
    "Fresh fruit & juices daily", "Farm-to-table restaurant",
    "Private dining on the beach", "International buffet", "Kids menu available",
  ],
  apartment: [
    "Fully equipped self-catering kitchen", "Nearby restaurants within walking distance",
    "Local supermarket close by", "Coffee machine & kitchen essentials provided",
    "Outdoor BBQ area", "Dining area for entertaining",
    "Grocery delivery available nearby",
  ],
  home: [
    "Fully equipped kitchen for self-catering", "Outdoor BBQ area",
    "Dining area for 6–10 guests", "Nearby restaurants within walking distance",
    "Local market & supermarket close by", "Coffee machine & pantry essentials",
    "Breakfast ingredients provided on arrival",
  ],
  "holiday home": [
    "Fully equipped kitchen for self-catering", "Outdoor BBQ area",
    "Nearby restaurants within walking distance", "Local supermarket close by",
    "Coffee machine & kitchen essentials", "Al fresco dining area",
  ],
  villa: [
    "Private chef on request", "Outdoor dining terrace", "Al fresco breakfast area",
    "Fully stocked wine cellar", "BBQ & entertainment area",
    "Catering service available", "Private poolside dining",
    "Breakfast included", "In-villa cocktail service",
  ],
  villas: [
    "Private chef on request", "Outdoor dining terrace", "Al fresco breakfast area",
    "BBQ & entertainment area", "Catering service available",
    "Private poolside dining", "In-villa cocktail service",
  ],
  boat: [
    "Fully equipped galley for self-catering", "Onboard chef available on request",
    "Waterfront dining at the marina", "Fresh catch cooked on board",
    "Breakfast included", "Sundowner cocktails on deck",
  ],
  campsite: [
    "On-site café & restaurant", "Camp kitchen & BBQ facilities",
    "Fire pit cooking", "Morning coffee & tea station",
    "Nearby local restaurants", "Communal dining area",
  ],
  "luxury tent": [
    "Breakfast delivered to your tent", "Campfire dining",
    "On-site chef available", "Sundowner drinks on the deck",
    "Communal dining area", "Nearby local restaurants",
  ],
  "guest house": [
    "Home-cooked breakfast included", "Shared dining area",
    "Tea & coffee making facilities", "Nearby restaurants within walking distance",
    "Communal kitchen for guest use", "Special dietary needs catered for on request",
  ],
  default: [
    "On-site restaurant", "Breakfast included", "Self-catering kitchen",
    "Room service available", "Bar & lounge", "Nearby restaurants",
    "Outdoor dining area", "Vegetarian & vegan options",
    "Halal options available", "International cuisine",
  ],
};

const LOCATION = [
  "City centre location", "Beachfront / seafront",
  "Lakeside / riverside", "Hilltop with panoramic views",
  "Countryside / rural setting", "Mountain retreat",
  "Forest & nature setting", "Island location",
  "Quiet residential area", "Vibrant entertainment district",
  "Business & financial district", "Historic city centre",
  "Walking distance to the beach", "5 minutes from the airport",
  "10 minutes from the city centre", "15 minutes from the city centre",
  "Close to shopping malls & dining", "Near major tourist attractions",
  "Close to public transport links", "Steps from the waterfront",
  "Private & secluded setting", "Gated community",
  "Overlooks the ocean", "Near national park / nature reserve",
  "Close to the golf course", "Minutes from the marina",
  "Walkable neighbourhood", "Near cultural & historical sites",
  "Family-friendly neighbourhood", "Safe & well-lit neighbourhood",
  "Near hospitals & medical centres", "Close to schools & universities",
];

function getOpts(map, propertyType) {
  const key = (propertyType || "").toLowerCase();
  return map[key] || map.default || [];
}

/* ─── Reusable pill section ──────────────────────────────────────── */
function DescriptionPills({ fieldKey, label, options, selected, set, placeholder }) {
  const [custom, setCustom] = useState("");

  const toggle = (item) => {
    const next = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item];
    set(fieldKey, next);
  };

  const addCustom = () => {
    const t = custom.trim();
    if (t && !selected.includes(t)) set(fieldKey, [...selected, t]);
    setCustom("");
  };

  const customItems = selected.filter((s) => !options.includes(s));
  const hasError = selected.length === 0;

  return (
    <FormField
      label={label}
      required
      error={hasError ? "Select at least one option." : undefined}
    >
      <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 12px" }}>
        Tap to select all that apply. You can add your own below.
      </p>

      {/* Pre-defined chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: `1.5px solid ${active ? C.teal : C.border}`,
                background: active ? "var(--oceanBlueLight)" : C.white,
                color: active ? C.teal : C.textMid,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                lineHeight: 1.4,
              }}
            >
              {active && "✓ "}{opt}
            </button>
          );
        })}
      </div>

      {/* Other — custom */}
      <div style={{ borderTop: `1px solid #f0ece6`, paddingTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.midnightBlue, marginBottom: 8 }}>
          Other — add your own
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder={placeholder}
            style={{
              flex: 1,
              padding: "10px 14px",
              border: `1.5px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 14,
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
              color: C.midnightBlue,
            }}
            onFocus={(e) => (e.target.style.borderColor = C.teal)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
          <button
            type="button"
            onClick={addCustom}
            style={{
              padding: "10px 18px",
              background: C.teal,
              color: C.white,
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            + Add
          </button>
        </div>

        {customItems.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {customItems.map((item) => (
              <span
                key={item}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  borderRadius: 20,
                  background: "var(--oceanBlueLight)",
                  border: `1.5px solid ${C.teal}`,
                  color: C.teal,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {item}
                <button
                  type="button"
                  onClick={() => set(fieldKey, selected.filter((s) => s !== item))}
                  style={{
                    background: "none", border: "none", color: C.teal,
                    cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 13, color: C.teal, fontWeight: 600 }}>
          {selected.length} item{selected.length !== 1 ? "s" : ""} selected
        </div>
      )}
    </FormField>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
/** Recursively unwrap multi-serialised JSON until we have a plain string[]. */
function toArr(v, depth = 0) {
  if (!v || depth > 8) return [];

  // Array — inspect every element
  if (Array.isArray(v)) {
    const items = [];
    for (const item of v) {
      if (typeof item !== "string") continue;
      const t = item.trim();
      // Looks like a nested JSON array or quoted string — try to parse
      if (t.startsWith("[") || t.startsWith('"')) {
        try {
          const parsed = JSON.parse(t);
          items.push(...toArr(parsed, depth + 1));
          continue;
        } catch {/* not valid JSON, treat as plain string */}
      }
      if (t) items.push(item);
    }
    // Deduplicate while preserving order
    return [...new Set(items)];
  }

  // Plain string — may itself be a serialised array
  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("[") || t.startsWith('"')) {
      try {
        return toArr(JSON.parse(t), depth + 1);
      } catch {/* fall through */}
    }
    return t ? [t] : [];
  }

  return [];
}

export function StepDescriptions({ data, set }) {
  const pt = data.propertyType || "";

  const accommodations = toArr(data.accommodations);
  const descriptionDining = toArr(data.descriptionDining);
  const location = toArr(data.location);

  return (
    <div className="animate-in">
      <StepHeading
        title="Tell your property's story"
        subtitle="Guests read these before booking. Pick what describes your property best."
      />

      <Card>
        <DescriptionPills
          fieldKey="accommodations"
          label="Accommodations"
          options={getOpts(ACCOMMODATIONS, pt)}
          selected={accommodations}
          set={set}
          placeholder="e.g. Bespoke handcrafted furniture"
        />
      </Card>

      <Card>
        <DescriptionPills
          fieldKey="descriptionDining"
          label="Dining"
          options={getOpts(DINING, pt)}
          selected={descriptionDining}
          set={set}
          placeholder="e.g. Farm-sourced breakfast hamper on arrival"
        />
      </Card>

      <Card>
        <DescriptionPills
          fieldKey="location"
          label="Location"
          options={LOCATION}
          selected={location}
          set={set}
          placeholder="e.g. 2 minutes walk from VI beach"
        />
      </Card>

      <InfoBox>
        💡 These chips become your listing description. The more you select, the richer your listing looks to guests.
      </InfoBox>
    </div>
  );
}
