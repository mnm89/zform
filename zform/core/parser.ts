import { DefaultValues } from "react-hook-form";
import { UnknownKeysParam, z, ZodRawShape, ZodTypeAny } from "zod";
//import { getFieldConfigInZodStack } from "./field-config";

export type ZodObjectOrWrapped<
  T extends ZodRawShape = Record<string, ZodTypeAny>
> =
  | z.ZodObject<T, UnknownKeysParam>
  | z.ZodEffects<z.ZodObject<T, UnknownKeysParam>>;

export type FieldType = ReturnType<typeof inferFieldType>;
export interface ParsedField {
  key: string;
  type: FieldType;
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
function inferFieldType(schema: z.ZodTypeAny) {
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
  let options: [string, string][] = [];

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
  if (baseSchema instanceof z.ZodNativeEnum) {
    options = Object.values<string>(baseSchema._def.values).map((v) => [
      v,
      beautifyLabel(v),
    ]);
  }
  if (baseSchema instanceof z.ZodEnum) {
    options = (baseSchema._def.values as string[]).map((v) => [
      v,
      beautifyLabel(v),
    ]);
  }
  return {
    key,
    type,
    required: !schema.isOptional(),
    default: defaultValue,
    description: baseSchema.description,
    schema: subSchema,
    options,
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

function createEnhancedSchemaShape(
  schema: ZodObjectOrWrapped
): Record<string, z.ZodTypeAny> {
  const objectSchema =
    schema instanceof z.ZodEffects ? schema.innerType() : schema;
  const shape = objectSchema.shape;
  const enhancedShape: Record<string, z.ZodTypeAny> = {};

  Object.keys(shape).forEach((key) => {
    const field = shape[key];
    const isOptional = field.isOptional();
    // If the field is a string, apply the transformation
    if (field instanceof z.ZodString) {
      // we apply the transformation on a string field
      // to force the validation against the required_error
      enhancedShape[key] = field.transform((val) =>
        val === "" ? undefined : val
      );

      if (!isOptional) {
        const message =
          "required_error" in field._def
            ? (field._def.required_error as string)
            : "This field is required";
        enhancedShape[key] = enhancedShape[key].refine(
          (val) => val !== undefined,
          { message }
        ) as z.ZodTypeAny;
      }
    } else {
      enhancedShape[key] = field; // Leave other types untouched
    }
  });
  return enhancedShape;
}
export function parseSchema(schema: ZodObjectOrWrapped): ParsedSchema {
  const shape = createEnhancedSchemaShape(schema);

  const fields: ParsedField[] = Object.entries(shape).map(([key, field]) =>
    parseField(key, field as z.ZodTypeAny)
  );

  return { fields, schema: z.object(shape) };
}
