import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import "./index.css";

const Calendar: React.FC<any> = ({
  year,
  month,
  highlightedDates = [],
  selectedDate,
  setSelectedDate,
}) => {
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);

  const monthStart = startOfMonth(new Date(currentYear, currentMonth));
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days: Date[] = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    days.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toLocaleDateString("en-US")); // Export selected date
  };

  const handlePrevMonth = () => {
    const prevMonthDate = subMonths(new Date(currentYear, currentMonth), 1);
    setCurrentYear(prevMonthDate.getFullYear());
    setCurrentMonth(prevMonthDate.getMonth());
  };

  const handleNextMonth = () => {
    const nextMonthDate = addMonths(new Date(currentYear, currentMonth), 1);
    setCurrentYear(nextMonthDate.getFullYear());
    setCurrentMonth(nextMonthDate.getMonth());
  };

  return (
    <div className="bg-black text-white p-4 w-[420px] h-full calender pt-0">
      <div className="text-orange text-lg text-right m-0 w-full">
        {currentYear}
      </div>
      <div className="flex justify-between items-center px-4">
        <button onClick={handlePrevMonth} className="text-orange text-lg">
          &#8592;
        </button>
        <h1 className="flex items-center justify-center flex-col">
          {format(monthStart, "MMMM").toUpperCase()}{" "}
        </h1>
        <button onClick={handleNextMonth} className="text-orange text-lg">
          &#8594;
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mt-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            className="text-gray-400 h-12 w-12 flex justify-center items-center text-lg"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2 font-mono">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isHighlighted = highlightedDates.some((d: any) =>
            isSameDay(d, day)
          );
          const isSelected = selectedDate == day.toLocaleDateString("en-US");

          return (
            <div
              key={i}
              onClick={() => isCurrentMonth && handleDateClick(day)}
              className={`flex items-center justify-center font-semibold w-12 h-12 text-xl rounded-full cursor-pointer transition-all
                ${isHighlighted ? "primary text-black" : ""}
                ${isSelected ? "bg-[var(--orange44)] text-[var(--orange)]" : ""}
                ${isCurrentMonth ? "text-[#ddd] hover:bg-[var(--orange44)]" : "text-gray-600 cursor-default"}
              `}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
