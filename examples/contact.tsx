"use client";
import ZForm, { Config } from "@/zform";
import { z } from "zod";

enum Subject {
  GeneralInquiry = "General Inquiry",
  Support = "Support",
  Feedback = "Feedback",
  Sales = "Sales",
}

const contactSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .max(100, "Name is too long"),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || /^\+?\d{10,15}$/.test(phone),
      "Invalid phone number format"
    ),
  email: z.string().email("Invalid email address"),
  subject: z.nativeEnum(Subject).optional(),
  message: z
    .string({ required_error: "Message is required" })
    .max(1000, "Message is too long"),
  consent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, "You must agree to proceed"),
});
const config: Config<typeof contactSchema> = {
  email: {
    className: "col-span-2",
  },
  message: {
    className: "col-span-2",
    typeOverride: "textarea",
  },
  consent: {
    className: "col-span-2",
    labelOverride: "Accept terms and conditions",
    descriptionOverride:
      "You agree to our Terms of Service and Privacy Policy.",
  },
};
export default function ContactForm() {
  return (
    <ZForm
      schema={contactSchema}
      onSubmit={(data) => console.log(data)}
      withSubmit
      withReset
      header={<p className="text-2xl text-center font-semibold">Contact Us</p>}
      submitProps={{
        variant: "default",
      }}
      resetProps={{
        variant: "outline",
      }}
      formProps={{
        className: "grid grid-cols-2 gap-2 items-center",
        noValidate: true,
      }}
      config={config}
    />
  );
}
