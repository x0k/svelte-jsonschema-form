import type { $ZodType, $ZodTypes } from "zod/v4/core";

export interface SchemaRegistry {
  get(id: string): $ZodTypes | undefined;
}

export type AugmentedSchemaFactory = (
  schema: $ZodType
) => $ZodTypes | undefined;

export type ConditionSchemaFactory = (
  key: string,
  propSchema: $ZodTypes
) => $ZodTypes;
