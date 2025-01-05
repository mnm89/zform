import React from "react";
import { useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParsedField } from "../parser";
import { useFormField } from "@/components/ui/form";

function useSelectField(field: ParsedField) {
  const { setValue, getValues } = useFormContext();
  const { id, name } = useFormField();
  const { key, required, options } = field;
  const value = getValues(name);
  const onValueChange = (value: string) => {
    setValue(name, value, { shouldValidate: true });
  };
  return { key, required, id, name, onValueChange, value, options };
}
export const SelectField: React.FC<{ field: ParsedField }> = ({ field }) => {
  const { key, options, ...props } = useSelectField(field);

  return (
    <Select key={key} {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options?.map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export const getSelectFieldComponent = (typeOverride?: "autocomplete") => {
  if (typeOverride === "autocomplete") return SelectField;
  return SelectField;
};
