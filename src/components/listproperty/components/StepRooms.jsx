import React, { useState } from "react";
import { C } from "../ui.constants.js";
import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  SelectInput,
  InfoBox,
  PrimaryBtn,
  SecondaryBtn,
} from "../ui.jsx";

/* ── Feature & amenity suggestion banks, grouped by property type ── */
const FEATURE_OPTIONS = {
  hotel: [
    "Ocean view", "City view", "Garden view", "Pool view", "Mountain view",
    "Sea view", "Private balcony", "Private terrace", "Corner room",
    "Executive floor", "Junior suite", "Club lounge access",
    "Non-smoking", "Soundproofed", "Accessible room", "Connecting rooms",
  ],
  resort: [
    "Beachfront", "Ocean view", "Lagoon view", "Garden view", "Pool view",
    "Private balcony", "Private plunge pool", "Overwater bungalow",
    "Jungle view", "Hillside", "Non-smoking", "Accessible room",
  ],
  apartment: [
    "City view", "Garden view", "Courtyard view", "Private entrance",
    "Private terrace", "Open plan", "Penthouse", "Rooftop access",
    "Ground floor", "Upper floor", "Non-smoking", "Soundproofed",
  ],
  home: [
    "Private entrance", "Private garden", "Private terrace", "Rooftop",
    "Garden view", "Street view", "Ground floor", "Open plan",
    "Loft style", "Non-smoking", "Accessible room",
  ],
  villa: [
    "Oceanfront", "Sea view", "Garden view", "Private pool", "Private garden",
    "Private terrace", "Hilltop", "Mountain view", "Non-smoking",
    "Accessible room", "Gated compound",
  ],
  boat: [
    "Sea view", "Porthole", "Open deck", "Bow cabin", "Master cabin",
    "Aft cabin", "Forward cabin", "Skylight",
  ],
  campsite: [
    "Waterfront", "Forest view", "Hilltop", "Meadow view", "Lakeside",
    "Stargazing deck", "Riverside", "Open field",
  ],
  default: [
    "Garden view", "City view", "Pool view", "Private balcony",
    "Private entrance", "Ground floor", "Non-smoking", "Soundproofed",
    "Accessible room", "Connecting rooms", "Corner room", "Upper floor",
  ],
};

const AMENITY_OPTIONS = {
  hotel: [
    "Free WiFi", "Air conditioning", "Flat-screen TV", "Minibar",
    "Tea & coffee maker", "In-room safe", "Bathrobe & slippers",
    "Hairdryer", "Toiletries", "Iron & ironing board", "Telephone",
    "Daily housekeeping", "Turndown service", "Desk & chair",
    "Wardrobe", "Blackout curtains", "Wake-up service",
    "In-room dining", "Heating", "Fan",
  ],
  resort: [
    "Free WiFi", "Air conditioning", "Flat-screen TV", "Minibar",
    "Private pool access", "Outdoor shower", "Bathrobe & slippers",
    "Hairdryer", "Toiletries", "In-room safe", "Tea & coffee maker",
    "Daily housekeeping", "Turndown service", "Sunbed on balcony",
    "Beach bag & towels", "Wardrobe", "Blackout curtains",
  ],
  apartment: [
    "Free WiFi", "Air conditioning", "Flat-screen TV", "Fully equipped kitchen",
    "Washing machine", "Tumble dryer", "Dishwasher", "Microwave",
    "Oven & hob", "Fridge & freezer", "Coffee machine", "Utensils & cookware",
    "In-room safe", "Wardrobe", "Blackout curtains", "Desk & chair",
    "Heating", "Iron & ironing board", "Baby cot available",
  ],
  home: [
    "Free WiFi", "Air conditioning", "Flat-screen TV", "Fully equipped kitchen",
    "Washing machine", "Tumble dryer", "Dishwasher", "Microwave",
    "Oven & hob", "Fridge & freezer", "BBQ facilities", "Coffee machine",
    "Utensils & cookware", "Wardrobe", "Iron & ironing board",
    "Heating", "Fan", "Baby cot available",
  ],
  villa: [
    "Free WiFi", "Air conditioning", "Flat-screen TV", "Private pool",
    "Fully equipped kitchen", "BBQ facilities", "Outdoor dining area",
    "Sun loungers", "Coffee machine", "Washing machine",
    "In-room safe", "Bathrobe & slippers", "Daily housekeeping",
    "Concierge service", "Wardrobe", "Blackout curtains",
  ],
  boat: [
    "Free WiFi", "Air conditioning", "Flat-screen TV", "En-suite bathroom",
    "Life jackets", "Kitchenette", "Bedding provided", "Towels",
    "Fishing gear", "Snorkelling equipment", "Safety equipment",
  ],
  campsite: [
    "Bedding provided", "Towels", "Electricity point", "Fan",
    "Lantern / lighting", "Portable heater", "Fire pit access",
    "Outdoor shower", "Shared bathroom", "Hammock", "Mosquito net",
    "Picnic table", "BBQ facilities",
  ],
  default: [
    "Free WiFi", "Air conditioning", "Flat-screen TV", "En-suite bathroom",
    "In-room safe", "Wardrobe", "Hairdryer", "Toiletries",
    "Tea & coffee maker", "Desk & chair", "Blackout curtains",
    "Iron & ironing board", "Daily housekeeping", "Heating", "Fan",
  ],
};

