import { createContext, useContext } from "react";
import { ParsedField, ParsedSchema, ZodObjectOrWrapped } from "./core/types";
import { Config, FieldConfig } from "./types";

import { getDescriptions, getLabel } from "./core/parser";
import { getBooleanFieldComponent } from "./components/boolean-field";
import { getSelectFieldComponent } from "./components/select-field";
import { getDateFieldComponent } from "./components/date-field";
import { getNumberFieldComponent } from "./components/number-field";
import { getStringFieldComponent } from "./components/string-field";
import { getArrayFieldComponent } from "./components/array-field";
import { getObjectFieldComponent } from "./components/object-field";

export type ZContextType<
  TSchema extends ZodObjectOrWrapped = ZodObjectOrWrapped
> = ParsedSchema & {
  config: Config<TSchema>;
};
const ZFormContext = createContext<ZContextType | null>(null);

export const ZFormProvider = ZFormContext.Provider;

export function useZForm() {
  const context = useContext(ZFormContext);
  if (!context) {
    throw new Error("useZForm must be used within an ZFormProvider");
  }

  return context;
}
export function useZField(field: ParsedField, path: string[]) {
  const { config } = useZForm();

  function getFieldConfig(): FieldConfig & {
    fieldLabel: string;
    fieldDescription?: string;
  } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentConfig: any = config;

    // Traverse the config based on the path
    for (const segment of path) {
      if (!currentConfig) break;

      // Handle array indices by generalizing to the array level
      if (Number.isInteger(Number(segment))) {
        // If the current segment is an index, move up to the array level
        if ("*" in currentConfig) {
          currentConfig = currentConfig["*"];
        }
        continue; // Skip numeric indices
      }

      // Move to the next nested configuration
      currentConfig = currentConfig[segment];
    }
    // Extract overrides if the resolved configuration exists
    if (currentConfig) {
      const { labelOverride, descriptionOverride, ...other } = currentConfig;
      return {
        fieldLabel: labelOverride || getLabel(field),
        fieldDescription: descriptionOverride || getDescriptions(field),
        ...other,
      };
    }

    return {
      fieldLabel: getLabel(field),
      fieldDescription: getDescriptions(field),
    };
  }

  const getFieldComponent = (typeOverride?: string) => {
    switch (field.type) {
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
      case "array":
        return getArrayFieldComponent(typeOverride as "badges");
      case "object":
        return getObjectFieldComponent(typeOverride as "accordion");
      default:
        return null;
    }
  };
  const fieldConfig = getFieldConfig();
  const FieldComponent = getFieldComponent(fieldConfig.typeOverride);
  return { name: path.join("."), FieldComponent, ...fieldConfig };
}
