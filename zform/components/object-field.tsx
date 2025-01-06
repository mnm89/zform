import React from "react";
import { ZField } from "../field";
import { ParsedField } from "../core/parser";

export const ObjectField: React.FC<{
  field: ParsedField;
  path: string[];
}> = ({ field, path }) => {
  return Object.entries(field.schema!).map(([, subField]) => (
    <ZField
      key={`${path.join(".")}.${subField.key}`}
      field={subField}
      path={[...path, subField.key]}
    />
  ));
};
