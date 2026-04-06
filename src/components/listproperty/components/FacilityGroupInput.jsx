import React from "react";
import { FormField } from "../ui.jsx";
import { PrimaryBtn } from "../ui.jsx";

function FacilityGroupInput({ label, items, onChange, itemType = "string" }) {
  const [input, setInput] = React.useState("");
  const [extra, setExtra] = React.useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    let newItem;
    if (itemType === "object") {
      newItem = { name: input.trim(), extra: extra.trim() || null };
    } else {
      newItem = input.trim();
    }
    onChange([...items, newItem]);
    setInput("");
    setExtra("");
  };

  return (
    <FormField label={label}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={itemType === "object" ? "Facility name" : "Facility"}
          style={{ flex: 1 }}
        />
        {itemType === "object" && (
          <input
            type="text"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="Extra (optional)"
            style={{ flex: 1 }}
          />
        )}
        <PrimaryBtn onClick={handleAdd}>Add</PrimaryBtn>
      </div>
      <ul style={{ paddingLeft: 18 }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            {itemType === "object" ? (
              <>
                {item.name}
                {item.extra && (
                  <span style={{ color: "#888", marginLeft: 8 }}>
                    (Extra: {item.extra})
                  </span>
                )}
              </>
            ) : (
              item
            )}
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
    </FormField>
  );
}

export default FacilityGroupInput;
