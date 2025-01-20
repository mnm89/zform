# ZForm Documentation

## Overview

`ZForm` is a dynamic form generation library based on shadcn components that utilizes `Zod` schemas to automatically create and manage forms. Built on `react-hook-form`, it allows for extensive customization of form fields, layouts, and behaviors

[View Demo](https://mnm-zform.vercel.app/)

### Key Features

- Dynamically renders forms based on Zod schemas.
- Fully type-safe integration with `react-hook-form`.
- Customizable field styles and components.
- Built-in support for headers, footers, and button configurations.
- Supports advanced validation and default values.

---

## Installation

Using shadcn CLI:

```bash
npx shadcn add https://raw.githubusercontent.com/mnm89/zform/refs/heads/main/setup.json
```

---

## Getting Started

Here’s a minimal example to help you get started:

```tsx
import { ZForm } from "@zform/core";
import { z } from "zod";

const schema = z.object({
  name: z.string({required_error: "Name is required"}),
  age: z.number().min(0, "Age must be a positive number"),
});

export default function App() {
  return (
    <ZForm
      schema={schema}
      defaultValues={{ name: "", age: 0 }}
      withSubmit
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

---

## Props

```ts
// types.ts

interface ZFormBaseProps<TSchema extends ZodObjectOrWrapped> {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  onSubmit?: (
    data: z.infer<TSchema>,
    form: UseFormReturn<z.infer<TSchema>, unknown, undefined>
  ) => void | Promise<void>;
  className?: string;
  onFormInit?: (
    form: UseFormReturn<z.infer<TSchema>, unknown, undefined>
  ) => void;
}

interface ZFormComponentsProps {
  formProps?: Omit<React.ComponentProps<"form">, "onSubmit">;
  submitProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
  resetProps?: Omit<React.ComponentProps<typeof Button>, "type" | "asChild">;
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  withSubmit?: boolean;
  withReset?: boolean;
}

...

export interface ZFormProps<TSchema extends ZodObjectOrWrapped>
  extends ZFormBaseProps<TSchema>,
    ZFormComponentsProps {
  config?: Config<TSchema> | object;
}
```

## Examples

### Example: Basic Form

```tsx
import { ZForm } from "@zform/core";
import { z } from "zod";

const basicSchema = z.object({
  username: z.string({required_error: "Username is required"}),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function BasicForm() {
  return (
    <ZForm
      schema={basicSchema}
      defaultValues={{ username: "", password: "" }}
      withSubmit
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

---

### Example: Custom Styling

```tsx
import { ZForm } from "@zform/core";
import { z } from "zod";

const styledSchema = z.object({
  firstName: z.string({required_error: "First name is required"}),
  lastName: z.string({required_error: "Last name is required"}),
});

export default function StyledForm() {
  return (
    <ZForm
      schema={styledSchema}
      config={{
        firstName: { className: "bg-gray-200 p-2 rounded" },
        lastName: { className: "bg-blue-200 p-2 rounded" },
      }}
      withSubmit
      submitProps={{ className: "bg-green-500 text-white p-2" }}
      defaultValues={{ firstName: "", lastName: "" }}
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

## FAQ

### How do I add custom components?

Todo

### How do I handle async validations?

Todo

### How do I style the form?

Provide custom class names via `className` for the zform main wrapper, `formProps.className` for the actual form and `config.<field name>.className` for individual fields.

---

## Contributing

We welcome contributions! Feel free to:

- Report issues or suggest features by opening an issue on GitHub.
- Submit pull requests for new features or bug fixes.

---

## Demo

Explore live demos and examples on [View Demo](https://mnm-zform.vercel.app/examples).
