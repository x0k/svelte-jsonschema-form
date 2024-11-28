import type { ZodSchema } from "zod";
import type { Schema, UiSchemaRoot } from "@sjsf/form";

import { Validator } from "./validator.js";

export interface ValidatorOptions {
  schema: ZodSchema;
  rootSchema: Schema;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
}

export function createValidator({
  rootSchema,
  schema,
  idPrefix,
  idSeparator,
  uiSchema,
}: ValidatorOptions) {
  return new Validator(schema, rootSchema, uiSchema, idPrefix, idSeparator);
}
