"use client";
import React, { ReactNode, useEffect } from "react";
import {
  useForm,
  DefaultValues,
  UseFormReturn,
  SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import { ZFormProvider } from "./context";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaultValues, parseSchema, ZodObjectOrWrapped } from "./parser";
import { FieldProps, ZFormField } from "./form-field";

interface ZFormBaseProps<TSchema extends ZodObjectOrWrapped> {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit?: SubmitHandler<z.infer<TSchema>>;
  onFormInit?: (
    form: UseFormReturn<z.infer<TSchema>, unknown, undefined>
  ) => void;
}

interface ZFormComponentsProps {
  formProps?: Omit<React.ComponentProps<"form">, "onSubmit">;
  submitProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
  resetProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  withSubmit?: boolean;
  withReset?: boolean;
}

export interface ZFormProps<TSchema extends ZodObjectOrWrapped>
  extends ZFormBaseProps<TSchema>,
    ZFormComponentsProps {
  fieldsProps?: {
    [K in keyof z.infer<TSchema>]?: FieldProps;
  };
}
export function ZForm<TSchema extends ZodObjectOrWrapped>({
  schema: inputSchema,
  defaultValues,
  children,
  onSubmit = () => {},
  withSubmit = false,
  withReset = false,
  onFormInit = () => {},
  formProps = {},
  fieldsProps = {},
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
        }}
      >
        <div className="flex flex-col gap-4 max-w-screen-sm w-full">
          {header}
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            {...formProps}
          >
            {fields.map((field, index) => (
              <ZFormField
                key={`field-${index}-${field.key}`}
                field={field}
                path={[field.key]}
                props={fieldsProps?.[field.key]}
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
