import React from "react";
import { ZField } from "../field";
import { ParsedField } from "../core/types";
import { useZField } from "../context";

export const ObjectField: React.FC<{
  field: ParsedField;
  path: string[];
}> = ({ field, path }) => {
  const { className, fieldLabel, fieldDescription } = useZField(field, path);
  return (
    <fieldset className={className}>
      <legend className="p-2">
        <p className="font-semibold">{fieldLabel}</p>
        <p className="text-sm text-muted-foreground">{fieldDescription}</p>
      </legend>
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
