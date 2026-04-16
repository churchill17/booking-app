import React, { useState } from "react";
import { C } from "../ui.constants.js";
import { Card, StepHeading, FormField, RadioGroup } from "../ui.jsx";

/* ─── Popular facility options by property type ─────────────────── */
const FACILITIES_BY_TYPE = {
  hotel: [
    "Free WiFi", "Swimming Pool", "Fitness Centre", "Spa & Wellness",
    "Restaurant", "Bar / Lounge", "Room Service", "24-hour Front Desk",
    "Airport Shuttle", "Business Centre", "Conference Facilities",
    "Concierge Service", "Laundry Service", "Dry Cleaning",
    "Valet Parking", "Car Park (free)", "Car Park (paid)",
    "Breakfast Included", "Air Conditioning", "Elevator / Lift",
    "Wheelchair Accessible", "Kids' Club", "Childcare Services",
    "Tennis Court", "Sauna", "Steam Room", "Outdoor Pool",
    "Indoor Pool", "Rooftop Bar", "Currency Exchange",
    "ATM on Site", "Luggage Storage", "Safe Deposit Box",
    "Garden", "Non-smoking Rooms", "Water Sports",
  ],
  resort: [
    "Free WiFi", "Private Beach", "Outdoor Pool", "Indoor Pool",
    "Infinity Pool", "Water Park", "Spa & Wellness", "Fitness Centre",
    "All-Inclusive Option", "Restaurant", "Multiple Restaurants",
    "Bar", "Swim-up Bar", "Beach Bar", "Water Sports",
    "Snorkelling", "Diving Centre", "Kids' Club", "Tennis Court",
    "Golf Course", "Watersports Centre", "Airport Shuttle",
    "Concierge Service", "Breakfast Included", "Air Conditioning",
    "Wheelchair Accessible", "Entertainment Programme",
    "Beach Volleyball", "Bicycle Hire", "Non-smoking Rooms",
  ],
  apartment: [
    "Free WiFi", "Fully Equipped Kitchen", "Washing Machine",
    "Dishwasher", "Air Conditioning", "Heating", "Parking (free)",
    "Parking (paid)", "Elevator / Lift", "Balcony / Terrace",
    "Garden", "BBQ Facilities", "Gym Access", "Swimming Pool",
    "Concierge Service", "24-hour Security", "CCTV Surveillance",
    "Pet-friendly", "Wheelchair Accessible", "Smart TV",
    "Netflix / Streaming", "Baby Equipment Available",
    "Cot Available", "High Chair Available", "Luggage Storage",
    "Non-smoking Property", "Bicycle Storage",
  ],
  "guest house": [
    "Free WiFi", "Breakfast Included", "Shared Lounge",
    "Garden / Terrace", "BBQ Facilities", "Shared Kitchen",
    "Air Conditioning", "Heating", "Parking (free)", "Parking (paid)",
    "Non-smoking", "Pet-friendly", "Luggage Storage",
    "24-hour Check-in", "Self Check-in (keypad)", "Bicycle Hire",
    "Laundry Facilities", "Iron Available", "Baby Equipment Available",
    "Accessible Rooms",
  ],
  home: [
    "Free WiFi", "Fully Equipped Kitchen", "Washing Machine",
    "Garden / Terrace", "BBQ Facilities", "Air Conditioning",
    "Heating", "Parking (free)", "Parking (paid)", "Pet-friendly",
    "Non-smoking", "Smart TV", "Netflix / Streaming",
    "Baby Equipment Available", "Cot Available", "High Chair Available",
    "Bicycle Hire", "Laundry Facilities", "Luggage Storage",
    "Self Check-in", "24-hour Check-in",
  ],
  villa: [
    "Free WiFi", "Private Pool", "Fully Equipped Kitchen",
    "Private Garden", "BBQ Facilities", "Air Conditioning",
    "Parking (free)", "Daily Housekeeping", "Concierge Service",
    "Airport Transfer", "Chef on Request", "Car Hire Available",
    "Boat Hire Available", "Gym / Fitness Equipment",
    "Sauna", "Tennis Court", "Home Cinema", "Pet-friendly",
    "Non-smoking Property", "24-hour Security",
    "Sea View", "Private Beach Access", "Baby Equipment Available",
  ],
  villas: [
    "Free WiFi", "Private Pool", "Fully Equipped Kitchen",
    "Private Garden", "BBQ Facilities", "Air Conditioning",
    "Parking (free)", "Daily Housekeeping", "Concierge Service",
    "Airport Transfer", "Chef on Request", "Car Hire Available",
    "Gym / Fitness Equipment", "Sauna", "Tennis Court",
    "Home Cinema", "Pet-friendly", "Non-smoking Property",
    "24-hour Security", "Sea View", "Private Beach Access",
  ],
  boat: [
    "Free WiFi", "Fully Equipped Galley", "Air Conditioning",
    "Captain / Crew Included", "Water Sports Equipment",
    "Snorkelling Gear", "Fishing Equipment", "Kayak / Paddleboard",
    "Fuel Included", "Linen & Towels Provided", "Life Jackets",
    "Safety Equipment", "Dinghy", "Harbour / Marina Access",
    "Bluetooth Speaker", "Onboard Generator",
  ],
  campsite: [
    "Free WiFi", "Shared Bathrooms", "Shared Kitchen Facilities",
    "BBQ Facilities", "Fire Pits", "Picnic Tables",
    "Electricity Hook-up", "Water Points", "Laundry Facilities",
    "Playground", "On-site Shop", "Restaurant / Café",
    "Swimming Pool", "Cycling Tracks", "Hiking Trails",
    "Pet-friendly", "Accessible Facilities",
  ],
  "luxury tent": [
    "Free WiFi", "Private Bathroom", "Electricity",
    "Air Conditioning / Fan", "BBQ Facilities", "Fire Pit",
    "Breakfast Included", "Daily Housekeeping",
    "Linen & Towels Provided", "Stargazing Deck",
    "Outdoor Shower", "Hammock", "Hiking Trails",
    "Wildlife Viewing", "Guided Safaris", "Pet-friendly",
  ],
  "holiday home": [
    "Free WiFi", "Fully Equipped Kitchen", "Washing Machine",
    "Garden / Terrace", "BBQ Facilities", "Air Conditioning",
    "Heating", "Parking (free)", "Smart TV", "Pet-friendly",
    "Non-smoking", "Cot Available", "High Chair Available",
    "Baby Equipment Available", "Self Check-in",
    "Bicycle Hire", "Luggage Storage",
  ],
};

