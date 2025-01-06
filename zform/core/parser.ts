import { DefaultValues } from "react-hook-form";
import { z } from "zod";
import {
  ParsedField,
  inferFieldType,
  ZodObjectOrWrapped,
  ParsedSchema,
} from "./types";

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

function parseField(key: string, schema: z.ZodTypeAny): ParsedField {
  const baseSchema = getBaseSchema(schema);
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

function enhanceZodString(key: string | number, field: z.ZodString) {
  const isOptional = field.isOptional();
  if (!isOptional) {
    // If the field is a string, apply the refinement with the required error for falsy string values
    const message = field._def.errorMap?.(
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: [key],
      },
      { data: undefined, defaultError: "This field is required" }
    ).message;
    return field.refine((val) => !!val, {
      message,
    });
  }
  return field;
}
function enhanceZodObject(
  key: string | number,
  field: z.ZodObject<
    z.ZodRawShape,
    z.UnknownKeysParam,
    z.ZodTypeAny,
    z.ZodTypeAny,
    z.ZodTypeAny
  >
) {
  const isOptional = field.isOptional();
  const enhanced = z.object(createEnhancedSchemaShape(field));
  if (isOptional) {
    const message = field._def.errorMap?.(
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: [key],
      },
      { data: undefined, defaultError: "This field is required" }
    ).message;
    return enhanced.refine((val) => !!val, message);
  }

  return enhanced;
}

function enhanceZodArray(
  key: string | number,
  field: z.ZodArray<z.ZodTypeAny>
) {
  const enhancedElement = enhanceZodField(key, field.element);
  let copy = z.array(enhancedElement);
  // Mapping between _def keys and ZodArray methods
  const checksMap = {
    exactLength: "length",
    minLength: "min",
    maxLength: "max",
  } as const;

  // Dynamically apply the checks
  for (const [checkKey, method] of Object.entries(checksMap)) {
    if (field._def[checkKey as "exactLength" | "maxLength" | "minLength"]) {
      const check =
        field._def[checkKey as "exactLength" | "maxLength" | "minLength"]!;
      copy = copy[method](check.value, check.message);
    }
  }
  return copy;
}

function enhanceZodField(
  key: string | number,
  field: z.ZodTypeAny
): z.ZodTypeAny {
  if (field instanceof z.ZodString) {
    return enhanceZodString(key, field);
  } else if (field instanceof z.ZodObject) {
    return enhanceZodObject(key, field);
  } else if (field instanceof z.ZodArray) {
    return enhanceZodArray(key, field);
  }
  return field; // Leave other types untouched
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
    enhancedShape[key] = enhanceZodField(key, field);
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
