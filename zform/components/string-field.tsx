import React from "react";
import { useFormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ParsedField } from "../core/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ZFieldProps } from "../types";
import { useZField } from "../context";

function useStringField(field: ParsedField) {
  const { register } = useFormContext();
  const { id, name } = useFormField();
  const { type, key, required } = field;
  return { type, key, required, id, ...register(name) };
}

export const TextField: React.FC<ZFieldProps> = ({ field, path }) => {
  const { key, ...other } = useStringField(field);
  const { inputProps } = useZField(field, path);
  return <Input key={key} {...other} {...inputProps} />;
};

export const TextareaField: React.FC<ZFieldProps> = ({ field, path }) => {
  const { key, ...other } = useStringField(field);
  const { textareaProps } = useZField(field, path);
  return <Textarea key={key} rows={4} {...other} {...textareaProps} />;
};
export const PasswordField: React.FC<ZFieldProps> = ({ field, path }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { key, ...other } = useStringField(field);
  const { inputProps } = useZField(field, path);

  return (
    <div className="relative">
      <Input
        key={key}
        className="hide-password-toggle pr-10"
        {...other}
        type={showPassword ? "text" : "password"}
        {...inputProps}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword && !other.disabled ? (
          <EyeIcon className="size-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      {/* hides browsers password toggles */}
      <style>
        {`
            .hide-password-toggle::-ms-reveal,
            .hide-password-toggle::-ms-clear {
                visibility: hidden;
                pointer-events: none;
                display: none;
            }
        `}
      </style>
    </div>
  );
};
export const getStringFieldComponent = (
  typeOverride?: "password" | "textarea"
) => {
  if (typeOverride === "password") return PasswordField;
  if (typeOverride === "textarea") return TextareaField;
  return TextField;
};