const FALLBACK_FACILITIES = [
  "Free WiFi", "Air Conditioning", "Swimming Pool",
  "Restaurant", "Gym / Fitness Centre", "Spa",
  "Bar", "Parking (free)", "Parking (paid)",
  "Airport Shuttle", "Breakfast Included", "Room Service",
  "Laundry Service", "Concierge Service", "24-hour Front Desk",
  "Elevator / Lift", "Non-smoking Rooms", "Pet-friendly",
  "Wheelchair Accessible", "Garden / Terrace",
  "BBQ Facilities", "Business Centre", "Safe Deposit Box",
  "Luggage Storage", "Bicycle Hire", "Kids' Club",
  "Tennis Court", "Sauna", "Rooftop Access", "ATM on Site",
];

function getOptions(propertyType) {
  const key = (propertyType || "").toLowerCase();
  return FACILITIES_BY_TYPE[key] || FALLBACK_FACILITIES;
}

/* ─── Pill chip selector ─────────────────────────────────────────── */
function FacilityPills({ facilities, set, propertyType }) {
  const [custom, setCustom] = useState("");
  const options = getOptions(propertyType);

  const toggle = (item) => {
    if (facilities.includes(item)) {
      set("popularFacilities", facilities.filter((f) => f !== item));
    } else {
      set("popularFacilities", [...facilities, item]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !facilities.includes(trimmed)) {
      set("popularFacilities", [...facilities, trimmed]);
    }
    setCustom("");
  };

  const customItems = facilities.filter((f) => !options.includes(f));

  return (
    <FormField label="Popular facilities" required>
      <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 12px" }}>
        Select all that apply to your property. These appear prominently on your listing.
      </p>

      {/* Pre-defined chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {options.map((opt) => {
          const active = facilities.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "7px 15px",
                borderRadius: 20,
                border: `1.5px solid ${active ? C.teal : C.border}`,
                background: active ? "#e8f5f3" : C.white,
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

      {/* Other — custom entry */}
      <div
        style={{
          borderTop: `1px solid #f0ece6`,
          paddingTop: 14,
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.midnightBlue,
            marginBottom: 8,
          }}
        >
          Other — add your own
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="e.g. Rooftop cinema, Helipad, Valet laundry..."
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
                  background: "#e8f5f3",
                  border: `1.5px solid ${C.teal}`,
                  color: C.teal,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {item}
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "popularFacilities",
                      facilities.filter((f) => f !== item),
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: C.teal,
                    cursor: "pointer",
                    fontSize: 16,
                    lineHeight: 1,
                    padding: "0 2px",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Selected count badge */}
      {facilities.length > 0 && (
        <div
          style={{
            marginTop: 14,
            fontSize: 13,
            color: C.teal,
            fontWeight: 600,
          }}
        >
          {facilities.length} facilit{facilities.length === 1 ? "y" : "ies"} selected
        </div>
      )}
    </FormField>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function StepServicesAmenities({ data, set }) {
  const popularFacilities = Array.isArray(data.popularFacilities)
    ? data.popularFacilities
    : [];

  return (
    <div className="animate-in">
      <StepHeading
        title="Services & amenities"
        subtitle="Tell guests what your property offers. These details influence booking decisions."
      />

      <Card>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8,
            color: C.midnightBlue,
            fontSize: 16,
          }}
        >
          Breakfast
        </div>
        <div style={{ color: C.textMid, marginBottom: 12, fontSize: 14 }}>
          Do you serve guests breakfast?
        </div>
        <RadioGroup
          options={["Yes", "No"]}
          value={data.breakfast ? "Yes" : "No"}
          onChange={(v) => set("breakfast", v === "Yes")}
        />
      </Card>

      <Card>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8,
            color: C.midnightBlue,
            fontSize: 16,
          }}
        >
          Parking
        </div>
        <div style={{ color: C.textMid, marginBottom: 12, fontSize: 14 }}>
          Is parking available to guests?
        </div>
        <RadioGroup
          options={["Yes, free", "Yes, paid", "No"]}
          value={data.parking}
          onChange={(v) => set("parking", v)}
        />
      </Card>

      <Card>
        <FacilityPills
          facilities={popularFacilities}
          set={set}
          propertyType={data.propertyType}
        />
      </Card>
    </div>
  );
}
