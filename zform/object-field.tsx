import React, { ReactNode } from "react";
import { ZFormField } from "./form-field";
import { getLabel, ParsedField } from "./core/parser";
interface ObjectWrapperProps {
  label: string | ReactNode;
  children: ReactNode;
  field: ParsedField;
}
export const ObjectWrapper: React.FC<ObjectWrapperProps> = ({
  label,
  children,
}) => {
  return (
    <div>
      {label && <h3 className="text-lg font-medium">{label}</h3>}
      <div className="grid gap-2 grid-cols-2">{children}</div>
    </div>
  );
};

export const ObjectField: React.FC<{
  field: ParsedField;
  path: string[];
}> = ({ field, path }) => {
  return (
    <ObjectWrapper label={getLabel(field)} field={field}>
      {Object.entries(field.schema!).map(([, subField]) => (
        <ZFormField
          key={`${path.join(".")}.${subField.key}`}
          field={subField}
          path={[...path, subField.key]}
        />
      ))}
    </ObjectWrapper>
  );
};
