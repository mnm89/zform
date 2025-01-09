"use client";
import React, { useEffect } from "react";
import { useForm, DefaultValues } from "react-hook-form";
import { z } from "zod";
import { ZFormProvider } from "./context";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaultValues, parseSchema } from "./core/parser";
import { ZField } from "./field";
import { ZFormProps } from "./types";
import { ZodObjectOrWrapped } from "./core/types";
import { cn } from "@/lib/utils";

export function ZForm<TSchema extends ZodObjectOrWrapped>({
  schema: inputSchema,
  defaultValues,
  className,
  children,
  onSubmit = () => {},
  withSubmit = false,
  withReset = false,
  onFormInit = () => {},
  formProps = {},
  config = {},
  submitProps = {},
  resetProps = {},
  header,
  footer,
}: ZFormProps<TSchema>) {
  const { fields, schema } = parseSchema(inputSchema);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:
      defaultValues ||
      (getDefaultValues(schema) as DefaultValues<z.infer<TSchema>>),
  });

  useEffect(() => {
    if (onFormInit) {
      onFormInit(form);
    }
  }, [onFormInit, form]);

  return (
    <Form {...form}>
      <ZFormProvider
        value={{
          fields,
          schema,
          config,
        }}
      >
        <div className={cn("flex flex-col max-w-screen-sm gap-4", className)}>
          {header}
          {form.formState.errors.root?.message && (
            <p className="text-[0.8rem] font-medium text-destructive my-1">
              {form.formState.errors.root.message}
            </p>
          )}
          <form
            onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
            {...formProps}
          >
            {fields.map((field, index) => (
              <ZField
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
        </div>
      </ZFormProvider>
    </Form>
  );
}
