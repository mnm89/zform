"use client";
import ZForm from "@/zform";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  dateOfBirth: z
    .date({ required_error: "Date of birth is required" })
    .refine(
      (date) => date <= new Date(),
      "Date of birth cannot be in the future"
    ),
  subscribeToNewsletter: z.boolean().default(false),
});

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
      }}
      formProps={{
        className: "grid grid-cols-2 gap-2 items-center",
      }}
      fieldsProps={{
        email: {
          itemClassName: "col-span-2",
        },
        subscribeToNewsletter: {
          typeOverride: "switch",
        },
      }}
    />
  );
}
