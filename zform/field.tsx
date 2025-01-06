import React from "react";
import { useFormContext } from "react-hook-form";
import { getDescriptions, getLabel } from "./core/parser";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ArrayField } from "./components/array-field";
import { ObjectField } from "./components/object-field";
import { getStringFieldComponent } from "./components/string-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBooleanFieldComponent } from "./components/boolean-field";
import { getSelectFieldComponent } from "./components/select-field";
import { getDateFieldComponent } from "./components/date-field";
import { getNumberFieldComponent } from "./components/number-field";
import { ZFieldProps, ZWrapperProps } from "./types";
import { ParsedField } from "./core/types";

export const ZWrapper: React.FC<
  ZWrapperProps & { children: React.ReactNode }
> = ({ className, description, label, name, type, children }) => {
  const { control } = useFormContext();
  if (type === "boolean")
    return (
      <FormField
        name={name}
        control={control}
        render={() => (
          <FormItem
            className={cn(
              "flex flex-row justify-start space-x-3 space-y-0",
              className
            )}
          >
            <FormControl>{children}</FormControl>

            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    );
  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{children}</FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const ZField: React.FC<ZFieldProps> = ({ field, path, props = {} }) => {
  const { labelOverride, descriptionOverride, itemClassName, typeOverride } =
    props;
  const label = labelOverride || getLabel(field);
  const description = descriptionOverride || getDescriptions(field) || "";
  const name = path.join(".");

  if (field.type === "array")
    return (
      <ArrayField
        field={field}
        path={path}
        className={itemClassName}
        label={label}
        description={description}
      />
    );
  if (field.type === "object")
    return (
      <ObjectField
        field={field}
        path={path}
        className={itemClassName}
        label={label}
        description={description}
      />
    );

  const FieldComponent = getFieldComponent(field.type, typeOverride);

  if (!FieldComponent)
    return (
      <Alert variant="destructive" className="h-full">
        <AlertCircle className="size-4" />
        <AlertTitle>Unhandled field type {field.type}</AlertTitle>
        <AlertDescription> - {field.key}</AlertDescription>
      </Alert>
    );

  return (
    <ZWrapper
      label={label}
      description={description}
      name={name}
      type={field.type}
      className={itemClassName}
    >
      <FieldComponent field={field} path={path} {...props} />
    </ZWrapper>
  );
};

export const getFieldComponent = (
  type: ParsedField["type"],
  typeOverride?: Exclude<ZFieldProps["props"], undefined>["typeOverride"]
) => {
  switch (type) {
    case "string":
      return getStringFieldComponent(typeOverride as "password" | "textarea");
    case "boolean":
      return getBooleanFieldComponent(typeOverride as "switch");
    case "select":
      return getSelectFieldComponent(typeOverride as "autocomplete");
    case "date":
      return getDateFieldComponent(typeOverride as "range");
    case "number":
      return getNumberFieldComponent(typeOverride as "stepper");
    default:
      return null;
  }
};
