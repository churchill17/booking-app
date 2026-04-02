import React from "react";
import { FormField } from "../ui.jsx";
import FacilityGroupInput from "./FacilityGroupInput.jsx";
import { ObjectArrayInput } from "./StepExtraDetails.jsx";
import { StepHeading } from "../ui.jsx";
import Card from "../Card.jsx";

export function StepFacilitiesFAQs({ data, set }) {
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  const facilities =
    typeof data.facilities === "object" && data.facilities !== null
      ? data.facilities
      : {};
  // All possible facility groups and their types (object = name/extra, string = plain, array = list)
  const facilityGroups = [
    { key: "bathroom", label: "Bathroom", type: "string" },
    { key: "bedroom", label: "Bedroom", type: "string" },
    { key: "view", label: "View", type: "string" },
    { key: "outdoors", label: "Outdoors", type: "string" },
    { key: "kitchen", label: "Kitchen", type: "string" },
    { key: "internet", label: "Internet (description)", type: "string" },
    { key: "parking", label: "Parking (description)", type: "string" },
    { key: "receptionServices", label: "Reception Services", type: "string" },
    { key: "familyFriendly", label: "Family Friendly", type: "string" },
    { key: "foodAndDrink", label: "Food & Drink", type: "object" },
    { key: "safety", label: "Safety & Security", type: "string" },
    { key: "general", label: "General", type: "object" },
    { key: "roomAmenities", label: "Room Amenities", type: "string" },
    { key: "activities", label: "Activities", type: "object" },
    { key: "livingArea", label: "Living Area", type: "string" },
    { key: "cleaning", label: "Cleaning", type: "object" },
    { key: "business", label: "Business", type: "object" },
    { key: "wellness", label: "Wellness", type: "object" },
    { key: "languages", label: "Languages", type: "string" },
  ];

  return (
    <div className="animate-in">
      <StepHeading
        title="Facilities & FAQs"
        subtitle="Add facilities and frequently asked questions."
      />
      <Card>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {facilityGroups.map((group) => (
            <div key={group.key} style={{ minWidth: 320, flex: 1 }}>
              <FacilityGroupInput
                label={group.label}
                items={
                  Array.isArray(facilities[group.key])
                    ? facilities[group.key]
                    : typeof facilities[group.key] === "string"
                      ? [facilities[group.key]]
                      : []
                }
                itemType={group.type}
                onChange={(arr) => {
                  set("facilities", {
                    ...facilities,
                    [group.key]:
                      group.type === "string" && arr.length === 1
                        ? arr[0]
                        : arr,
                  });
                }}
              />
            </div>
          ))}
        </div>
        <ObjectArrayInput
          label="FAQs"
          items={faqs}
          onChange={(arr) => set("faqs", arr)}
          fields={["question", "answer"]}
        />
        {/* Display FAQs as a bulleted list, matching facility field style */}
        {faqs.length > 0 && (
          <ul style={{ paddingLeft: 18 }}>
            {faqs.map((faq, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span style={{ marginRight: 8 }}>
                  <strong>Q:</strong> {faq.question}
                  <br />
                  <strong>A:</strong> {faq.answer}
                </span>
                <button
                  style={{
                    marginLeft: 8,
                    color: "red",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    set(
                      "faqs",
                      faqs.filter((_, i) => i !== idx),
                    )
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
