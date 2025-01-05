import React from "react";
import { useFormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ParsedField } from "../parser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
export const PasswordField: React.FC<{
  field: ParsedField;
  inputProps?: React.ComponentProps<"input">;
}> = ({ field, inputProps }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register } = useFormContext();

  const { id, name } = useFormField();
  const { key, required } = field;
  const { disabled, ...otherRegistration } = register(name);

  return (
    <div className="relative">
      <Input
        {...inputProps}
        type={showPassword ? "text" : "password"}
        className="hide-password-toggle pr-10"
        key={key}
        required={required}
        id={id}
        disabled={disabled}
        {...otherRegistration}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword && !disabled ? (
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
export const getStringFieldComponent = (typeOverride?: "password") => {
  if (typeOverride === "password") return PasswordField;
  return StringField;
};
