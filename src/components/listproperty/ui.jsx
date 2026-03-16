/**
 * src/components/ui.jsx
 * Shared tokens + UI primitives for all list-property pages.
 * Exports: C, PrimaryBtn, SecondaryBtn, Card, FormField, TextInput,
 *          SelectInput, Counter, RadioGroup, Checkbox, Toggle, BedRow,
 *          InfoBox, StepHeading, ProgressStrip, WizardNav, InternalNav
 */
import { useState } from "react";
import { C, STAGE_GROUPS } from "./ui.constants.js";

export function PrimaryBtn({
  children,
  onClick,
  disabled,
  fullWidth,
  style: s = {},
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? C.warmGray : C.teal,
        color: C.white,
        border: "none",
        borderRadius: 8,
        padding: "14px 28px",
        fontSize: 15,
        fontWeight: 700,
        width: fullWidth ? "100%" : "auto",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        fontFamily: "inherit",
        lineHeight: 1,
        ...s,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({ children, onClick, style: s = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: C.midnightBlue,
        border: `1.5px solid ${C.border}`,
        borderRadius: 8,
        padding: "13px 24px",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 0.2s",
        ...s,
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, style: s = {} }) {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        padding: "24px 28px",
        marginBottom: 16,
        boxShadow: "0 1px 4px rgba(24,36,53,0.06)",
        ...s,
      }}
    >
      {children}
    </div>
  );
}

export function FormField({ label, required, children, error }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.midnightBlue,
            display: "block",
            marginBottom: 5,
          }}
        >
          {label}
          {required && <span style={{ color: C.error, marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <span
          style={{
            fontSize: 12,
            color: C.error,
            display: "block",
            marginTop: 4,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "11px 14px",
        border: `1.5px solid ${focused ? C.teal : C.border}`,
        borderRadius: 8,
        fontSize: 15,
        background: C.white,
        color: C.midnightBlue,
        outline: "none",
        transition: "border-color 0.2s",
        fontFamily: "inherit",
        boxSizing: "border-box",
      }}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Select",
}) {
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
        background: C.white,
        color: value ? C.midnightBlue : C.textLight,
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
        fontFamily: "inherit",
        boxSizing: "border-box",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b3aca9' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  );
}

export function Counter({ value, onChange, min = 0, max = 20 }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: `1.5px solid ${C.border}`,
        borderRadius: 8,
        overflow: "hidden",
        width: 120,
      }}
    >
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 40,
          height: 40,
          background: "none",
          border: "none",
          fontSize: 20,
          fontWeight: 300,
          cursor: "pointer",
          color: value > min ? C.teal : C.warmGray,
          fontFamily: "inherit",
        }}
      >
        −
      </button>
      <span
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          color: C.midnightBlue,
        }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 40,
          height: 40,
          background: "none",
          border: "none",
          fontSize: 20,
          fontWeight: 300,
          cursor: "pointer",
          color: C.teal,
          fontFamily: "inherit",
        }}
      >
        +
      </button>
    </div>
  );
}

export function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            fontSize: 15,
            padding: "6px 0",
          }}
        >
          <div
            onClick={() => onChange(opt)}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: `2px solid ${value === opt ? C.teal : C.border}`,
              background: value === opt ? C.teal : C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            {value === opt && (
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.white,
                }}
              />
            )}
          </div>
          <span style={{ color: C.midnightBlue }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export function Checkbox({ label, checked, onChange, children }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        cursor: "pointer",
        fontSize: 14,
        padding: "5px 0",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          flexShrink: 0,
          marginTop: 1,
          border: `2px solid ${checked ? C.teal : C.border}`,
          background: checked ? C.teal : C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        {checked && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path
              d="M1 4L4 7L10 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <span style={{ color: C.textMid, lineHeight: 1.5 }}>
        {label || children}
      </span>
    </label>
  );
}

export function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        background: checked ? C.teal : C.warmGray,
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: C.white,
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,.2)",
        }}
      />
    </div>
  );
}

export function BedRow({ label, sub, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #f0ece6",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 22 }}>🛏</div>
        <div>
          <div
            style={{
              fontWeight: value > 0 ? 600 : 400,
              fontSize: 15,
              color: C.midnightBlue,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: 12, color: C.warmGray }}>{sub}</div>
        </div>
      </div>
      <Counter value={value} onChange={onChange} />
    </div>
  );
}

export function InfoBox({ children, style: s = {} }) {
  return (
    <div
      style={{
        background: "#e8f5f3",
        border: "1px solid #a8ddd6",
        borderRadius: 10,
        padding: "14px 18px",
        fontSize: 14,
        color: "#0f6b5c",
        lineHeight: 1.6,
        ...s,
      }}
    >
      {children}
    </div>
  );
}

export function StepHeading({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: C.midnightBlue,
          lineHeight: 1.2,
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: C.textLight, fontSize: 15, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ProgressStrip({ step }) {
  const active = STAGE_GROUPS.findIndex((g) => g.steps.includes(step));
  return (
    <div
      style={{
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: "0 28px",
      }}
    >
      <div style={{ display: "flex", maxWidth: 900, margin: "0 auto" }}>
        {STAGE_GROUPS.map((g, i) => {
          const done = i < active,
            isActive = i === active;
          return (
            <div key={i} style={{ flex: 1, paddingTop: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? C.teal : done ? C.teal : C.warmGray,
                  paddingBottom: 8,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {done ? "✓ " : ""}
                {g.label}
              </div>
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: isActive ? C.teal : done ? C.teal : C.border,
                  transition: "background 0.3s",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WizardNav({
  onBack,
  onNext,
  nextLabel = "Continue →",
  showBack = true,
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        padding: "14px 24px",
        display: "flex",
        justifyContent: "center",
        boxShadow: "0 -2px 12px rgba(24,36,53,0.08)",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 640 }}>
        {showBack && (
          <SecondaryBtn onClick={onBack} style={{ minWidth: 90 }}>
            ← Back
          </SecondaryBtn>
        )}
        <PrimaryBtn onClick={onNext} fullWidth>
          {nextLabel}
        </PrimaryBtn>
      </div>
    </div>
  );
}

export function InternalNav({ user, onHome }) {
  return (
    <nav
      style={{
        background: C.midnightBlue,
        padding: "0 28px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(24,36,53,0.25)",
      }}
    >
      <button
        onClick={onHome}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          color: C.white,
          fontWeight: 700,
          fontSize: 15,
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to site
      </button>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: C.teal,
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {user.firstName?.[0]?.toUpperCase()}
          </div>
          <span style={{ color: C.lightBeige, fontSize: 14 }}>
            {user.firstName}
          </span>
        </div>
      )}
    </nav>
  );
}
