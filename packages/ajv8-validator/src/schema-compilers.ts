import type {
  Ajv,
  AnySchema,
  AsyncValidateFunction,
  ValidateFunction,
} from "ajv";
import type { AnyValidateFunction } from "ajv/dist/core.js";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import { ID_KEY, prefixSchemaRefs, ROOT_SCHEMA_PREFIX } from "@sjsf/form/core";
import type { Config, Schema } from "@sjsf/form";

export function createSchemaCompiler<A extends boolean>(ajv: Ajv, _async: A) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  const validatorsCache = new WeakMap<Schema, AnyValidateFunction>();
  const compile = weakMemoize<Schema, AnyValidateFunction>(
    validatorsCache,
    (schema) => {
      let ajvSchema: AnySchema = schema;
      if (usePrefixSchemaRefs) {
        ajvSchema = prefixSchemaRefs(schema, rootSchemaId);
        delete ajvSchema[ID_KEY];
      }
      return ajv.compile(ajvSchema);
    }
  );
  return (schema: Schema, rootSchema: Schema) => {
    rootSchemaId = rootSchema[ID_KEY] ?? ROOT_SCHEMA_PREFIX;
    let ajvSchema = ajv.getSchema(rootSchemaId)?.schema;
    if (ajvSchema !== undefined && ajvSchema !== rootSchema) {
      ajv.removeSchema(rootSchemaId);
      validatorsCache.delete(schema);
      ajvSchema = undefined;
    }
    if (ajvSchema === undefined) {
      ajv.addSchema(rootSchema, rootSchemaId);
    }
    usePrefixSchemaRefs = schema !== rootSchema;
    return compile(schema) as A extends true
      ? AsyncValidateFunction
      : ValidateFunction;
  };
}

export function createFieldSchemaCompiler<A extends boolean>(
  ajv: Ajv,
  async: A
) {
  const validatorsCache = new WeakMap<Schema, AnyValidateFunction>();
  const compile = weakMemoize<Schema, AnyValidateFunction>(
    validatorsCache,
    (schema) => ajv.compile({ ...schema, $async: async })
  );
  return (config: Config) =>
    compile(config.schema) as A extends true
      ? AsyncValidateFunction
      : ValidateFunction;
}
