import { ZodRawShape, ZodTypeAny, z, UnknownKeysParam } from "zod";

export type ZodObjectOrWrapped<
  T extends ZodRawShape = Record<string, ZodTypeAny>
> =
  | z.ZodObject<T, UnknownKeysParam>
  | z.ZodEffects<z.ZodObject<T, UnknownKeysParam>>;

export type FieldType = ReturnType<typeof inferFieldType>;
export interface ParsedField<T = FieldType> {
  key: string;
  type: T;
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

export function inferFieldType(schema: z.ZodTypeAny) {
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
