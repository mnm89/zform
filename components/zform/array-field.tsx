import React, { ReactNode } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {} from "./context";
import { getLabel, ParsedField } from "./parser";
import { ZFormField } from "./form-field";
import { Button } from "../ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";

export interface ArrayWrapperProps {
  label: string | ReactNode;
  children: ReactNode;
  field: ParsedField;
  onAddItem: () => void;
}
export const ArrayWrapper: React.FC<ArrayWrapperProps> = ({
  children,
  onAddItem,
}) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {children}

      <Button
        onClick={onAddItem}
        variant="outline"
        size="sm"
        type="button"
        className="ml-auto flex w-fit gap-2"
      >
        <PlusIcon className="size-4" />
        Add
      </Button>
    </div>
  );
};

export interface ArrayElementWrapperProps {
  children: ReactNode;
  onRemove: () => void;
  index: number;
}
export const ArrayElementWrapper: React.FC<ArrayElementWrapperProps> = ({
  children,
  onRemove,
  index,
}) => {
  return (
    <div className="flex w-full flex-col gap-2 border p-1" key={index}>
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="ml-auto w-fit"
        type="button"
      >
        <TrashIcon className="size-4 text-destructive" />
      </Button>

      {children}
    </div>
  );
};

export const ArrayField: React.FC<{
  field: ParsedField;
  path: string[];
}> = ({ field, path }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: path.join("."),
  });

  const subFieldType = field.schema?.[0]?.type;
  const defaultValue =
    subFieldType === "object" ? {} : subFieldType === "array" ? [] : null;

  return (
    <ArrayWrapper
      label={getLabel(field)}
      field={field}
      onAddItem={() => append(defaultValue)}
    >
      {fields.map((item, index) => (
        <ArrayElementWrapper
          key={item.id}
          onRemove={() => remove(index)}
          index={index}
        >
          <ZFormField
            field={field.schema![0]!}
            path={[...path, index.toString()]}
          />
        </ArrayElementWrapper>
      ))}
    </ArrayWrapper>
  );
};
