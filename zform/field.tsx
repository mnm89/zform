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
import { ZFieldProps } from "./types";

export const ZField: React.FC<ZFieldProps> = ({ field, path, props = {} }) => {
  const { control } = useFormContext();
  const {
    labelOverride,
    descriptionOverride,
    itemClassName,
    typeOverride,
    inputProps,
    textareaProps,
    calendarProps,
  } = props;
  const label = labelOverride || getLabel(field);
  const description = descriptionOverride || getDescriptions(field);
  const name = path.join(".");

  if (field.type === "array") return <ArrayField field={field} path={path} />;
  if (field.type === "object")
    return (
      <FormField
        name={name}
        control={control}
        render={() => (
          <fieldset className={itemClassName}>
            <legend className="p-2 font-semibold">{label}</legend>
            <FormItem>
              <FormControl>
                <ObjectField field={field} path={path} />
              </FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          </fieldset>
        )}
      />
    );

  if (field.type === "string") {
    const FieldComponent = getStringFieldComponent(
      typeOverride as "password" | "textarea"
    );
    return (
      <FormField
        name={name}
        control={control}
        render={() => (
          <FormItem className={itemClassName}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <FieldComponent
                field={field}
                inputProps={inputProps}
                textareaProps={textareaProps}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  if (field.type === "boolean") {
    const FieldComponent = getBooleanFieldComponent(typeOverride as "switch");
    return (
      <FormField
        name={name}
        control={control}
        render={() => (
          <FormItem
            className={cn(
              "flex flex-row justify-start space-x-3 space-y-0",
              itemClassName
            )}
          >
            <FormControl>
              <FieldComponent field={field} />
            </FormControl>

            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    );
  }

  if (field.type === "select") {
    const FieldComponent = getSelectFieldComponent(
      typeOverride as "autocomplete"
    );
    return (
      <FormField
        name={name}
        control={control}
        render={() => (
          <FormItem className={itemClassName}>
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
  }
  if (field.type === "date") {
    const FieldComponent = getDateFieldComponent(typeOverride as "range");
    return (
      <FormField
        name={name}
        control={control}
        render={() => (
          <FormItem className={itemClassName}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <FieldComponent field={field} calendarProps={calendarProps} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  if (field.type === "number") {
    const FieldComponent = getNumberFieldComponent(typeOverride as "stepper");
    return (
      <FormField
        name={name}
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
  }

  return (
    <Alert variant="destructive" className="h-full">
      <AlertCircle className="size-4" />
      <AlertTitle>Unhandled field type {field.type}</AlertTitle>
      <AlertDescription> - {field.key}</AlertDescription>
    </Alert>
  );
};
