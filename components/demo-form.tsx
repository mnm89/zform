"use client";
import { ZForm } from "@/zform/form";
import { AlertTriangle } from "lucide-react";
import { z } from "zod";

const mySchema = z.object({
  address: z.string({ required_error: "Please enter your address" }).max(50),
  city: z.string({ required_error: "Please enter your state" }).max(50),
  zip_code: z
    .string({ required_error: "Please enter your postal code" })
    .max(50),
  country: z.string({ required_error: "Please provide your country" }).max(50),
  personal_email: z
    .string({ required_error: "Please provide your personal email" })
    .email(),
});

export default function DemoForm() {
  return (
    <ZForm
      schema={mySchema}
      withSubmit
      withReset
      header={
        <p className="text-2xl text-center font-semibold">
          Correspondence Address
        </p>
      }
      footer={
        <p className="text-muted-foreground flex gap-2">
          <AlertTriangle />
          You confirm all the provided information are real and not fake
        </p>
      }
      resetProps={{ variant: "outline", className: "col-start-1" }}
      submitProps={{ variant: "default" }}
      formProps={{
        className: "grid grid-cols-2 gap-2 items-center",
      }}
      fieldProps={{
        address: {
          className: "col-span-2",
        },
        city: {
          className: "col-span-2",
        },
        zip_code: {
          className: "col-span-1",
        },
        country: {
          className: "col-span-1",
        },
        personal_email: {
          className: "col-span-2",
        },
      }}
    />
  );
}
