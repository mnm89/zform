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
}> = ({ field }) => {
  const { register } = useFormContext();
  const { id, name } = useFormField();
  const { type, key, required } = field;

  return (
    <Input
      //value={value}
      key={key}
      type={type}
      required={required}
      id={id}
      //onChange={(e) => setValue(name, e.target.value)}
      {...register(name)}
    />
  );
};

export const ZFormField: React.FC<{
  field: ParsedField;
  path: string[];
  props?: { className?: string };
}> = ({ field, path, props }) => {
  const { control } = useFormContext();
  const label = getLabel(field);
  const description = getDescriptions(field);

  if (field.type === "array") return <ArrayField field={field} path={path} />;
  if (field.type === "object") return <ObjectField field={field} path={path} />;
  return (
    <FormField
      name={field.key}
      control={control}
      render={() => (
        <FormItem {...props}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FieldComponent field={field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
