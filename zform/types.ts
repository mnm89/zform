import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { DefaultValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CalendarProps } from "@/components/ui/calendar";
import { FieldType, ParsedField, ZodObjectOrWrapped } from "./core/types";

interface ZFormBaseProps<TSchema extends ZodObjectOrWrapped> {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit?: SubmitHandler<z.infer<TSchema>>;
  onFormInit?: (
    form: UseFormReturn<z.infer<TSchema>, unknown, undefined>
  ) => void;
}

interface ZFormComponentsProps {
  formProps?: Omit<React.ComponentProps<"form">, "onSubmit">;
  submitProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
  resetProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  withSubmit?: boolean;
  withReset?: boolean;
}
type FieldProps = {
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
export interface ZWrapperProps {
  type: FieldType;
  name: string;
  label: string;
  description: string;
  className?: string;
}
export interface ZFieldProps {
  field: ParsedField;
  path: string[];
  props?: FieldProps;
}
export interface ZFormProps<TSchema extends ZodObjectOrWrapped>
  extends ZFormBaseProps<TSchema>,
    ZFormComponentsProps {
  fieldsProps?: {
    [K in keyof z.infer<TSchema>]?: FieldProps;
  };
}
