import { createContext, useContext } from "react";
import { ParsedField, ParsedSchema, ZodObjectOrWrapped } from "./core/types";
import { Config, FieldConfig } from "./types";

import { getDescriptions, getLabel } from "./core/parser";
import { getFieldComponent } from "./components/fields";

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

  const fieldConfig = getFieldConfig();
  const FieldComponent = getFieldComponent(
    field.type,
    fieldConfig.typeOverride
  );
  return { name: path.join("."), FieldComponent, ...fieldConfig };
}
