"use client";

import { useState } from "react";
import {
  addWeeks,
  endOfWeek,
  format,
  startOfWeek,
  subWeeks,
} from "date-fns";
import LeftArrow from '@/app/assets/icons/backArrow.svg'
import RightArrow from '@/app/assets/icons/forwardArrow.svg'

import type { DateRange } from "react-day-picker";

import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

export default function DateRangePicker() {
  const [date, setDate] = useState<DateRange>(() => {
    const today = new Date();

    return {
      from: startOfWeek(today, { weekStartsOn: 1 }),
      to: endOfWeek(today, { weekStartsOn: 1 }),
    };
  });

  // Select a day → select its entire week
  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate({
      from: startOfWeek(selectedDate, { weekStartsOn: 1 }),
      to: endOfWeek(selectedDate, { weekStartsOn: 1 }),
    });
  };

  // Previous week
  const handlePreviousWeek = () => {
    if (!date.from) return;

    const previousWeek = subWeeks(date.from, 1);

    setDate({
      from: startOfWeek(previousWeek, { weekStartsOn: 1 }),
      to: endOfWeek(previousWeek, { weekStartsOn: 1 }),
    });
  };

  // Next week
  const handleNextWeek = () => {
    if (!date.from) return;

    const nextWeek = addWeeks(date.from, 1);

    setDate({
      from: startOfWeek(nextWeek, { weekStartsOn: 1 }),
      to: endOfWeek(nextWeek, { weekStartsOn: 1 }),
    });
  };

  return (
    <div className="flex items-center">
      {/* Previous week */}
      <button
        type="button"
        onClick={handlePreviousWeek}
        className="flex h-10 w-10 items-center justify-center"
        aria-label="Previous week"
      >
        <LeftArrow  />
      </button>

      {/* Date picker */}
      <Popover>
        <PopoverTrigger
        >

          {date.from && date.to && (
            <>
              {format(date.from, "MMM d")} -{" "}
              {format(date.to, "MMM d, yyyy")}
            </>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date.from}
            onSelect={handleSelect}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>

      {/* Next week */}
      <button
        type="button"
        onClick={handleNextWeek}
        className="flex h-10 w-10 items-center justify-center"
        aria-label="Next week"
      >
        <RightArrow  />
      </button>
    </div>
  );
}