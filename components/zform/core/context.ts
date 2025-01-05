import { createContext, useContext } from "react";
import { ParsedSchema } from "./parser";

export type ZContextType = ParsedSchema;
const ZFormContext = createContext<ZContextType | null>(null);

export const ZFormProvider = ZFormContext.Provider;

export function useZForm() {
  const context = useContext(ZFormContext);
  if (!context) {
    throw new Error("useZForm must be used within an ZFormProvider");
  }
  return context;
}
