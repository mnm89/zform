import React from "react";
import { useFormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ParsedField } from "../core/parser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";

function useNumberField(field: ParsedField) {
  const { register, setValue, getValues } = useFormContext();
  const { id, name } = useFormField();
  const { type, key, required } = field;
  const value: number = getValues(name) || 0;
  const increment = (step: number) => {
    setValue(name, value + step);
  };

  const decrement = (step: number) => {
    setValue(name, value - step);
  };
  return {
    type,
    key,
    required,
    id,
    value,
    increment,
    decrement,
    ...register(name, { valueAsNumber: true }),
  };
}

export const NumberField: React.FC<{
  field: ParsedField;
  inputProps?: React.ComponentProps<"input">;
}> = ({ field, inputProps }) => {
  const { key, ...props } = useNumberField(field);

  return <Input key={key} {...inputProps} {...props} />;
};

const StepperField: React.FC<{
  field: ParsedField;
  inputProps?: React.ComponentProps<"input">;
}> = ({ field, inputProps }) => {
  const { key, id, increment, decrement, value } = useNumberField(field);

  const step = inputProps?.step ? Number(inputProps.step) : 1;
  const max = inputProps?.max
    ? Number(inputProps.max)
    : Number.MAX_SAFE_INTEGER;
  const min = inputProps?.min
    ? Number(inputProps.min)
    : Number.MIN_SAFE_INTEGER;

  return (
    <div key={key} id={id} className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => decrement(step)}
        aria-label="Decrement"
        disabled={min >= value}
      >
        <Minus />
      </Button>
      <Badge variant="outline" className="size-10 text-center">
        <span className="text-lg font-semibold m-auto">{value}</span>
      </Badge>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => increment(step)}
        disabled={max <= value}
        aria-label="Increment"
      >
        <Plus />
      </Button>
    </div>
  );
};

export const getNumberFieldComponent = (typeOverride?: "stepper") => {
  if (typeOverride === "stepper") return StepperField;
  return NumberField;
};
