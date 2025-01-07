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

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
}

function useDateField(field: ParsedField) {
  const { setValue, getValues } = useFormContext();
  const { id, name } = useFormField();
  const { key } = field;
  const selected = getValues(name);
  const onSelect = (date: Date | undefined) => {
    setValue(name, date, { shouldValidate: true });
  };

  return { key, id, onSelect, selected };
}
const DateField: React.FC<ZFieldProps> = ({ field, path }) => {
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
          {selected ? formatDate(selected) : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto size-4 opacity-50" />
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
export const getDateFieldComponent = (typeOverride?: "range") => {
  if (typeOverride === "range")
    throw new Error("Not implemented", { cause: { typeOverride } });
  return DateField;
};
