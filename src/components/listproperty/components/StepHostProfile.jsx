import { C } from "../ui.constants.js";
import { Card, StepHeading, Checkbox, TextInput } from "../ui.jsx";
import "./StepHostProfile.css";

export function StepHostProfile({ data, set }) {
  const ta = {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 14,
    resize: "vertical",
    boxSizing: "border-box",
    color: C.midnightBlue,
    lineHeight: 1.6,
    fontFamily: "inherit",
    minHeight: 96,
    outline: "none",
  };
  const renderCharCount = (val, max) => (
    <span style={{ fontSize: 11, color: C.warmGray }}>
      {val.length} / {max}
    </span>
  );
  return (
    <div className="animate-in">
      <StepHeading
        title="Host profile"
        subtitle="Help your listing stand out. This will be shown on your property page."
      />
      <Card>
        <Checkbox
          label="The property"
          checked={data.showProperty !== false}
          onChange={(v) => set("showProperty", v)}
        />
        {data.showProperty !== false && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <label
                style={{ fontWeight: 600, fontSize: 13, color: C.midnightBlue }}
              >
                About the property
              </label>
              {renderCharCount(data.aboutProperty, 1200)}
            </div>
            <textarea
              value={data.aboutProperty}
              onChange={(e) => set("aboutProperty", e.target.value)}
              placeholder="What makes your place unique?"
              style={ta}
            />
          </div>
        )}
      </Card>
      <Card>
        <Checkbox
          label="The host"
          checked={data.showHost !== false}
          onChange={(v) => set("showHost", v)}
        />
        {data.showHost !== false && (
          <div style={{ marginTop: 14 }}>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: C.midnightBlue,
                  }}
                >
                  Host name
                </label>
                {renderCharCount(data.hostName, 80)}
              </div>
              <TextInput
                value={data.hostName}
                onChange={(v) => set("hostName", v)}
                placeholder="Your name"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <label
                style={{ fontWeight: 600, fontSize: 13, color: C.midnightBlue }}
              >
                About the host
              </label>
              {renderCharCount(data.aboutHost, 1200)}
            </div>
            <textarea
              value={data.aboutHost}
              onChange={(e) => set("aboutHost", e.target.value)}
              placeholder="What are your interests?"
              style={ta}
            />
          </div>
        )}
      </Card>
      <Card>
        <Checkbox
          label="The neighbourhood"
          checked={data.showNeighbourhood !== false}
          onChange={(v) => set("showNeighbourhood", v)}
        />
        {data.showNeighbourhood !== false && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <label
                style={{ fontWeight: 600, fontSize: 13, color: C.midnightBlue }}
              >
                About the neighbourhood
              </label>
              {renderCharCount(data.aboutNeighbourhood, 1200)}
            </div>
            <textarea
              value={data.aboutNeighbourhood}
              onChange={(e) => set("aboutNeighbourhood", e.target.value)}
              style={{ ...ta, border: `2px solid ${C.teal}` }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
