"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import "./../../src/styles/MonthYear.css";

type MonthYearPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const months = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

export default function MonthYearPicker({
  value,
  onChange,
}: MonthYearPickerProps) {
  const currentDate = new Date();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    return value ? Number(value.split("-")[0]) : currentDate.getFullYear();
  });

  useEffect(() => {
    if (value) {
      setSelectedYear(Number(value.split("-")[0]));
    }
  }, [value]);

  const selectedMonth = value ? Number(value.split("-")[1]) - 1 : -1;

  const selectMonth = (monthIndex: number) => {
    const month = String(monthIndex + 1).padStart(2, "0");

    onChange(`${selectedYear}-${month}`);
    setIsOpen(false);
  };

  const selectCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    setSelectedYear(year);
    onChange(`${year}-${month}`);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange("");
    setSelectedYear(currentDate.getFullYear());
    setIsOpen(false);
  };

  return (
    <div className="month-picker">
      <button
        type="button"
        className={`month-picker-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label="Select month and year"
      >
        <span className="month-picker-trigger-icon">
          <CalendarDays size={19} />
        </span>

        <span className="month-picker-trigger-text">
          <span className="month-picker-value">
            {value
              ? `${months[selectedMonth]} ${selectedYear}`
              : "All months"}
          </span>
        </span>

        {value && (
          <span
            role="button"
            tabIndex={0}
            className="month-picker-clear-trigger"
            aria-label="Clear month filter"
            onClick={(event) => {
              event.stopPropagation();
              clearSelection();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                clearSelection();
              }
            }}
          >
            <X size={16} />
          </span>
        )}

        <ChevronRight
          size={18}
          className={`month-picker-chevron ${isOpen ? "rotated" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="month-picker-backdrop"
            aria-label="Close month picker"
            onClick={() => setIsOpen(false)}
          />

          <div className="month-picker-popup">
            <div className="month-picker-popup-header">

              <button
                type="button"
                className="month-picker-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="month-picker-year">
              <button
                type="button"
                className="month-picker-year-button"
                onClick={() => setSelectedYear((year) => year - 1)}
                aria-label="Previous year"
              >
                <ChevronLeft size={20} />
              </button>

              <span>{selectedYear}</span>

              <button
                type="button"
                className="month-picker-year-button"
                onClick={() => setSelectedYear((year) => year + 1)}
                aria-label="Next year"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="month-picker-grid">
              {months.map((month, index) => {
                const isSelected =
                  selectedMonth === index &&
                  value.startsWith(`${selectedYear}-`);

                return (
                  <button
                    type="button"
                    key={month}
                    className={`month-picker-month ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => selectMonth(index)}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            <div className="month-picker-footer">
              <button
                type="button"
                className="month-picker-clear"
                onClick={clearSelection}
              >
                Clear
              </button>

              <button
                type="button"
                className="month-picker-today"
                onClick={selectCurrentMonth}
              >
                This month
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}