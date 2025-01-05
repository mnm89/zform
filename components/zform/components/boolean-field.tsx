import React from "react";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ParsedField } from "../parser";
import { useFormField } from "@/components/ui/form";

function useBooleanField(field: ParsedField) {
  const { setValue, getValues } = useFormContext();

  const { id, name } = useFormField();
  const { key, required } = field;
  const checked = getValues(name);

  function onCheckedChange(checked: boolean) {
    setValue(name, checked, { shouldValidate: true });
  }
  return { required, id, key, onCheckedChange, checked };
}

export const BooleanField: React.FC<{
  field: ParsedField;
}> = ({ field }) => {
  const { key, ...props } = useBooleanField(field);
  return <Checkbox key={key} {...props} />;
};

export const SwitchField: React.FC<{
  field: ParsedField;
}> = ({ field }) => {
  const { key, ...props } = useBooleanField(field);

  return <Switch key={key} {...props} />;
};
export function getBooleanFieldComponent(typeOverride?: "switch") {
  if (typeOverride === "switch") return SwitchField;
  return BooleanField;
}