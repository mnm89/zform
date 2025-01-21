import React from "react";
import { AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useZField } from "./context";
import { ZFieldProps } from "./types";

export const ZField: React.FC<ZFieldProps> = ({ field, path }) => {
  const {
    FieldComponent,
    name,
    className,
    fieldLabel,
    fieldDescription,
    typeOverride,
  } = useZField(field, path);
  const { control } = useFormContext();

  if (!FieldComponent)
    return (
      <Alert variant="destructive" className="h-full">
        <AlertCircle className="size-4" />
        <AlertTitle className="flex gap-2">
          <span>
            Unhandled field of type <b>{field.type}</b>
          </span>
          {typeOverride && (
            <span>
              with type override <b>{typeOverride}</b>
            </span>
          )}
        </AlertTitle>
        <AlertDescription> - {field.key}</AlertDescription>
      </Alert>
    );
  if (field.type === "array")
    return <FieldComponent field={field} path={path} />;
  if (field.type === "object")
    return <FieldComponent field={field} path={path} />;
  if (field.type === "boolean")
    return (
      <FormField
        name={name}
        control={control}
        render={() => (
          <FormItem
            className={cn(
              "flex flex-row items-center justify-start space-x-3 space-y-0",
              className
            )}
          >
            <FormControl>
              <FieldComponent field={field} path={path} />
            </FormControl>

            <div className="space-y-1 leading-none">
              <FormLabel>{fieldLabel}</FormLabel>
              <FormDescription>{fieldDescription}</FormDescription>
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
          <FormLabel>{fieldLabel}</FormLabel>
          <FormControl>
            <FieldComponent field={field} path={path} />
          </FormControl>
          <FormDescription>{fieldDescription}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
