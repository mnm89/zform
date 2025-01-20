import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { ParsedField } from "../../core/types";
import { ZField } from "../../field";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useZField } from "../../context";

export const ArrayField: React.FC<{
  field: ParsedField;
  path: string[];
}> = ({ field, path }) => {
  const { className, fieldLabel, fieldDescription, name, itemClassName } =
    useZField(field, path);
  const { control, getFieldState } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const defaultValue = field.schema?.[0].default;
  const { error } = getFieldState(name);
  const errorMessage = error?.message || error?.root?.message;

  return (
    <fieldset className={className}>
      <legend className="p-2 flex justify-between gap-2">
        <div>
          <p className="font-semibold ">{fieldLabel} </p>
          <p className="text-sm text-muted-foreground">{fieldDescription}</p>
          {errorMessage && (
            <p className="text-sm font-medium text-destructive">
              {errorMessage}
            </p>
          )}
        </div>

        <Button
          onClick={() => append(defaultValue)}
          variant="outline"
          size="sm"
          type="button"
          className=""
        >
          <PlusIcon className="size-4" />
          Add
        </Button>
      </legend>

      {fields.map(({ id }, index) => (
        <div key={id} className={cn("relative p-2", itemClassName)}>
          <Button
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            type="button"
            className="absolute -top-2 -right-2"
          >
            <TrashIcon className="size-4 text-destructive" />
          </Button>
          <ZField
            field={field.schema![0]!}
            path={[...path, index.toString()]}
          />
        </div>
      ))}
    </fieldset>
  );
};
