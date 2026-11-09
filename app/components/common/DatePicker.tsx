
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import "../../src/styles/DatePicker.css";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DatePicker({
  value,
  onChange,
}: DatePickerProps) {
  const today = new Date();

  const [isOpen, setIsOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() =>
    value ? new Date(`${value}T00:00:00`) : null
  );

  const [viewDate, setViewDate] = useState(() =>
    value ? new Date(`${value}T00:00:00`) : today
  );

  useEffect(() => {
    if (value) {
      const date = new Date(`${value}T00:00:00`);

      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setViewDate(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const selectDate = (day: number) => {
    const date = new Date(year, month, day);

    setSelectedDate(date);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const changeMonth = (amount: number) => {
    setViewDate(new Date(year, month + amount, 1));
  };

  const changeYear = (amount: number) => {
    setViewDate(new Date(year + amount, month, 1));
  };

  const selectToday = () => {
    setViewDate(today);
    setSelectedDate(today);
    onChange(formatDate(today));
    setIsOpen(false);
  };

  const clearSelection = () => {
    setSelectedDate(null);
    onChange("");
    setViewDate(today);
    setIsOpen(false);
  };

  const isToday = (day: number) =>
    formatDate(new Date(year, month, day)) === formatDate(today);

  const isSelected = (day: number) =>
    selectedDate !== null &&
    formatDate(selectedDate) ===
      formatDate(new Date(year, month, day));

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select date";

  return (
    <div className="date-picker">
      <button
        type="button"
        className={`date-picker-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="date-picker-trigger-icon">
          <CalendarDays size={19} />
        </span>

        <span className="date-picker-trigger-text">
          <span className="date-picker-label hidden">FILTER BY DATE</span>
          <span className="date-picker-value">{displayValue}</span>
        </span>

        {value && (
          <span
            role="button"
            tabIndex={0}
            className="date-picker-clear-trigger"
            aria-label="Clear date"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                clearSelection();
              }
            }}
          >
            <X size={16} />
          </span>
        )}

        <ChevronRight
          size={18}
          className={`date-picker-chevron ${isOpen ? "rotated" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="date-picker-backdrop"
            aria-label="Close calendar"
            onClick={() => setIsOpen(false)}
          />

          <div className="date-picker-popup">
            {/* <div className="date-picker-popup-header">
              <div>
                <span className="date-picker-eyebrow">
                  REPORT FILTER
                </span>
                <h3>Select Date</h3>
              </div>

              <button
                type="button"
                className="date-picker-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div> */}

            <div className="date-picker-navigation">
              <button
                type="button"
                onClick={() => changeYear(-1)}
                aria-label="Previous year"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="date-picker-month-year">
                <span>{months[month]}</span>
                <strong>{year}</strong>
              </div>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>

              <button
                type="button"
                onClick={() => changeYear(1)}
                aria-label="Next year"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="date-picker-calendar">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="date-picker-weekday"
                >
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div key={index}>
                  {day !== null && (
                    <button
                      type="button"
                      className={[
                        "date-picker-day",
                        isSelected(day) ? "selected" : "",
                        isToday(day) ? "today" : "",
                      ].join(" ")}
                      onClick={() => selectDate(day)}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="date-picker-footer">
              <button
                type="button"
                className="date-picker-clear"
                onClick={clearSelection}
              >
                Clear
              </button>

              <button
                type="button"
                className="date-picker-today"
                onClick={selectToday}
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
