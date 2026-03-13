import { useState } from "react";
import {
  MONTHS,
  displayDate,
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
} from "../../utils/dateUtils";
import "./CalendarDropdown.css";

export default function CalendarDropdown({ value, onChange, minDate }) {
  const today = new Date();
  const initYear = value
    ? parseInt(value.split("-")[0], 10)
    : today.getFullYear();
  const initMonth = value
    ? parseInt(value.split("-")[1], 10) - 1
    : today.getMonth();
  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="fd-calendar-panel">
      <div className="fd-cal-header">
        <button type="button" className="fd-cal-nav" onClick={prevMonth}>
          ‹
        </button>
        <span className="fd-cal-title">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" className="fd-cal-nav" onClick={nextMonth}>
          ›
        </button>
      </div>

      <div className="fd-cal-weekdays">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="fd-cal-weekday">
            {d}
          </span>
        ))}
      </div>

      <div className="fd-cal-grid">
        {cells.map((day, idx) => {
          if (!day) return <span key={`e-${idx}`} />;
          const dateStr = formatDate(viewYear, viewMonth, day);
          const isSelected = value === dateStr;
          const isPast = minDate
            ? dateStr < minDate
            : dateStr <
              formatDate(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
              );

          return (
            <button
              key={day}
              type="button"
              className={`fd-cal-day ${isSelected ? "selected" : ""} ${isPast ? "past" : ""}`}
              onClick={() => !isPast && onChange(dateStr)}
              disabled={isPast}
            >
              {day}
            </button>
          );
        })}
      </div>

      {value && (
        <div className="fd-cal-selected-display">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a56db"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {displayDate(value)}
        </div>
      )}
    </div>
  );
}
