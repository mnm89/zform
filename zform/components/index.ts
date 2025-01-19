import { ComponentType } from "react";
import { TypeOverride, ZFieldProps } from "../types";
import { NumberField, StepperField } from "./number-field";
import { PasswordField, TextareaField, TextField } from "./string-field";
import { SelectField } from "./select-field";
import { FieldType } from "../core/types";
import { DateField, DateRangeField } from "./date-field";
import { ArrayField } from "./array-field";
import { ObjectField } from "./object-field";
import { CheckboxField, SwitchField } from "./boolean-field";
import { CustomField } from "./custom-field";
import { ImagePreviewField } from "./file-field";
import { CountryField } from "./country-field";

type KeyType = TypeOverride | "default";

type PartialRecord<K extends string, T> = {
  [P in K]?: T;
};
const TYPE_COMPONENTS_MAP: Record<
  FieldType,
  PartialRecord<KeyType, ComponentType<ZFieldProps>>
> = {
  string: {
    default: TextField,
    password: PasswordField,
    textarea: TextareaField,
  },
  number: {
    default: NumberField,
    stepper: StepperField,
  },
  boolean: {
    default: CheckboxField,
    switch: SwitchField,
  },
  select: {
    default: SelectField,
  },
  date: {
    default: DateField,
  },
  array: {
    default: ArrayField,
  },
  object: { default: ObjectField },
  custom: {
    default: CustomField,
    "date-range": DateRangeField,
    "image-preview": ImagePreviewField,
    "country-select": CountryField,
  },
};

export function getFieldComponent(
  nativeType: FieldType,
  customType?: TypeOverride
) {
  return TYPE_COMPONENTS_MAP[nativeType][customType || "default"];
}
