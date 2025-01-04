import React, { ComponentType } from "react";
import { useFormContext } from "react-hook-form";
import { getDescriptions, getLabel, ParsedField } from "./parser";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { ArrayField } from "./array-field";
import { ObjectField } from "./object-field";
import { StringField } from "./components/string-field";
import { PasswordField } from "./components/password-field";

export type FieldProps = {
  itemClassName?: string;
  inputProps?: React.ComponentProps<"input">;
  typeOverride?: "password";
  labelOverride?: string;
  descriptionOverride?: string;
};

export const ZFormField: React.FC<{
  field: ParsedField;
  path: string[];
  props?: FieldProps;
}> = ({ field, path, props = {} }) => {
  const { control } = useFormContext();
  const {
    labelOverride,
    descriptionOverride,
    itemClassName,
    typeOverride,
    inputProps,
  } = props;
  const label = labelOverride || getLabel(field);
  const description = descriptionOverride || getDescriptions(field);

  if (field.type === "array") return <ArrayField field={field} path={path} />;
  if (field.type === "object") return <ObjectField field={field} path={path} />;

  let FieldComponent: ComponentType<{
    field: ParsedField;
    inputProps?: React.ComponentProps<"input">;
  }> = StringField;
  if (typeOverride === "password") FieldComponent = PasswordField;

  return (
    <FormField
      name={field.key}
      control={control}
      render={() => (
        <FormItem className={itemClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FieldComponent field={field} inputProps={inputProps} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
