import { useState, useRef, useEffect } from "react";
import "./CalendarField.css";

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const FLEXIBILITY_OPTIONS = [
  "Exact dates",
  "± 1 day",
  "± 2 days",
  "± 3 days",
  "± 7 days",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}
function sameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isBetween(day, start, end) {
  return start && end && day > start && day < end;
}
function formatDate(d) {
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function CalendarMonth({
  year,
  month,
  checkIn,
  checkOut,
  hovered,
  onDayClick,
  onDayHover,
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = new Date(year, month, 1).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const rangeEnd = checkOut || hovered;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="cal-month">
      <div className="cal-month-title">{monthName}</div>
      <div className="cal-grid">
        {DAY_LABELS.map((l) => (
          <div key={l} className="cal-day-label">
            {l}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="cal-cell empty" />;
          const isPast = day < today;
          return (
            <div
              key={day.getTime()}
              className={[
                "cal-cell",
                isPast ? "past" : "",
                sameDay(day, checkIn) ? "range-start" : "",
                sameDay(day, checkOut) ? "range-end" : "",
                isBetween(day, checkIn, rangeEnd) ? "in-range" : "",
                sameDay(day, hovered) && checkIn && !checkOut ? "hovered" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => !isPast && onDayClick(day)}
              onMouseEnter={() => onDayHover(day)}
              onMouseLeave={() => onDayHover(null)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarField({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [calTab, setCalTab] = useState("calendar");
  const [flexibility, setFlexibility] = useState("Exact dates");
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  function handleDayClick(day) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else {
      if (day < checkIn) {
        setCheckIn(day);
        setCheckOut(null);
      } else setCheckOut(day);
    }
  }

  function prevMonths() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonths() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  const dateLabel = checkIn
    ? checkOut
      ? `${formatDate(checkIn)} — ${formatDate(checkOut)}`
      : `${formatDate(checkIn)} — Check-out`
    : "Check-in — Check-out";

  return (
    <div className="search-field date-field" ref={ref}>
      <span className="field-icon">📅</span>
      <div className="date-display" onClick={() => setOpen((o) => !o)}>
        {dateLabel}
      </div>

      {open && (
        <div className="calendar-dropdown">
          <div className="cal-tabs">
            <button
              type="button"
              className={`cal-tab ${calTab === "calendar" ? "active" : ""}`}
              onClick={() => setCalTab("calendar")}
            >
              Calendar
            </button>
            <button
              type="button"
              className={`cal-tab ${calTab === "flexible" ? "active" : ""}`}
              onClick={() => setCalTab("flexible")}
            >
              I'm flexible
            </button>
          </div>

          {calTab === "calendar" && (
            <>
              <div className="cal-nav">
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={prevMonths}
                >
                  ‹
                </button>
                <div className="cal-months-grid">
                  <CalendarMonth
                    year={viewYear}
                    month={viewMonth}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    hovered={hovered}
                    onDayClick={handleDayClick}
                    onDayHover={setHovered}
                  />
                  <CalendarMonth
                    year={nextYear}
                    month={nextMonth}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    hovered={hovered}
                    onDayClick={handleDayClick}
                    onDayHover={setHovered}
                  />
                </div>
                <button
                  type="button"
                  className="cal-nav-btn"
                  onClick={nextMonths}
                >
                  ›
                </button>
              </div>

              <div className="cal-footer">
                <div className="flex-pills">
                  {FLEXIBILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`flex-pill ${flexibility === opt ? "active" : ""}`}
                      onClick={() => setFlexibility(opt)}
                    >
                      {opt !== "Exact dates" && (
                        <span className="pill-icon">±</span>
                      )}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {calTab === "flexible" && (
            <div className="flexible-placeholder">
              <p>🗓 Flexible date options coming soon</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
