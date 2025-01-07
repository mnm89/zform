"use client";
import ZForm, { Config } from "@/zform";
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
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const config: Config<typeof mySchema> = {
  email: {
    className: "col-span-2",
  },
  password: {
    typeOverride: "password",
    inputProps: { autoComplete: "new-password" },
  },
  confirm_password: {
    typeOverride: "password",
    inputProps: { autoComplete: "new-password" },
  },
};

export default function SignUpForm() {
  return (
    <ZForm
      schema={mySchema}
      onSubmit={(data) => console.log(data)}
      withSubmit
      header={
        <p className="text-2xl text-center font-semibold">
          Create Your Account
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
      config={config}
    />
  );
}
