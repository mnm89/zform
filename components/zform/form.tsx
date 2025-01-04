"use client";
import React, { ReactNode, useEffect } from "react";
import {
  useForm,
  DefaultValues,
  UseFormReturn,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { z } from "zod";
import { ZFormProvider } from "./context";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaultValues, parseSchema, ZodObjectOrWrapped } from "./parser";
import { ZFormField } from "./form-field";
import { cn } from "@/lib/utils";

interface ZFormBaseProps {
  schema: ZodObjectOrWrapped;
  defaultValues?: DefaultValues<ZodObjectOrWrapped>;

  onSubmit?: SubmitHandler<z.infer<ZodObjectOrWrapped>>;
  onSubmitError?: SubmitErrorHandler<z.infer<ZodObjectOrWrapped>>;
  onFormInit?: (
    form: UseFormReturn<z.infer<ZodObjectOrWrapped>, unknown, undefined>
  ) => void;
}

interface ZFormComponentsProps {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface ZFormProps extends ZFormBaseProps, ZFormComponentsProps {
  formProps?: Omit<React.ComponentProps<"form">, "onSubmit">;
  withSubmit?: boolean;
  withReset?: boolean;
  submitProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
  resetProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
}
export function ZForm({
  schema,
  defaultValues,
  children,
  onSubmitError = () => {},
  onSubmit = () => {},
  withSubmit = false,
  withReset = false,
  onFormInit = () => {},
  formProps = {},
  submitProps = {},
  resetProps = {},
  header,
  footer,
}: ZFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || getDefaultValues(schema),
  });
  const parsedSchema = parseSchema(schema);
  const { className, ...otherFormProps } = formProps;

  useEffect(() => {
    if (onFormInit) {
      onFormInit(form);
    }
  }, [onFormInit, form]);

  return (
    <Form {...form}>
      <ZFormProvider
        value={{
          schema: parsedSchema,
        }}
      >
        {header}
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
          className={cn("max-w-screen-sm w-full", className)}
          {...otherFormProps}
        >
          {parsedSchema.fields.map((field, index) => (
            <ZFormField
              key={`field-${index}-${field.key}`}
              field={field}
              path={[field.key]}
            />
          ))}

          {children}
          {withReset && (
            <Button
              type="button"
              {...resetProps}
              onClick={() =>
                form.reset(defaultValues || getDefaultValues(schema))
              }
            >
              Reset
            </Button>
          )}
          {withSubmit && (
            <Button type="submit" {...submitProps}>
              Submit
            </Button>
          )}
        </form>
        {footer}
      </ZFormProvider>
    </Form>
  );
}
