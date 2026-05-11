import React, { useState } from "react";
import { C } from "../ui.constants.js";
import { Card, StepHeading, InfoBox } from "../ui.jsx";

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

function FAQForm({ onAdd }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [qFocused, setQFocused] = useState(false);
  const [aFocused, setAFocused] = useState(false);
  const canAdd = question.trim() && answer.trim();

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({ question: question.trim(), answer: answer.trim() });
    setQuestion("");
    setAnswer("");
  };

  return (
    <div
      style={{
        background: "#f7f5f2",
        borderRadius: 12,
        padding: "20px 20px 16px",
        border: `1.5px solid ${C.border}`,
      }}
    >
      {/* Question */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            color: C.midnightBlue,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: C.teal,
              color: C.white,
              fontSize: 12,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            Q
          </span>
          Question
        </label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onFocus={() => setQFocused(true)}
          onBlur={() => setQFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && canAdd && handleAdd()}
          placeholder="e.g. Is early check-in available?"
          style={inputStyle(qFocused)}
        />
      </div>

      {/* Answer */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            color: C.midnightBlue,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--oceanBlueLight)",
              color: C.teal,
              fontSize: 12,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `1.5px solid ${C.teal}`,
            }}
          >
            A
          </span>
          Answer
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onFocus={() => setAFocused(true)}
          onBlur={() => setAFocused(false)}
          placeholder="e.g. Early check-in from 10:00 is available on request for a small fee."
          rows={3}
          style={{
            ...inputStyle(aFocused),
            resize: "vertical",
            minHeight: 80,
          }}
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={!canAdd}
        style={{
          width: "100%",
          padding: "12px",
          background: canAdd ? C.teal : C.warmGray,
          color: C.white,
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
          cursor: canAdd ? "pointer" : "not-allowed",
          fontFamily: "inherit",
          transition: "background 0.2s",
          letterSpacing: "0.01em",
        }}
      >
        + Add FAQ
      </button>
    </div>
  );
}

function FAQCard({ faq, onRemove }) {
  return (
    <div
      style={{
        background: C.white,
        border: `1.5px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(24,36,53,0.05)",
      }}
    >
      {/* Question row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "14px 16px 12px",
          borderBottom: `1px solid #f0ece6`,
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: C.teal,
            color: C.white,
            fontSize: 13,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          Q
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: C.midnightBlue,
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {faq.question}
        </p>
        <button
          onClick={onRemove}
          title="Remove"
          style={{
            flexShrink: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.warmGray,
            fontSize: 18,
            lineHeight: 1,
            padding: "0 2px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#c0392b")}
          onMouseLeave={(e) => (e.target.style.color = C.warmGray)}
        >
          ×
        </button>
      </div>

      {/* Answer row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "12px 16px 14px",
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "var(--oceanBlueLight)",
            color: C.teal,
            fontSize: 13,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
            border: `1.5px solid var(--oceanBlueBorder)`,
          }}
        >
          A
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: C.textMid,
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function StepFacilitiesFAQs({ data, set }) {
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];

  const addFaq = (faq) => set("faqs", [...faqs, faq]);
  const removeFaq = (idx) => set("faqs", faqs.filter((_, i) => i !== idx));

  return (
    <div className="animate-in">
      <StepHeading
        title="Frequently asked questions"
        subtitle="Answer the questions guests ask most before booking. This builds trust and reduces messages."
      />

      <Card>
        <FAQForm onAdd={addFaq} />

        {faqs.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.midnightBlue,
                }}
              >
                {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""} added
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: C.teal,
                  fontWeight: 600,
                  background: "var(--oceanBlueLight)",
                  padding: "3px 10px",
                  borderRadius: 12,
                }}
              >
                ✓ Ready
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {faqs.map((faq, idx) => (
                <FAQCard
                  key={idx}
                  faq={faq}
                  index={idx}
                  onRemove={() => removeFaq(idx)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      <InfoBox>
        💡 <strong>Common questions to answer:</strong> Check-in / check-out times, early
        check-in, parking, pet policy, WiFi details, nearest airport, and cancellation terms.
      </InfoBox>
    </div>
  );
}
