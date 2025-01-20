import React from "react";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ParsedField } from "../../core/types";
import { useFormField } from "@/components/ui/form";
import { ZFieldProps } from "../../types";
import { useZField } from "../../context";

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

export const CheckboxField: React.FC<ZFieldProps> = ({ field, path }) => {
  const { key, ...props } = useBooleanField(field);
  const { checkboxProps } = useZField(field, path);
  return <Checkbox key={key} {...props} {...checkboxProps} />;
};

export const SwitchField: React.FC<ZFieldProps> = ({ field, path }) => {
  const { key, ...props } = useBooleanField(field);

  const { switchProps } = useZField(field, path);
  return <Switch key={key} {...props} {...switchProps} />;
};