const BED_TYPES = [
  "1 single bed", "2 single beds", "1 double bed", "2 double beds",
  "1 queen bed", "1 king bed", "1 super king bed",
  "1 sofa bed", "Sofa beds", "1 bunk bed", "2 bunk beds",
  "1 futon", "1 day bed", "1 trundle bed", "1 pull-out bed",
  "1 four-poster bed", "1 canopy bed", "1 wall (Murphy) bed",
  "1 single bed and 1 sofa bed", "1 double bed and 1 single bed",
  "1 queen bed and 1 sofa bed", "1 king bed and 1 bunk bed",
  "1 crib", "1 cot", "1 rollaway bed", "Multiple beds",
];

const SIZE_UNITS = ["m²", "ft²"];

/* ── Shared input style ── */
const inputStyle = (focused) => ({
  width: "100%",
  padding: "11px 14px",
  border: `1.5px solid ${focused ? C.teal : C.border}`,
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  boxSizing: "border-box",
  outline: "none",
  color: C.midnightBlue,
  background: C.white,
  transition: "border-color 0.2s",
});

function StyledInput({ value, onChange, placeholder, type = "text", min }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={inputStyle(focused)}
    />
  );
}

function StyledSelect({ value, onChange, options, placeholder = "Select" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "11px 36px 11px 14px",
        border: `1.5px solid ${C.border}`,
        borderRadius: 8,
        fontSize: 15,
        fontFamily: "inherit",
        boxSizing: "border-box",
        outline: "none",
        color: value ? C.midnightBlue : C.textLight,
        background: C.white,
        appearance: "none",
        WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b3aca9' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

/* ── Pill chip selector ── */
function PillSelector({ label, selected = [], onChange, options, placeholder }) {
  const [custom, setCustom] = useState("");

  const toggle = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustom("");
  };

  return (
    <FormField label={label}>
      {/* Pre-defined option pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1.5px solid ${active ? C.teal : C.border}`,
                background: active ? "#e8f5f3" : C.white,
                color: active ? C.teal : C.textMid,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {active && <span style={{ marginRight: 4 }}>✓</span>}
              {opt}
            </button>
          );
        })}
      </div>
      {/* Custom entry */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder={placeholder || "Add a custom option..."}
          style={{
            flex: 1,
            padding: "9px 14px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "inherit",
            boxSizing: "border-box",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = C.teal)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
        <button
          type="button"
          onClick={addCustom}
          style={{
            padding: "9px 16px",
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
      {/* Selected custom items not in the preset list */}
      {selected.filter((s) => !options.includes(s)).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {selected
            .filter((s) => !options.includes(s))
            .map((item) => (
              <span
                key={item}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 12px",
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
                  onClick={() => onChange(selected.filter((s) => s !== item))}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.teal,
                    cursor: "pointer",
                    fontSize: 15,
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
    </FormField>
  );
}

/* ── Section divider ── */
function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: C.teal,
        margin: "20px 0 12px",
        paddingBottom: 6,
        borderBottom: `1.5px solid #d4ede9`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Empty state ── */
const EMPTY_ROOM = {
  name: "",
  availability: "",
  bed_type: "",
  size: "",
  sizeUnit: "m²",
  guests: "",
  features: [],
  amenities: [],
  originalPrice: "",
  currentPrice: "",
  discount: "",
  deal: "",
};

/* ── Main component ── */
export function StepRooms({ data, set }) {
  const rooms = Array.isArray(data.rooms) ? data.rooms : [];
  const [form, setForm] = useState(EMPTY_ROOM);
  const [showForm, setShowForm] = useState(rooms.length === 0);

  const propertyType = (data.propertyType || "").toLowerCase();
  const featureOptions =
    FEATURE_OPTIONS[propertyType] || FEATURE_OPTIONS.default;
  const amenityOptions =
    AMENITY_OPTIONS[propertyType] || AMENITY_OPTIONS.default;

  const setFormField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const canAdd =
    form.name.trim() &&
    form.bed_type &&
    form.size.trim() &&
    form.guests &&
    form.originalPrice;

  const handleAdd = () => {
    if (!canAdd) return;
    const newRoom = {
      ...form,
      size: `${form.size} ${form.sizeUnit}`.trim(),
      guests: Number(form.guests),
      originalPrice: Number(form.originalPrice),
      currentPrice: form.currentPrice ? Number(form.currentPrice) : undefined,
    };
    delete newRoom.sizeUnit;
    set("rooms", [...rooms, newRoom]);
    setForm(EMPTY_ROOM);
    setShowForm(false);
  };

  return (
    <div className="animate-in">
      <StepHeading
        title="Your rooms"
        subtitle="Add each room type guests can book. Include all variants — e.g. Standard, Deluxe, Suite."
      />

      {/* Added rooms list */}
      {rooms.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {rooms.map((room, idx) => (
            <div
              key={idx}
              style={{
                background: C.white,
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: "16px 18px",
                marginBottom: 10,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                boxShadow: "0 1px 4px rgba(24,36,53,0.05)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: C.midnightBlue,
                    marginBottom: 6,
                  }}
                >
                  {room.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px 16px",
                    fontSize: 13,
                    color: C.textLight,
                  }}
                >
                  {room.bed_type && <span>🛏 {room.bed_type}</span>}
                  {room.size && <span>📐 {room.size}</span>}
                  {room.guests && (
                    <span>
                      👤 {room.guests} guest{Number(room.guests) !== 1 ? "s" : ""}
                    </span>
                  )}
                  {room.originalPrice && (
                    <span>
                      💰 {Number(room.originalPrice).toLocaleString()}
                    </span>
                  )}
                  {room.availability && <span>🏨 {room.availability} available</span>}
                </div>
                {Array.isArray(room.features) && room.features.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    {room.features.slice(0, 4).map((f) => (
                      <span
                        key={f}
                        style={{
                          background: "#f7f5f2",
                          color: C.textMid,
                          borderRadius: 12,
                          padding: "2px 10px",
                          fontSize: 12,
                        }}
                      >
                        {f}
                      </span>
                    ))}
                    {room.features.length > 4 && (
                      <span
                        style={{
                          background: "#f7f5f2",
                          color: C.textLight,
                          borderRadius: 12,
                          padding: "2px 10px",
                          fontSize: 12,
                        }}
                      >
                        +{room.features.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => set("rooms", rooms.filter((_, i) => i !== idx))}
                style={{
                  flexShrink: 0,
                  background: "none",
                  border: `1px solid #f5c6c6`,
                  borderRadius: 6,
                  color: "#c0392b",
                  cursor: "pointer",
                  fontSize: 13,
                  padding: "4px 10px",
                  fontFamily: "inherit",
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: "100%",
                padding: "12px",
                border: `2px dashed ${C.border}`,
                borderRadius: 10,
                background: "transparent",
                color: C.teal,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                marginTop: 4,
              }}
            >
              + Add another room type
            </button>
          )}
        </div>
      )}

      {/* Room form */}
      {showForm && (
        <Card>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.midnightBlue,
              marginBottom: 2,
            }}
          >
            {rooms.length === 0 ? "Add your first room type" : "Add another room type"}
          </div>
          <div style={{ fontSize: 13, color: C.textLight, marginBottom: 4 }}>
            Fields marked <span style={{ color: C.error }}>*</span> are required.
          </div>

          {/* ── Identity ── */}
          <SectionLabel>Room identity</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FormField label="Room name" required>
              <StyledInput
                value={form.name}
                onChange={(v) => setFormField("name", v)}
                placeholder="e.g. Deluxe King Room"
              />
            </FormField>
            <FormField label="Units available">
              <StyledInput
                value={form.availability}
                onChange={(v) => setFormField("availability", v)}
                placeholder="e.g. 5"
                type="number"
                min="1"
              />
            </FormField>
          </div>

          {/* ── Bed & specs ── */}
          <SectionLabel>Bed & room specs</SectionLabel>
          <FormField label="Bed type" required>
            <StyledSelect
              value={form.bed_type}
              onChange={(v) => setFormField("bed_type", v)}
              options={BED_TYPES}
              placeholder="Select bed type"
            />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "end" }}>
            <FormField label="Room size" required>
              <StyledInput
                value={form.size}
                onChange={(v) => setFormField("size", v)}
                placeholder="e.g. 28"
                type="number"
                min="1"
              />
            </FormField>
            <FormField label="Unit">
              <StyledSelect
                value={form.sizeUnit}
                onChange={(v) => setFormField("sizeUnit", v)}
                options={SIZE_UNITS}
                placeholder=""
              />
            </FormField>
            <FormField label="Max guests" required>
              <StyledInput
                value={form.guests}
                onChange={(v) => setFormField("guests", v)}
                placeholder="e.g. 2"
                type="number"
                min="1"
              />
            </FormField>
          </div>

          {/* ── Features ── */}
          <SectionLabel>Room features</SectionLabel>
          <PillSelector
            label="What makes this room special? (views, floor, layout)"
            selected={form.features}
            onChange={(v) => setFormField("features", v)}
            options={featureOptions}
            placeholder="e.g. Rooftop access"
          />

          {/* ── Amenities ── */}
          <SectionLabel>In-room amenities</SectionLabel>
          <PillSelector
            label="What's included in the room?"
            selected={form.amenities}
            onChange={(v) => setFormField("amenities", v)}
            options={amenityOptions}
            placeholder="e.g. Nespresso machine"
          />

          {/* ── Pricing ── */}
          <SectionLabel>Pricing</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FormField label="Original price per night" required>
              <StyledInput
                value={form.originalPrice}
                onChange={(v) => setFormField("originalPrice", v)}
                placeholder="e.g. 45000"
                type="number"
                min="0"
              />
            </FormField>
            <FormField label="Discounted price per night">
              <StyledInput
                value={form.currentPrice}
                onChange={(v) => setFormField("currentPrice", v)}
                placeholder="e.g. 36000 (optional)"
                type="number"
                min="0"
              />
            </FormField>
            <FormField label="Discount label">
              <StyledInput
                value={form.discount}
                onChange={(v) => setFormField("discount", v)}
                placeholder="e.g. 20% off"
              />
            </FormField>
            <FormField label="Deal label">
              <StyledInput
                value={form.deal}
                onChange={(v) => setFormField("deal", v)}
                placeholder="e.g. Early 2026 Deal"
              />
            </FormField>
          </div>

          {/* ── Actions ── */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 24,
              paddingTop: 16,
              borderTop: `1px solid #f0ece6`,
            }}
          >
            <PrimaryBtn onClick={handleAdd} disabled={!canAdd}>
              Save room
            </PrimaryBtn>
            {rooms.length > 0 && (
              <SecondaryBtn onClick={() => { setForm(EMPTY_ROOM); setShowForm(false); }}>
                Cancel
              </SecondaryBtn>
            )}
          </div>
          {!canAdd && (
            <p style={{ fontSize: 12, color: C.textLight, marginTop: 8 }}>
              Fill in name, bed type, size, max guests and original price to save.
            </p>
          )}
        </Card>
      )}

      <InfoBox>
        💡 Add each room <em>type</em> once — not each individual unit. If you have 4 Deluxe Doubles, set Units Available to 4.
      </InfoBox>
    </div>
  );
}
