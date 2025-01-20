import { z } from "zod";
export interface Country {
  countryCode: string;
  countryName: string;
  countryCallingCode: string;
  flag: string;
  emoji: string;
}
const countryObject = z.object({
  countryCode: z.string(),
  countryName: z.string(),
  countryCallingCode: z.string(),
  flag: z.string().url(),
});

export const countrySelect = (config?: { required_error?: string }) =>
  z.custom<Country>(
    (value) => countryObject.safeParse(value).success,
    config?.required_error || "Invalid country object"
  );
