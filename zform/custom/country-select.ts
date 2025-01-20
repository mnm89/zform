import { z } from "zod";
export interface Country {
  countryCode: string;
  countryName: string;
}
const countryObject = z.object({
  countryCode: z.string(),
  countryName: z.string(),
});

export const countrySelect = (config?: { required_error?: string }) =>
  z.custom<Country>(
    (value) => countryObject.safeParse(value).success,
    config?.required_error || "Invalid country object"
  );
