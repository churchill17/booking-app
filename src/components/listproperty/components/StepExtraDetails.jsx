import React, { useState } from "react";
import {
  FaParking,
  FaWifi,
  FaUtensils,
  FaBed,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdLocationOn, MdOutlinePool } from "react-icons/md";
import {
  Card,
  StepHeading,
  FormField,
  TextInput,
  TextArea,
  PrimaryBtn,
} from "../ui.jsx";

function ArrayInput({
  label,
  items = [],
  onChange,
  placeholder,
  itemPlaceholder,
}) {
  const [input, setInput] = useState("");
  return (
    <FormField label={label}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <TextInput
          value={input}
          onChange={setInput}
          placeholder={itemPlaceholder || placeholder || "Add item"}
        />
        <PrimaryBtn
          onClick={() => {
            if (input.trim()) {
              onChange([...items, input.trim()]);
              setInput("");
            }
          }}
        >
          Add
        </PrimaryBtn>
      </div>
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
                cursor: "pointer",
              }}
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </FormField>
  );
}

function IconDropdown({ value, onChange }) {
  const icons = [
    { name: "FaParking", label: "Parking", icon: <FaParking /> },
    { name: "FaWifi", label: "WiFi", icon: <FaWifi /> },
    { name: "FaUtensils", label: "Dining", icon: <FaUtensils /> },
    { name: "FaBed", label: "Bed", icon: <FaBed /> },
    { name: "FaMapMarkerAlt", label: "Map", icon: <FaMapMarkerAlt /> },
    { name: "MdLocationOn", label: "Location", icon: <MdLocationOn /> },
    { name: "MdOutlinePool", label: "Pool", icon: <MdOutlinePool /> },
  ];
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select icon</option>
      {icons.map((opt) => (
        <option key={opt.name} value={opt.name}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function ObjectArrayInput({
  label,
  items = [],
  onChange,
  fields,
  placeholder,
}) {
  const [inputs, setInputs] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {}),
  );
  return (
    <FormField label={label}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {fields.map((f) =>
          f === "icon" ? (
            <IconDropdown
              key={f}
              value={inputs[f]}
              onChange={(v) => setInputs({ ...inputs, [f]: v })}
            />
          ) : (
            <TextInput
              key={f}
              value={inputs[f]}
              onChange={(v) => setInputs({ ...inputs, [f]: v })}
              placeholder={placeholder || f}
            />
          ),
        )}
        <PrimaryBtn
          onClick={() => {
            if (fields.every((f) => inputs[f].trim())) {
              onChange([...items, { ...inputs }]);
              setInputs(fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {}));
            }
          }}
        >
          Add
        </PrimaryBtn>
      </div>
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
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  const facilities =
    typeof data.facilities === "object" && data.facilities !== null
      ? data.facilities
      : {};

  return (
    <div className="animate-in">
      <StepHeading
        title="Extra Property Details"
        subtitle="Add more details to help guests choose your property."
      />
      <Card>
        <FormField label="Stars (rating)" required>
          <TextInput
            value={data.stars || ""}
            onChange={(v) => set("stars", v)}
            placeholder="e.g. 5"
            type="number"
            min={0}
            max={5}
          />
        </FormField>
        <FormField label="Rating">
          <TextInput
            value={data.rating || ""}
            onChange={(v) => set("rating", v)}
            placeholder="e.g. 4.7"
            type="number"
            min={0}
            max={5}
            step={0.1}
          />
        </FormField>
        <FormField label="Review Count">
          <TextInput
            value={data.reviewCount || ""}
            onChange={(v) => set("reviewCount", v)}
            placeholder="e.g. 120"
            type="number"
            min={0}
          />
        </FormField>
        <FormField label="Rating Label">
          <TextInput
            value={data.ratingLabel || ""}
            onChange={(v) => set("ratingLabel", v)}
            placeholder="e.g. Excellent"
          />
        </FormField>
        <FormField label="Location Score">
          <TextInput
            value={data.locationScore || ""}
            onChange={(v) => set("locationScore", v)}
            placeholder="e.g. 9.2"
            type="number"
            min={0}
            max={10}
            step={0.1}
          />
        </FormField>
        <FormField label="Couple Location Score">
          <TextInput
            value={data.coupleLocationScore || ""}
            onChange={(v) => set("coupleLocationScore", v)}
            placeholder="e.g. 9.5"
            type="number"
            min={0}
            max={10}
            step={0.1}
          />
        </FormField>
        <FormField label="Facilities Description">
          <TextArea
            value={data.descriptionFacilities || ""}
            onChange={(v) => set("descriptionFacilities", v)}
            placeholder="Describe the facilities available."
          />
        </FormField>
        <FormField label="Dining Description">
          <TextArea
            value={data.descriptionDining || ""}
            onChange={(v) => set("descriptionDining", v)}
            placeholder="Describe the dining options."
          />
        </FormField>
        {/* Structured fields with specialized UI */}
        <ObjectArrayInput
          label="Highlights"
          items={highlights}
          onChange={(arr) => set("highlights", arr)}
          fields={["icon", "text"]}
        />
        <ArrayInput
          label="Popular Facilities"
          items={popularFacilities}
          onChange={(arr) => set("popularFacilities", arr)}
          itemPlaceholder="e.g. Free WiFi"
        />
        <ObjectArrayInput
          label="Rooms"
          items={rooms}
          onChange={(arr) => set("rooms", arr)}
          fields={[
            "name",
            "single_beds",
            "double_beds",
            "king_beds",
            "super_king_beds",
            "sofa_beds",
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
              {rooms.map((room, idx) => {
                const bed =
                  [
                    room.single_beds > 0 && `${room.single_beds} single bed(s)`,
                    room.double_beds > 0 && `${room.double_beds} double bed(s)`,
                    room.king_beds > 0 && `${room.king_beds} king bed(s)`,
                    room.super_king_beds > 0 &&
                      `${room.super_king_beds} super king bed(s)`,
                    room.sofa_beds > 0 && `${room.sofa_beds} sofa bed(s)`,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—";
                return (
                  <li key={idx}>
                    <strong>{room.name || "Room"}:</strong> {bed} | Guests:{" "}
                    {room.guests || 1}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <FormField label="Facilities (all groups, JSON object)">
          <TextArea
            value={JSON.stringify(facilities, null, 2)}
            onChange={(v) => {
              try {
                set("facilities", JSON.parse(v));
              } catch {
                // ignore parse error for now
              }
            }}
            placeholder='e.g. {"bathroom":["Shower"],"kitchen":["Microwave"]}'
          />
        </FormField>
        <ObjectArrayInput
          label="FAQs"
          items={faqs}
          onChange={(arr) => set("faqs", arr)}
          fields={["q", "a"]}
        />
      </Card>
    </div>
  );
}
