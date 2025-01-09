import { Button } from "@/components/ui/button";
import { ComponentType, ReactNode } from "react";
import { DefaultValues, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CalendarProps } from "@/components/ui/calendar";
import { FieldType, ParsedField, ZodObjectOrWrapped } from "./core/types";
import { SelectProps } from "@radix-ui/react-select";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { SwitchProps } from "@radix-ui/react-switch";

interface ZFormBaseProps<TSchema extends ZodObjectOrWrapped> {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit?: (
    data: z.infer<TSchema>,
    form: UseFormReturn<z.infer<TSchema>, unknown, undefined>
  ) => void | Promise<void>;
  className?: string;
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
  // array item
  itemClassName?: string;
};
export type TypeOverride =
  | "password"
  | "textarea"
  | "stepper"
  | "switch"
  | "date-range"
  | "file"
  | "image-preview";
export type FieldConfig = BaseFieldConfig & {
  inputProps?: React.ComponentProps<"input">;
  typeOverride?: TypeOverride;
  textareaProps?: React.ComponentProps<"textarea">;
  calendarProps?: CalendarProps;
  selectProps?: SelectProps;
  checkboxProps?: CheckboxProps;
  switchProps?: SwitchProps;
  imagePreview?: ComponentType<{ src?: string }>;
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
};
export type Config<T> = T extends z.ZodEffects<infer Inner>
  ? Config<Inner>
  : T extends z.ZodObject<infer Shape>
  ? {
      [K in keyof Shape]?: Config<Shape[K]> | FieldConfig;
    }
  : T extends z.ZodArray<infer Element>
  ? Config<Element> | FieldConfig
  : FieldConfig;

export interface ZFormProps<TSchema extends ZodObjectOrWrapped>
  extends ZFormBaseProps<TSchema>,
    ZFormComponentsProps {
  config?: Config<TSchema> | object;
}
