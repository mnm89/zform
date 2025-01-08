import React, { useEffect, useRef } from "react";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ParsedField } from "../core/types";
import { useFormField } from "@/components/ui/form";
import { ZFieldProps } from "../types";
import { useZField } from "../context";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

function formatDate(date: Date) {
  return format(date, "LLL dd, y");
}

function useDateField(field: ParsedField) {
  const { setValue, getValues } = useFormContext();
  const { id, name } = useFormField();
  const { key } = field;
  const selected = getValues(name);
  const onSelect = (date: Date | DateRange | undefined) => {
    setValue(name, date, { shouldValidate: true });
  };

  return { key, id, onSelect, selected };
}
export const DateField: React.FC<ZFieldProps> = ({ field, path }) => {
  const popoverTriggerRef = useRef<HTMLButtonElement>(null); // Ref for the PopoverTrigger

  const { calendarProps } = useZField(field, path);
  const { id, key, onSelect, selected } = useDateField(field);

  useEffect(() => {
    if (selected) popoverTriggerRef.current?.click();
  }, [selected]);

  return (
    <Popover key={key}>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button
          variant={"outline"}
          className={cn(
            "w-full font-normal",
            !selected && "text-muted-foreground"
          )}
          type="button"
        >
          <CalendarIcon />
          {selected ? formatDate(selected) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          id={id}
          captionLayout="dropdown"
          selected={selected}
          {...calendarProps}
          mode="single"
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export const DateRangeField: React.FC<ZFieldProps> = ({ field, path }) => {
  const popoverTriggerRef = useRef<HTMLButtonElement>(null); // Ref for the PopoverTrigger

  const { calendarProps } = useZField(field, path);
  const { id, key, onSelect, selected } = useDateField(field);

  useEffect(() => {
    if (selected) popoverTriggerRef.current?.click();
  }, [selected]);

  return (
    <Popover key={key}>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button
          variant={"outline"}
          className={cn(
            "w-full font-normal",
            !selected && "text-muted-foreground"
          )}
          type="button"
        >
          <CalendarIcon />
          {selected?.from ? (
            selected.to ? (
              <>
                {formatDate(selected.from)} - {formatDate(selected.to)}
              </>
            ) : (
              formatDate(selected.from)
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          id={id}
          captionLayout="dropdown"
          defaultMonth={selected?.from}
          selected={selected}
          numberOfMonths={2}
          {...calendarProps}
          mode="range"
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
