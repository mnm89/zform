import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
export interface PhoneNumber {
  formatted: string;
  value: string;
  phoneCode: string;
}
const phoneObject = z.object({
  formatted: z.string(),
  value: z.string(),
  phoneCode: z.string(),
});

export const phoneNumber = (config?: { required_error?: string }) =>
  z
    .custom<PhoneNumber>(
      (value) => phoneObject.safeParse(value).success,
      config?.required_error || "Invalid phone object"
    )
    .refine((val) => {
      return isValidPhoneNumber(val.formatted);
    }, "Invalid phone number");
