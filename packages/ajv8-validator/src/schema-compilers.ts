import type { Config, Schema } from "@sjsf/form";
import { prefixSchemaRefs, ROOT_SCHEMA_PREFIX } from "@sjsf/form/core";
import { memoize, weakMemoize, type MapLike } from "@sjsf/form/lib/memoize";
import type {
  Ajv,
  AnySchema,
  AsyncValidateFunction,
  ValidateFunction,
} from "ajv";
import type { AnyValidateFunction } from "ajv/dist/core.js";

export interface ValidatorsCache extends MapLike<Schema, AnyValidateFunction> {}

function compileWithEviction(ajv: Ajv, schema: AnySchema) {
  try {
    return ajv.compile(schema);
  } catch (e) {
    // AJV 8 registers a schema in its internal cache before running
    // meta-schema validation. When that check throws (e.g. anyOf:[]
    // violates draft-07's minItems:1), the broken schema stays cached
    // so subsequent compile() calls skip revalidation and silently
    // return a compiled always-false validator with no error.
    if (typeof schema !== "boolean") {
      ajv.removeSchema(schema.$id ?? schema);
    }
    throw e;
  }
}

export function createSchemaCompiler<A extends boolean>(
  ajv: Ajv,
  async: A,
  rootSchema: Schema,
  validatorsCache: ValidatorsCache = new WeakMap()
) {
  const { $id: id = ROOT_SCHEMA_PREFIX, ...rootSchemaRest } = rootSchema;
  const rootSchemaId = `${id}__${async ? "async" : "sync"}`;
  ajv.removeSchema(rootSchemaId);
  try {
    ajv.addSchema({ ...rootSchemaRest, $async: async }, rootSchemaId);
  } catch (e) {
    ajv.removeSchema(rootSchemaId);
    throw e;
  }
  const ajvRootSchema = ajv.getSchema(rootSchemaId);
  if (ajvRootSchema === undefined) {
    throw new Error("Failed to add root schema");
  }
  const compile = memoize<Schema, AnyValidateFunction>(
    validatorsCache,
    (schema) => {
      const { $id: _, ...rest } = prefixSchemaRefs(schema, rootSchemaId);
      return compileWithEviction(ajv, { ...rest, $async: async });
    }
  );
  return (schema: Schema) =>
    (schema === rootSchema ? ajvRootSchema : compile(schema)) as A extends true
      ? AsyncValidateFunction
      : ValidateFunction;
}

export function createFieldSchemaCompiler<A extends boolean>(
  ajv: Ajv,
  async: A
) {
  const validatorsCache = new WeakMap<Schema, AnyValidateFunction>();
  const compile = weakMemoize<Schema, AnyValidateFunction>(
    validatorsCache,
    (schema) =>
      compileWithEviction(ajv, { ...schema, $async: async } as AnySchema)
  );
  return (config: Config) =>
    compile(config.schema) as A extends true
      ? AsyncValidateFunction
      : ValidateFunction;
}
