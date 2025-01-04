import { useFormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ParsedField } from "../parser";
import { Input } from "@/components/ui/input";

export const StringField: React.FC<{
  field: ParsedField;
  inputProps?: React.ComponentProps<"input">;
}> = ({ field, inputProps }) => {
  const { register } = useFormContext();
  const { id, name } = useFormField();
  const { type, key, required } = field;

  return (
    <Input
      {...inputProps}
      key={key}
      type={type}
      required={required}
      id={id}
      {...register(name)}
    />
  );
};
