// (Removed duplicate/stray code)
import React, { useState } from "react";
import Select from "react-select";
import {
  FaParking,
  FaWifi,
  FaUtensils,
  FaBed,
  FaMapMarkerAlt,
  FaSwimmingPool,
  FaDumbbell,
  FaSpa,
  FaShuttleVan,
  FaConciergeBell,
  FaCoffee,
  FaCocktail,
  FaSnowflake,
  FaTv,
  FaBath,
  FaChild,
  FaDog,
} from "react-icons/fa";
import { MdLocationOn, MdOutlinePool } from "react-icons/md";
import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  TextArea,
  PrimaryBtn,
  Toggle,
} from "../ui.jsx";

function ArrayInput({
  label,
  items = [],
  onChange,
  placeholder,
  itemPlaceholder,
}) {
  const [input, setInput] = useState("");
  // Helper to split input by comma or newline, trim, and filter out empty
  const splitInput = (text) =>
    text
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

  const isPopularFacilities = label === "Popular Facilities";
  return (
    <FormField label={label}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {isPopularFacilities ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              itemPlaceholder ||
              placeholder ||
              "Enter amenities (comma or newline separated)"
            }
            rows={1}
            style={{
              width: "100%",
              minHeight: 36,
              maxHeight: 36,
              resize: "none",
              padding: "8px 12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "#fff",
              marginBottom: 8,
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2684FF")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              itemPlaceholder ||
              placeholder ||
              "Enter amenities (comma or newline separated)"
            }
            rows={4}
            style={{
              width: "100%",
              minHeight: 64,
              resize: "vertical",
              padding: "10px 12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 6,
              background: "#fafbfc",
              marginBottom: 12,
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2684FF")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        )}
        {isPopularFacilities && (
          <PrimaryBtn
            style={{
              width: "100%",
              marginTop: 4,
              boxSizing: "border-box",
              padding: "10px 0",
              fontSize: 16,
            }}
            onClick={() => {
              if (input.trim()) {
                const newItems = splitInput(input);
                onChange([...items, ...newItems]);
                setInput("");
              }
            }}
          >
            Add
          </PrimaryBtn>
        )}
        {!isPopularFacilities && (
          <PrimaryBtn
            onClick={() => {
              if (input.trim()) {
                const newItems = splitInput(input);
                onChange([...items, ...newItems]);
                setInput("");
              }
            }}
          >
            Add
          </PrimaryBtn>
        )}
      </div>
      {/* Hide inline preview for Popular Facilities, only show formatted preview */}
      {label !== "Popular Facilities" && (
        <ul style={{ paddingLeft: 18 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              {item}
              <button
                style={{
                  marginLeft: 8,
                  color: "red",
                  border: "none",
                  background: "none",
                }}
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </FormField>
  );
}

function IconDropdown({ value, onChange }) {
  const icons = [
    { name: "FaParking", icon: <FaParking /> },
    { name: "FaWifi", icon: <FaWifi /> },
    { name: "FaUtensils", icon: <FaUtensils /> },
    { name: "FaBed", icon: <FaBed /> },
    { name: "FaMapMarkerAlt", icon: <FaMapMarkerAlt /> },
    { name: "FaSwimmingPool", icon: <FaSwimmingPool /> },
    { name: "FaDumbbell", icon: <FaDumbbell /> },
    { name: "FaSpa", icon: <FaSpa /> },
    { name: "FaShuttleVan", icon: <FaShuttleVan /> },
    { name: "FaConciergeBell", icon: <FaConciergeBell /> },
    { name: "FaCoffee", icon: <FaCoffee /> },
    { name: "FaCocktail", icon: <FaCocktail /> },
    { name: "FaSnowflake", icon: <FaSnowflake /> }, // AC
    { name: "FaTv", icon: <FaTv /> },
    { name: "FaBath", icon: <FaBath /> },
    { name: "FaChild", icon: <FaChild /> }, // family-friendly
    { name: "FaDog", icon: <FaDog /> }, // pets allowed
  ];
  const options = icons.map((opt) => ({
    value: opt.name,
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {opt.icon}
      </span>
    ),
    icon: opt.icon,
  }));
  const selected = options.find((o) => o.value === value) || null;
  return (
    <Select
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : "")}
      options={options}
      isClearable
      placeholder="Select icon"
      formatOptionLabel={(option) => option.label}
      styles={{
        option: (provided) => ({
          ...provided,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }),
        singleValue: (provided) => ({
          ...provided,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }),
      }}
    />
  );
}

function BedDropdown({ value, onChange, label }) {
  // Generate options 0-5 and some presets
  const options = [
    { value: "", label: `Select ${label}` },
    ...Array.from({ length: 6 }, (_, i) => ({ value: i, label: `${i}` })),
  ];
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function BedTypeDropdown({ value, onChange }) {
  const bedTypes = [
    { value: "", label: "Select bed type" },
    { value: "Sofa beds", label: "Sofa beds" },
    { value: "1 single bed", label: "1 single bed" },
    { value: "2 single beds", label: "2 single beds" },
    { value: "1 double bed", label: "1 double bed" },
    { value: "2 double beds", label: "2 double beds" },
    { value: "1 queen bed", label: "1 queen bed" },
    { value: "1 king bed", label: "1 king bed" },
    { value: "1 super king bed", label: "1 super king bed" },
    { value: "1 sofa bed", label: "1 sofa bed" },
    { value: "1 futon", label: "1 futon" },
    { value: "1 day bed", label: "1 day bed" },
    { value: "1 trundle bed", label: "1 trundle bed" },
    { value: "1 pull-out bed", label: "1 pull-out bed" },
    { value: "1 bunk bed", label: "1 bunk bed" },
    { value: "2 bunk beds", label: "2 bunk beds" },
    { value: "1 crib", label: "1 crib" },
    { value: "1 cot", label: "1 cot" },
    { value: "1 toddler bed", label: "1 toddler bed" },
    { value: "1 rollaway bed", label: "1 rollaway bed" },
    { value: "1 extra bed", label: "1 extra bed" },
    { value: "1 four-poster bed", label: "1 four-poster bed" },
    { value: "1 canopy bed", label: "1 canopy bed" },
    { value: "1 water bed", label: "1 water bed" },
    { value: "1 adjustable bed", label: "1 adjustable bed" },
    { value: "1 wall (Murphy) bed", label: "1 wall (Murphy) bed" },
    {
      value: "1 single bed and 1 sofa bed",
      label: "1 single bed and 1 sofa bed",
    },
    {
      value: "1 double bed and 1 single bed",
      label: "1 double bed and 1 single bed",
    },
    {
      value: "1 queen bed and 1 sofa bed",
      label: "1 queen bed and 1 sofa bed",
    },
    { value: "1 king bed and 1 bunk bed", label: "1 king bed and 1 bunk bed" },
    { value: "Multiple beds", label: "Multiple beds" },
  ];
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {bedTypes.map((b) => (
        <option key={b.value} value={b.value}>
          {b.label}
        </option>
      ))}
    </select>
  );
}

export function ObjectArrayInput({
  label,
  items = [],
  onChange,
  fields,
  placeholder,
}) {
  // If there are previous items, use the last one as the initial value for new input fields
  const getInitialInputs = () => {
    if (label === "Rooms" && items.length > 0) {
      const last = items[items.length - 1];
      return fields.reduce((acc, f) => ({ ...acc, [f]: last[f] || "" }), {});
    }
    return fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {});
  };
  const [inputs, setInputs] = useState(getInitialInputs());
  // Room template for new entries (only applies to Rooms input)
  const isRooms = label === "Rooms";
  const roomTemplate = (property = {}, amenities = []) => ({
    id: property.id || "",
    name: property.space_type || property.name || "Room",
    availability: property.availability || "",
    bed_type: property.bed_type || "",
    size: property.size || "27 m²",
    features: property.features || [],
    amenities: property.amenities || (amenities.length > 0 ? amenities : []),
    choices: property.choices || [
      "Continental breakfast included",
      "Total cost to cancel",
      "No prepayment needed – pay at the property",
    ],
    originalPrice: property.originalPrice,
    currentPrice: property.currentPrice,
    discount: property.discount,
    deal: property.deal,
    guests: property.guests || 1,
  });

  // Custom placeholders for room fields
  const roomPlaceholders = {
    name: "Enter name",
    availability: "Enter availability",
    bed: "Enter bed(s)",
    size: "Enter size e.g 27 m²",
    features: "Enter features e.g Private suite, Garden view",
    amenities: "Enter amenities e.g Free toiletries, Bathrobe",
    choices:
      "Enter choices e.g Continental breakfast included, No prepayment needed",
    originalPrice: "Enter original price e.g 166,001",
    currentPrice: "Enter current price e.g 132,800(Optional)",
    discount: "Enter discount e.g 20% off(Optional)",
    deal: "Enter deal e.g Early 2026 Deal(Optional)",
    guests: "Enter guests",
  };

  return (
    <FormField label={label}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {fields.map((f) => {
          if (f === "icon") {
            return (
              <IconDropdown
                key={f}
                value={inputs[f]}
                onChange={(v) => setInputs({ ...inputs, [f]: v })}
              />
            );
          }
          if (f === "bed_type") {
            return (
              <BedTypeDropdown
                key={f}
                value={inputs[f]}
                onChange={(v) => setInputs({ ...inputs, [f]: v })}
              />
            );
          }
          // Render features, amenities, choices as textarea for bulk entry
          if (["features", "amenities", "choices"].includes(f)) {
            return (
              <textarea
                key={f}
                value={inputs[f]}
                onChange={(e) => setInputs({ ...inputs, [f]: e.target.value })}
                placeholder={
                  label === "Rooms"
                    ? roomPlaceholders[f] || f
                    : placeholder || f
                }
                rows={4}
                style={{
                  width: "100%",
                  minHeight: 64,
                  resize: "vertical",
                  padding: "10px 12px",
                  fontSize: 16,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  background: "#fff", // Match input background
                  marginBottom: 12,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2684FF")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />
            );
          }
          if (f === "currentPrice" || f === "discount" || f === "deal") {
            // Make these fields optional for Rooms
            return (
              <TextInput
                key={f}
                value={inputs[f]}
                onChange={(v) => setInputs({ ...inputs, [f]: v })}
                placeholder={
                  label === "Rooms"
                    ? roomPlaceholders[f] || f
                    : placeholder || f
                }
                required={false}
              />
            );
          }
          if (f === "currentPrice") {
            // (Handled above, so skip this block)
            return null;
          }
          return (
            <div
              key={f}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              <TextInput
                value={inputs[f]}
                onChange={(v) => setInputs({ ...inputs, [f]: v })}
                placeholder={
                  label === "Rooms"
                    ? roomPlaceholders[f] || f
                    : placeholder || f
                }
              />
              {/* Exclude infants checkbox removed as per new requirements */}
            </div>
          );
        })}
        <PrimaryBtn
          onClick={() => {
            // Only require non-empty for fields that are not currentPrice, discount, deal in Rooms
            const requiredFields =
              label === "Rooms"
                ? fields.filter(
                    (f) => !["currentPrice", "discount", "deal"].includes(f),
                  )
                : fields;
            if (
              requiredFields.every((f) => (inputs[f] || "").toString().trim())
            ) {
              // For textarea fields, split by comma/newline into arrays
              const processedInputs = { ...inputs };
              ["features", "amenities", "choices"].forEach((f) => {
                if (typeof processedInputs[f] === "string") {
                  processedInputs[f] = processedInputs[f]
                    .split(/,|\n/)
                    .map((s) => s.trim())
                    .filter(Boolean);
                }
              });
              if (isRooms) {
                onChange([...items, roomTemplate(processedInputs)]);
              } else {
                onChange([...items, processedInputs]);
              }
            }
          }}
        >
          Add
        </PrimaryBtn>
      </div>
      {/* Hide inline preview for Rooms, Highlights, Popular Facilities, and FAQs, keep for other uses */}
      {label !== "Rooms" &&
        label !== "Highlights" &&
        label !== "Popular Facilities" &&
        label !== "FAQs" && (
          <ul style={{ paddingLeft: 18 }}>
            {items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {fields.map((f) => (
                  <span key={f} style={{ marginRight: 8 }}>
                    <strong>{f}:</strong> {item[f]}
                  </span>
                ))}
                <button
                  style={{
                    marginLeft: 8,
                    color: "red",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => onChange(items.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
    </FormField>
  );
}

export function StepExtraDetails({ data, set }) {
  // Parse or default for each field
  const highlights = Array.isArray(data.highlights) ? data.highlights : [];
  const popularFacilities = Array.isArray(data.popularFacilities)
    ? data.popularFacilities
    : [];
  const rooms = Array.isArray(data.rooms) ? data.rooms : [];

  return (
    <div className="animate-in">
      <StepHeading
        title="Extra Property Details"
        subtitle="Add more details to help guests choose your property."
      />
      <Card>
        <FormField
          label="Accommodations Description"
          required
          error={
            !data.accommodations?.trim() ? "This field is required." : undefined
          }
        >
          <TextArea
            value={data.accommodations || ""}
            onChange={(v) => set("accommodations", v)}
            placeholder="Describe the accommodations."
          />
        </FormField>
        <FormField
          label="Facilities Description"
          required
          error={
            !data.descriptionFacilities?.trim()
              ? "This field is required."
              : undefined
          }
        >
          <TextArea
            value={data.descriptionFacilities || ""}
            onChange={(v) => set("descriptionFacilities", v)}
            placeholder="Describe the facilities available."
          />
        </FormField>
        <FormField
          label="Dining Description"
          required
          error={
            !data.descriptionDining?.trim()
              ? "This field is required."
              : undefined
          }
        >
          <TextArea
            value={data.descriptionDining || ""}
            onChange={(v) => set("descriptionDining", v)}
            placeholder="Describe the dining options."
          />
        </FormField>
        <FormField
          label="Location Description"
          required
          error={
            !data.location?.trim()
              ? "This field is required."
              : undefined
          }
        >
          <TextArea
            value={data.location || ""}
            onChange={(v) => set("location", v)}
            placeholder="Describe the location and nearby attractions."
          />
        </FormField>
        {/* Structured fields with specialized UI */}
        <ObjectArrayInput
          label="Highlights"
          items={highlights}
          onChange={(arr) => set("highlights", arr)}
          fields={["icon", "text"]}
        />
        {/* Preview Highlights with icons and Remove button on the right */}
        {highlights.length > 0 && (
          <div
            style={{
              margin: "1rem 0",
              padding: "1rem",
              background: "#f8f8f8",
              borderRadius: 8,
            }}
          >
            <strong>Preview:</strong>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {highlights.map((item, idx) => {
                const iconMap = {
                  FaParking: <FaParking style={{ marginRight: 6 }} />,
                  FaWifi: <FaWifi style={{ marginRight: 6 }} />,
                  FaUtensils: <FaUtensils style={{ marginRight: 6 }} />,
                  FaBed: <FaBed style={{ marginRight: 6 }} />,
                  FaMapMarkerAlt: <FaMapMarkerAlt style={{ marginRight: 6 }} />,
                  MdLocationOn: <MdLocationOn style={{ marginRight: 6 }} />,
                  MdOutlinePool: <MdOutlinePool style={{ marginRight: 6 }} />,
                };
                return (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 6,
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {iconMap[item.icon] || null}
                      <span>{item.text}</span>
                    </span>
                    <button
                      style={{
                        marginLeft: 12,
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                      onClick={() =>
                        set(
                          "highlights",
                          highlights.filter((_, i) => i !== idx),
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <ArrayInput
          label="Popular Facilities"
          items={popularFacilities}
          onChange={(arr) => set("popularFacilities", arr)}
          itemPlaceholder="e.g. Free WiFi"
        />
        {/* Formatted preview for Popular Facilities */}
        {popularFacilities.length > 0 && (
          <div
            style={{
              margin: "1rem 0",
              padding: "1rem",
              background: "#f8f8f8",
              borderRadius: 8,
            }}
          >
            <strong>Preview:</strong>
            <ul>
              {popularFacilities.map((facility, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span>{facility}</span>
                  <button
                    style={{
                      marginLeft: 12,
                      color: "red",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    onClick={() =>
                      set(
                        "popularFacilities",
                        popularFacilities.filter((_, i) => i !== idx),
                      )
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ObjectArrayInput
          label="Rooms"
          items={rooms}
          onChange={(arr) => set("rooms", arr)}
          fields={[
            "name",
            "availability",
            "bed_type",
            "size",
            "features",
            "amenities",
            "choices",
            "originalPrice",
            "currentPrice",
            "discount",
            "deal",
            "guests",
          ]}
          placeholder="Enter room details"
        />
        {/* Show a preview of the mapped room data as it will appear on the property details page */}
        {rooms.length > 0 && (
          <div
            style={{
              margin: "1rem 0",
              padding: "1rem",
              background: "#f8f8f8",
              borderRadius: 8,
            }}
          >
            <strong>Preview:</strong>
            <ul>
              {rooms.map((room, idx) => (
                <li key={idx} style={{ marginBottom: 8, position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <strong>{room.name || "Room"}:</strong>
                    </div>

                    <button
                      style={{
                        marginLeft: 12,
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                      onClick={() =>
                        set(
                          "rooms",
                          rooms.filter((_, i) => i !== idx),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ marginLeft: 8 }}>
                    {room.bed_type ? (
                      room.bed_type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                  <div>Availability: {room.availability}</div>
                  <div>Size: {room.size}</div>
                  <div>
                    Features:{" "}
                    {Array.isArray(room.features)
                      ? room.features.join(", ")
                      : room.features}
                  </div>
                  <div>
                    Amenities:{" "}
                    {Array.isArray(room.amenities)
                      ? room.amenities.join(", ")
                      : room.amenities}
                  </div>
                  <div>
                    Choices:{" "}
                    {Array.isArray(room.choices)
                      ? room.choices.join(", ")
                      : room.choices}
                  </div>
                  <div>Original Price: {room.originalPrice}</div>
                  {room.currentPrice && (
                    <div>Current Price: {room.currentPrice}</div>
                  )}
                  {room.discount && <div>Discount: {room.discount}</div>}
                  {room.deal && <div>Deal: {room.deal}</div>}
                  <div>Guests: {room.guests || 1}</div>
                  {/* Exclude infants checkbox moved to form under guests field */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
