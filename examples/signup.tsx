"use client";
import ZForm from "@/components/zform";
import Link from "next/link";
import { z } from "zod";

const mySchema = z
  .object({
    first_name: z
      .string({ required_error: "Please enter your given name" })
      .max(50),
    last_name: z
      .string({ required_error: "Please enter your last name" })
      .max(50),
    email: z
      .string({ required_error: "Please provide your personal email" })
      .email(),
    password: z
      .string({ required_error: "Please choose a password" })
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export default function SignUpForm() {
  return (
    <ZForm
      schema={mySchema}
      withSubmit
      header={
        <p className="text-2xl text-center font-semibold">
          Sign Up To Your Account
        </p>
      }
      footer={
        <p className="text-muted-foreground items-center justify-center flex gap-2">
          Already a customer?
          <Link className="text-foreground underline" href="/#">
            Login
          </Link>
        </p>
      }
      submitProps={{
        variant: "default",
        className: "mx-auto col-span-2 max-w-sm w-full",
      }}
      formProps={{
        className: "grid grid-cols-2 gap-2 items-center",
      }}
      fieldProps={{
        first_name: {
          className: "col-span-1",
        },
        last_name: {
          className: "col-span-1",
        },
        email: {
          className: "col-span-2",
        },
        password: {
          className: "col-span-1",
        },
        confirm_password: {
          className: "col-span-1",
        },
      }}
    />
  );
}
