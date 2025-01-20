import { useFormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useZField } from "../../context";
import { ParsedField } from "../../core/types";
import { ZFieldProps } from "../../types";
import { Input } from "@/components/ui/input";

function useCustomField(field: ParsedField) {
  const { register } = useFormContext();
  const { id, name } = useFormField();
  const { key, required } = field;
  return { key, required, id, ...register(name) };
}

export const CustomField: React.FC<ZFieldProps> = ({ field, path }) => {
  const { key, ...other } = useCustomField(field);
  const { inputProps } = useZField(field, path);
  return <Input key={key} {...other} {...inputProps} />;
};
