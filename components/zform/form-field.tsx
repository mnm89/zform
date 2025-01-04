import React from "react";
import { useFormContext } from "react-hook-form";
import { getDescriptions, getLabel, ParsedField } from "./parser";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "../ui/form";

import { ArrayField } from "./array-field";
import { ObjectField } from "./object-field";
import { Input } from "../ui/input";

export const FieldComponent: React.FC<{
  field: ParsedField;
  path: string[];
}> = ({ field, path }) => {
  const { id, name } = useFormField();
  const { type, key, required } = field;

  if (field.type === "array") return <ArrayField field={field} path={path} />;
  if (field.type === "object") return <ObjectField field={field} path={path} />;
  // fallback to input ... here we should add more components depending on the field type
  return (
    <Input key={key} type={type} name={name} required={required} id={id} />
  );
};

export const ZFormField: React.FC<{
  field: ParsedField;
  path: string[];
}> = ({ field, path }) => {
  const { control } = useFormContext();
  const label = getLabel(field);
  const description = getDescriptions(field);

  return (
    <FormField
      name={field.key}
      control={control}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FieldComponent field={field} path={path} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
