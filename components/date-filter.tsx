"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import useDateFilter from "@/hooks/use-date-filter";
import { SelectRangeEventHandler } from "react-day-picker";

export function DateFilter({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRangePickerValue, onDateRangePickerValueChange } =
    useDateFilter();

  const onSelect: SelectRangeEventHandler = (range) =>
    onDateRangePickerValueChange({
      from: range?.from,
      to: range?.to,
      selectValue: undefined,
    });

  return (
    <div className="flex items-center gap-4">
      <div className="min-w-[165px]">
        <div className={cn("grid gap-2", className)}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRangePickerValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRangePickerValue?.from ? (
                  dateRangePickerValue.to ? (
                    <>
                      {format(dateRangePickerValue.from, "LLL dd, y")} -{" "}
                      {format(dateRangePickerValue.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRangePickerValue.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRangePickerValue?.from}
                selected={dateRangePickerValue!}
                onSelect={onSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
