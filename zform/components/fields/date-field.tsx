import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useZField } from "../../context";
import { ParsedField } from "../../core/types";
import { ZFieldProps } from "../../types";
import { Calendar } from "../calendar";

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
  const [isOpen, setIsOpen] = useState(false);

  const { calendarProps } = useZField(field, path);
  const { id, key, onSelect, selected } = useDateField(field);

  useEffect(() => {
    if (selected && isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Popover key={key} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
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
          {...calendarProps}
          selected={selected}
          mode="single"
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export const DateRangeField: React.FC<ZFieldProps> = ({ field, path }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { calendarProps } = useZField(field, path);
  const { id, key, onSelect, selected } = useDateField(field);

  useEffect(() => {
    if (selected && isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Popover key={key} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
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
          {...calendarProps}
          defaultMonth={selected?.from}
          selected={selected}
          numberOfMonths={2}
          mode="range"
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
