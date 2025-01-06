import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { ParsedField } from "../core/types";
import { ZField } from "../field";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";

export const ArrayField: React.FC<{
  field: ParsedField;
  path: string[];
  className?: string;
  label?: string;
  description?: string;
}> = ({ field, path, className, description, label }) => {
  const { control, getFieldState } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: path.join("."),
  });

  const defaultValue = field.schema?.[0].default;
  const { error } = getFieldState(path.join("."));
  const errorMessage = error?.message || error?.root?.message;

  return (
    <fieldset className={className}>
      <legend className="p-2 flex justify-between gap-2">
        <div>
          <p className="font-semibold ">{label} </p>
          <p className="text-sm text-muted-foreground">{description}</p>
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

      {fields.map((item, index) => (
        <div key={item.id} className="relative p-2">
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
