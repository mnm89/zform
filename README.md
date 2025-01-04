# ZForm Documentation

## Overview

`ZForm` is a dynamic form generation library that utilizes `Zod` schemas to automatically create and manage forms. Built on `react-hook-form`, it allows for extensive customization of form fields, layouts, and behaviors.

### Key Features

- Dynamically renders forms based on Zod schemas.
- Fully type-safe integration with `react-hook-form`.
- Customizable field styles and components.
- Built-in support for headers, footers, and button configurations.
- Supports advanced validation and default values.

---

## Installation

To get started, install `@zform/core` along with its dependencies:

```bash
npm install @zform/core zod react-hook-form @hookform/resolvers
```

---

## Getting Started

Here’s a minimal example to help you get started:

```tsx
import { ZForm } from "@zform/core";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
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

| Prop             | Type                                                                                       | Default    | Description                                                                                             |
|------------------|--------------------------------------------------------------------------------------------|------------|---------------------------------------------------------------------------------------------------------|
| `schema`         | `ZodObject`                                                                               | Required   | Zod schema defining the form structure.                                                                |
| `defaultValues`  | `DefaultValues<z.infer<TSchema>>`                                                         | `{}`       | Predefined values for form fields.                                                                     |
| `onSubmit`       | `(data: z.infer<TSchema>) => void`                                                        | `undefined`| Callback executed when the form is successfully submitted.                                              |
| `fieldProps`     | `{ [key: string]: { className?: string; } }`                                              | `{}`       | Custom class names for individual fields.                                                              |
| `formProps`      | `Omit<React.ComponentProps<"form">, "onSubmit">`                                          | `{}`       | Additional props for the `<form>` element.                                                             |
| `withSubmit`     | `boolean`                                                                                 | `false`    | Whether to include a submit button in the form.                                                        |
| `withReset`      | `boolean`                                                                                 | `false`    | Whether to include a reset button in the form.                                                         |

---

## Examples

### Example: Basic Form

```tsx
import { ZForm } from "@zform/core";
import { z } from "zod";

const basicSchema = z.object({
  username: z.string().min(1, "Username is required"),
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
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export default function StyledForm() {
  return (
    <ZForm
      schema={styledSchema}
      fieldProps={{
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

---

### Example: Dynamic Fields

```tsx
import { ZForm } from "@zform/core";
import { z } from "zod";

const dynamicSchema = z.object({
  email: z.string().email("Invalid email"),
  agreeToTerms: z.boolean().refine((val) => val, "You must agree to terms"),
});

export default function DynamicForm() {
  return (
    <ZForm
      schema={dynamicSchema}
      defaultValues={{ email: "", agreeToTerms: false }}
      withSubmit
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

---

## FAQ

### How do I add custom components?

Integrate custom components for specific fields by customizing the `fieldProps` or extending the `ZForm` component.

### How do I handle async validations?

Use Zod’s `.superRefine` method to handle complex, async validations.

### How do I style the form?

Provide custom class names via `fieldProps` and `formProps` for individual fields and the entire form.

---

## Contributing

We welcome contributions! Feel free to:

- Report issues or suggest features by opening an issue on GitHub.
- Submit pull requests for new features or bug fixes.

---

## Demo

Explore live demos and examples on [CodeSandbox](https://codesandbox.io/) or a hosted site (link to be added).
