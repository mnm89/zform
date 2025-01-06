import React from "react";
import { ZField } from "../field";
import { ParsedField } from "../core/types";

export const ObjectField: React.FC<{
  field: ParsedField;
  path: string[];
  className?: string;
  label?: string;
}> = ({ field, path, className, label }) => {
  return (
    <fieldset className={className}>
      <legend className="p-2 font-semibold">{label}</legend>
      {Object.entries(field.schema!).map(([, subField]) => (
        <ZField
          key={`${path.join(".")}.${subField.key}`}
          field={subField}
          path={[...path, subField.key]}
        />
      ))}
    </fieldset>
  );
};
