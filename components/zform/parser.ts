import { DefaultValues } from "react-hook-form";
import { UnknownKeysParam, z, ZodRawShape, ZodTypeAny } from "zod";
//import { getFieldConfigInZodStack } from "./field-config";

export type ZodObjectOrWrapped<
  T extends ZodRawShape = Record<string, ZodTypeAny>
> =
  | z.ZodObject<T, UnknownKeysParam>
  | z.ZodEffects<z.ZodObject<T, UnknownKeysParam>>;
export interface ParsedField {
  key: string;
  type: string;
  required: boolean;
  default?: unknown;
  description?: string;

  // Field-specific
  options?: [string, string][]; // [value, label] for enums
  schema?: ParsedField[]; // For objects and arrays
}

export interface ParsedSchema {
  fields: ParsedField[];
  schema: ZodObjectOrWrapped;
}

function beautifyLabel(label: string) {
  if (!label) {
    return "";
  }
  let output = label.replace(/_|-/g, " "); // Replace all underscores with spaces (snake_case)
  output = output.replace(/([A-Z])/g, " $1"); // Add spaces before capital letters (camelCase)
  output = output.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word;;

  // Never return a number for the label
  // This primarily important for array fields so we don't get "0" as a label
  if (!isNaN(Number(output))) {
    return "";
  }

  // Ignore labels for arrays of non-objects
  if (output === "*") {
    return "";
  }

  return output;
}
function getDefaultValueInZodStack(schema: z.ZodTypeAny): unknown {
  if (schema instanceof z.ZodDefault) {
    return schema._def.defaultValue();
  }

  if (schema instanceof z.ZodEffects) {
    return getDefaultValueInZodStack(schema.innerType());
  }

  return undefined;
}

function inferFieldType(schema: z.ZodTypeAny): string {
  if (schema instanceof z.ZodObject) return "object";
  if (schema instanceof z.ZodString) return "string";
  if (schema instanceof z.ZodNumber) return "number";
  if (schema instanceof z.ZodBoolean) return "boolean";
  if (schema instanceof z.ZodDate) return "date";
  if (schema instanceof z.ZodEnum) return "select";
  if (schema instanceof z.ZodNativeEnum) return "select";
  if (schema instanceof z.ZodArray) return "array";

  return "string"; // Default to string for unknown types
}
function parseField(key: string, schema: z.ZodTypeAny): ParsedField {
  const baseSchema = getBaseSchema(schema);
  //const fieldConfig = getFieldConfigInZodStack(schema);
  const type = inferFieldType(baseSchema);
  const defaultValue = getDefaultValueInZodStack(schema);

  // Enums
  const options = baseSchema._def.values;
  let optionValues: [string, string][] = [];
  if (options) {
    if (!Array.isArray(options)) {
      optionValues = Object.entries(options);
    } else {
      optionValues = options.map((value) => [value, value]);
    }
  }

  // Arrays and objects
  let subSchema: ParsedField[] = [];
  if (baseSchema instanceof z.ZodObject) {
    subSchema = Object.entries(baseSchema.shape).map(([key, field]) =>
      parseField(key, field as z.ZodTypeAny)
    );
  }
  if (baseSchema instanceof z.ZodArray) {
    subSchema = [parseField("0", baseSchema._def.type)];
  }

  return {
    key,
    type,
    required: !schema.isOptional(),
    default: defaultValue,
    description: baseSchema.description,
    options: optionValues,
    schema: subSchema,
  };
}

function getBaseSchema<
  ChildType extends z.ZodAny | z.ZodTypeAny | z.AnyZodObject = z.ZodAny
>(schema: ChildType | z.ZodEffects<ChildType>): ChildType {
  if ("innerType" in schema._def) {
    return getBaseSchema(schema._def.innerType as ChildType);
  }
  if ("schema" in schema._def) {
    return getBaseSchema(schema._def.schema as ChildType);
  }

  return schema as ChildType;
}
export function getDefaultValues(
  schema: ZodObjectOrWrapped
): DefaultValues<ZodObjectOrWrapped> {
  const objectSchema =
    schema instanceof z.ZodEffects ? schema.innerType() : schema;
  const shape = objectSchema.shape;

  const defaultValues: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(shape)) {
    const defaultValue = getDefaultValueInZodStack(field as z.ZodTypeAny);
    if (defaultValue !== undefined) {
      defaultValues[key] = defaultValue;
    }
  }

  return defaultValues;
}
export function getLabel(field: ParsedField) {
  return beautifyLabel(field.key);
}

export function getDescriptions(field: ParsedField) {
  return field.description;
}
export function parseSchema(schema: ZodObjectOrWrapped): ParsedSchema {
  const objectSchema =
    schema instanceof z.ZodEffects ? schema.innerType() : schema;
  const shape = objectSchema.shape;

  const fields: ParsedField[] = Object.entries(shape).map(([key, field]) =>
    parseField(key, field as z.ZodTypeAny)
  );

  return { fields, schema: createEnhancedSchema(shape) };
}

// Utility function to automatically apply the empty string to undefined transformation
function createEnhancedSchema(
  shape: Record<string, z.ZodTypeAny>
): ZodObjectOrWrapped {
  const enhancedShape: Record<string, z.ZodTypeAny> = {};
  Object.keys(shape).forEach((key) => {
    const field = shape[key];

    // If the field is a string, apply the transformation
    if (field instanceof z.ZodString) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (field._def as any)["required_error"] || "This field is required";
      enhancedShape[key] = field
        .transform((val) => (val === "" ? undefined : val)) // Transform empty string to undefined
        .refine((val) => val !== undefined, { message }); // Required check
    }
  });

  // Return the schema with transformations applied
  return z.object(enhancedShape);
}
