"use client";
import ZForm, { Config } from "@/zform";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  dateOfBirth: z
    .date({ required_error: "Date of birth is required" })
    .refine(
      (date) => date <= new Date(),
      "Date of birth cannot be in the future"
    ),
  subscribeToNewsletter: z.boolean().default(false),
});

const config: Config<typeof newsletterSchema> = {
  email: {
    className: "col-span-2",
  },
  subscribeToNewsletter: {
    typeOverride: "switch",
  },
};

export default function NewsletterForm() {
  return (
    <ZForm
      schema={newsletterSchema}
      onSubmit={(data) => console.log(data)}
      withSubmit
      header={
        <p className="text-2xl text-center font-semibold">
          Newsletter Subscription
        </p>
      }
      submitProps={{
        variant: "default",
        className: "mx-auto col-span-2 max-w-sm w-full",
      }}
      formProps={{
        className: "grid grid-cols-2 gap-2 items-center",
      }}
      config={config}
    />
  );
}
