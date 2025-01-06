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

type BaseFieldConfig = {
  labelOverride?: string;
  descriptionOverride?: string;
  className?: string;
};

type FieldConfig = BaseFieldConfig & {
  item?: { className?: string; config?: FieldConfig };
  inputProps?: React.ComponentProps<"input">;
  typeOverride?:
    | "password"
    | "textarea"
    | "autocomplete"
    | "stepper"
    | "switch"
    | "range";
  textareaProps?: React.ComponentProps<"textarea">;
  calendarProps?: CalendarProps;
};
export interface ZWrapperProps {
  type: FieldType;
  name: string;
  label: string;
  description: string;
  className?: string;
}

export type ZFieldProps<T = FieldType> = {
  field: ParsedField<T>;
  path: string[];
  config?: FieldConfig;
};

export interface ZFormProps<TSchema extends ZodObjectOrWrapped>
  extends ZFormBaseProps<TSchema>,
    ZFormComponentsProps {
  fieldsConfig?: {
    [K in keyof z.infer<TSchema>]?: FieldConfig;
  };
}
