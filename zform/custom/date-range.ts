import { z } from "zod";

export type DateRange = {
  from: Date;
  to: Date | undefined;
};
const rangeObject = z.object({
  from: z.date(),
  to: z.date().optional(),
});
export const dateRange = (config?: { required_error?: string }) =>
  z
    .custom<DateRange>(
      (value) => rangeObject.safeParse(value).success,
      config?.required_error || "Invalid range object"
    )
    .refine(({ from, to }) => {
      if (to && to.getTime() <= from.getTime()) return false;
      return true;
    }, "The end date must be later than the start date.");
