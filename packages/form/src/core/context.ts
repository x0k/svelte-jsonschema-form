import { CORE_MERGER, CORE_ROOT_SCHEMA, CORE_VALIDATOR } from "./internals.js";
import type { Merger } from "./merger.js";
import type { Schema, SchemaDefinition, SchemaValue } from "./schema.js";
import type { Validator } from "./validator.js";

/**
 * The dependencies shared by the core schema helpers.
 *
 * The fields are symbols so a `FormState` can implement the interface without
 * exposing them as public properties.
 */
export interface CoreContext {
  readonly [CORE_VALIDATOR]: Validator;
  readonly [CORE_MERGER]: Merger;
  readonly [CORE_ROOT_SCHEMA]: Schema;
}

export interface CreateCoreContextOptions {
  rootSchema: Schema;
  validator: Validator;
  merger: Merger;
}

export function createCoreContext({
  validator,
  merger,
  rootSchema,
}: CreateCoreContextOptions): CoreContext {
  return {
    [CORE_VALIDATOR]: validator,
    [CORE_MERGER]: merger,
    [CORE_ROOT_SCHEMA]: rootSchema,
  };
}

export function getRootSchema(ctx: CoreContext): Schema {
  return ctx[CORE_ROOT_SCHEMA];
}

export function isValid(
  ctx: CoreContext,
  schema: SchemaDefinition,
  formData: SchemaValue | undefined
): boolean {
  return ctx[CORE_VALIDATOR].isValid(schema, formData);
}

export function mergeSchemas(ctx: CoreContext, a: Schema, b: Schema): Schema {
  return ctx[CORE_MERGER].mergeSchemas(a, b);
}

export function mergeAllOf(ctx: CoreContext, schema: Schema): Schema {
  return ctx[CORE_MERGER].mergeAllOf(schema);
}

export function isValueDeepEqual(
  ctx: CoreContext,
  a: SchemaValue | undefined,
  b: SchemaValue | undefined
): boolean {
  return ctx[CORE_MERGER].isValueDeepEqual(a, b);
}
