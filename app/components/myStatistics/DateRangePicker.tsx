"use client";

import {
  addWeeks,
  endOfWeek,
  format,
  startOfWeek,
  subWeeks,
} from "date-fns";
import type { DateRange } from "react-day-picker";

import LeftArrow from "@/app/assets/icons/backArrow.svg";
import RightArrow from "@/app/assets/icons/forwardArrow.svg";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) return;
  
    const from = startOfWeek(range.from, { weekStartsOn: 1 });
    const to = endOfWeek(range.from, { weekStartsOn: 1 });
  
    onChange({
      from,
      to,
    });
  };

  const handlePreviousWeek = () => {
    if (!value.from) return;

    const previousWeek = subWeeks(value.from, 1);

    onChange({
      from: startOfWeek(previousWeek, { weekStartsOn: 1 }),
      to: endOfWeek(previousWeek, { weekStartsOn: 1 }),
    });
  };

  const handleNextWeek = () => {
    if (!value.from) return;

    const nextWeek = addWeeks(value.from, 1);

    onChange({
      from: startOfWeek(nextWeek, { weekStartsOn: 1 }),
      to: endOfWeek(nextWeek, { weekStartsOn: 1 }),
    });
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handlePreviousWeek}
        className="flex h-10 w-10 items-center justify-center"
        aria-label="Previous week"
      >
        <LeftArrow />
      </button>

      <Popover>
        <PopoverTrigger>
          {value.from && value.to && (
            <>
              {format(value.from, "MMM d")} -{" "}
              {format(value.to, "MMM d, yyyy")}
            </>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-white" align="center">
          <Calendar
            mode="range"
            selected={value}
            onSelect={handleSelect}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={handleNextWeek}
        className="flex h-10 w-10 items-center justify-center"
        aria-label="Next week"
      >
        <RightArrow />
      </button>
    </div>
  );
}