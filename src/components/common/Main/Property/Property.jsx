import PropertyType from "./PropertyType.jsx";
import { PROPERTY_TYPE } from "../../data.js";
import "./Property.css";

export default function Property() {
  return (
    <section>
      <h2>Check property types</h2>
      <div className="property-type">
        {PROPERTY_TYPE.map((propertyType) => (
          <PropertyType key={propertyType.title} {...propertyType} />
        ))}
      </div>
    </section>
  );
}
