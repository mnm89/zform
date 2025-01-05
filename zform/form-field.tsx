import React from "react";
import { useFormContext } from "react-hook-form";
import { getDescriptions, getLabel, ParsedField } from "./core/parser";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ArrayField } from "./array-field";
import { ObjectField } from "./object-field";
import { getStringFieldComponent } from "./components/string-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBooleanFieldComponent } from "./components/boolean-field";
import { getSelectFieldComponent } from "./components/select-field";
import { getDateFieldComponent } from "./components/date-field";
import { CalendarProps } from "@/components/ui/calendar";
import { getNumberFieldComponent } from "./components/number-field";

export type FieldProps = {
  itemClassName?: string;
  inputProps?: React.ComponentProps<"input">;
  textareaProps?: React.ComponentProps<"textarea">;
  typeOverride?:
    | "password"
    | "switch"
    | "textarea"
    | "autocomplete"
    | "range"
    | "stepper";
  calendarProps?: CalendarProps;
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
    textareaProps,
    calendarProps,
  } = props;
  const label = labelOverride || getLabel(field);
  const description = descriptionOverride || getDescriptions(field);

  if (field.type === "array") return <ArrayField field={field} path={path} />;
  if (field.type === "object") return <ObjectField field={field} path={path} />;

  if (field.type === "string") {
    const FieldComponent = getStringFieldComponent(
      typeOverride as "password" | "textarea"
    );
    return (
      <FormField
        name={field.key}
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
        name={field.key}
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
        name={field.key}
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
        name={field.key}
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
  }

  return (
    <Alert variant="destructive" className="h-full">
      <AlertCircle className="size-4" />
      <AlertTitle>Unhandled field type {field.type}</AlertTitle>
      <AlertDescription> - {field.key}</AlertDescription>
    </Alert>
  );
};
