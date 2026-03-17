/**
 * src/components/ui.jsx
 * Shared tokens + UI primitives for all list-property pages.
 * Exports: C, PrimaryBtn, SecondaryBtn, Card, FormField, TextInput,
 *          SelectInput, Counter, RadioGroup, Checkbox, Toggle, BedRow,
 *          InfoBox, StepHeading, ProgressStrip, WizardNav, InternalNav
 */
import { useState } from "react";
import { C, STAGE_GROUPS } from "./ui.constants.js";
import "./globals.css";

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
        borderRadius: "var(--lp-radius-md, 8px)",
        padding: "var(--lp-primary-btn-pad, 14px 28px)",
        fontSize: "var(--lp-btn-font-size, 15px)",
        fontWeight: 700,
        width: fullWidth ? "100%" : "auto",
        minHeight: "var(--lp-btn-min-height, auto)",
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
        borderRadius: "var(--lp-radius-md, 8px)",
        padding: "var(--lp-secondary-btn-pad, 13px 24px)",
        fontSize: "var(--lp-btn-font-size, 15px)",
        fontWeight: 500,
        minHeight: "var(--lp-btn-min-height, auto)",
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
        borderRadius: "var(--lp-card-radius, 12px)",
        border: `1px solid ${C.border}`,
        padding: "var(--lp-card-pad, 24px 28px)",
        marginBottom: "var(--lp-card-margin, 16px)",
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
    <div style={{ marginBottom: "var(--lp-field-gap, 18px)" }}>
      {label && (
        <label
          style={{
            fontSize: "var(--lp-label-font-size, 13px)",
            fontWeight: 600,
            color: C.midnightBlue,
            display: "block",
            marginBottom: "var(--lp-label-gap, 5px)",
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
            fontSize: "var(--lp-error-font-size, 12px)",
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
        minHeight: "var(--lp-input-height, auto)",
        padding: "var(--lp-input-pad, 11px 14px)",
        border: `1.5px solid ${focused ? C.teal : C.border}`,
        borderRadius: "var(--lp-radius-md, 8px)",
        fontSize: "var(--lp-input-font-size, 15px)",
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
        minHeight: "var(--lp-input-height, auto)",
        padding: "var(--lp-select-pad, 11px 36px 11px 14px)",
        border: `1.5px solid ${C.border}`,
        borderRadius: "var(--lp-radius-md, 8px)",
        fontSize: "var(--lp-input-font-size, 15px)",
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
        borderRadius: "var(--lp-radius-md, 8px)",
        overflow: "hidden",
        width: "var(--lp-counter-width, 120px)",
      }}
    >
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: "var(--lp-counter-button-size, 40px)",
          height: "var(--lp-counter-button-size, 40px)",
          background: "none",
          border: "none",
          fontSize: "var(--lp-counter-button-font-size, 20px)",
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
          fontSize: "var(--lp-counter-value-font-size, 16px)",
          color: C.midnightBlue,
        }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: "var(--lp-counter-button-size, 40px)",
          height: "var(--lp-counter-button-size, 40px)",
          background: "none",
          border: "none",
          fontSize: "var(--lp-counter-button-font-size, 20px)",
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lp-choice-gap, 10px)",
      }}
    >
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--lp-choice-gap, 10px)",
            cursor: "pointer",
            fontSize: "var(--lp-choice-font-size, 15px)",
            padding: "var(--lp-choice-pad, 6px 0)",
          }}
        >
          <div
            onClick={() => onChange(opt)}
            style={{
              width: "var(--lp-choice-control-size, 20px)",
              height: "var(--lp-choice-control-size, 20px)",
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
                  width: "var(--lp-choice-dot-size, 7px)",
                  height: "var(--lp-choice-dot-size, 7px)",
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
        gap: "var(--lp-choice-gap, 10px)",
        cursor: "pointer",
        fontSize: "var(--lp-checkbox-font-size, 14px)",
        padding: "var(--lp-checkbox-pad, 5px 0)",
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: "var(--lp-choice-control-size, 20px)",
          height: "var(--lp-choice-control-size, 20px)",
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
        width: "var(--lp-toggle-width, 46px)",
        height: "var(--lp-toggle-height, 26px)",
        borderRadius: "var(--lp-toggle-radius, 13px)",
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
          top: "var(--lp-toggle-knob-top, 3px)",
          left: checked
            ? "var(--lp-toggle-knob-left-on, 23px)"
            : "var(--lp-toggle-knob-left-off, 3px)",
          width: "var(--lp-toggle-knob-size, 20px)",
          height: "var(--lp-toggle-knob-size, 20px)",
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
        gap: "var(--lp-bedrow-gap, 12px)",
        padding: "var(--lp-bedrow-pad, 14px 0)",
        borderBottom: "1px solid #f0ece6",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: "var(--lp-bedrow-icon-size, 22px)" }}>🛏</div>
        <div>
          <div
            style={{
              fontWeight: value > 0 ? 600 : 400,
              fontSize: "var(--lp-bedrow-title-size, 15px)",
              color: C.midnightBlue,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: "var(--lp-bedrow-sub-size, 12px)",
              color: C.warmGray,
            }}
          >
            {sub}
          </div>
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
        borderRadius: "var(--lp-info-radius, 10px)",
        padding: "var(--lp-info-pad, 14px 18px)",
        fontSize: "var(--lp-info-font-size, 14px)",
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
    <div style={{ marginBottom: "var(--lp-heading-gap, 28px)" }}>
      <h1
        style={{
          fontSize: "var(--lp-heading-size, 28px)",
          fontWeight: 800,
          color: C.midnightBlue,
          lineHeight: 1.2,
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: C.textLight,
            fontSize: "var(--lp-subtitle-size, 15px)",
            lineHeight: "var(--lp-subtitle-line-height, 1.5)",
          }}
        >
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
        padding: "var(--lp-progress-pad, 0 28px)",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "var(--lp-progress-max-width, 900px)",
          margin: "0 auto",
        }}
      >
        {STAGE_GROUPS.map((g, i) => {
          const done = i < active,
            isActive = i === active;
          return (
            <div key={i} style={{ flex: 1, paddingTop: 10 }}>
              <div
                style={{
                  fontSize: "var(--lp-progress-font-size, 11px)",
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
        padding: "var(--lp-wizard-nav-pad, 14px 24px)",
        display: "flex",
        justifyContent: "center",
        boxShadow: "0 -2px 12px rgba(24,36,53,0.08)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "var(--lp-wizard-nav-gap, 12px)",
          width: "100%",
          maxWidth: "var(--lp-wizard-nav-max-width, 640px)",
        }}
      >
        {showBack && (
          <SecondaryBtn
            onClick={onBack}
            style={{ minWidth: "var(--lp-wizard-back-min-width, 90px)" }}
          >
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
        padding: "var(--lp-internal-nav-pad, 0 28px)",
        height: "var(--lp-internal-nav-height, 56px)",
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
          fontSize: "var(--lp-internal-nav-font-size, 15px)",
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
              width: "var(--lp-internal-avatar-size, 34px)",
              height: "var(--lp-internal-avatar-size, 34px)",
              borderRadius: "50%",
              background: C.teal,
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "var(--lp-internal-avatar-font-size, 14px)",
            }}
          >
            {user.firstName?.[0]?.toUpperCase()}
          </div>
          <span
            style={{
              color: C.lightBeige,
              fontSize: "var(--lp-internal-user-font-size, 14px)",
            }}
          >
            {user.firstName}
          </span>
        </div>
      )}
    </nav>
  );
}
