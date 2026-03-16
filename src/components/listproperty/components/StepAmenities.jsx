import { C } from "../ui.constants.js";
import { Card, StepHeading, Checkbox } from "../ui.jsx";
import "./StepAmenities.css";

const AMENITY_GROUPS = {
  General: [
    "Air conditioning",
    "Heating",
    "Free WiFi",
    "Electric vehicle charging station",
  ],
  "Cooking and cleaning": ["Kitchen", "Kitchenette", "Washing machine"],
  Entertainment: [
    "Flat-screen TV",
    "Swimming pool",
    "Hot tub",
    "Minibar",
    "Sauna",
  ],
  "Outside and view": ["Balcony", "Garden view", "Terrace", "View"],
};

export function StepAmenities({ data, set }) {
  const toggle = (item) =>
    set("selectedAmenities", {
      ...data.selectedAmenities,
      [item]: !data.selectedAmenities[item],
    });
  return (
    <div className="animate-in">
      <StepHeading title="What can guests use at your place?" />
      {Object.entries(AMENITY_GROUPS).map(([cat, items]) => (
        <Card key={cat}>
          <div
            style={{ fontWeight: 700, marginBottom: 12, color: C.midnightBlue }}
          >
            {cat}
          </div>
          {items.map((item) => (
            <Checkbox
              key={item}
              label={item}
              checked={!!data.selectedAmenities[item]}
              onChange={() => toggle(item)}
            />
          ))}
        </Card>
      ))}
    </div>
  );
}
