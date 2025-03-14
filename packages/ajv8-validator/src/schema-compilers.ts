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

const FIELD_REQUIRED = ["field"];
const FIELD_NOT_REQUIRED: string[] = [];

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
  let isRequired = false;
  const validatorsCache = new WeakMap<Schema, AnyValidateFunction>();
  const requiredCache = new WeakMap<Schema, boolean>();
  const compile = weakMemoize<Schema, AnyValidateFunction>(
    validatorsCache,
    (schema) =>
      ajv.compile({
        type: "object",
        $async: async,
        properties: {
          field: schema,
        },
        required: isRequired ? FIELD_REQUIRED : FIELD_NOT_REQUIRED,
      })
  );
  return (config: Config) => {
    isRequired = config.required;
    const prev = requiredCache.get(config.schema);
    if (prev !== config.required) {
      validatorsCache.delete(config.schema);
      requiredCache.set(config.schema, config.required);
    }
    return compile(config.schema) as A extends true
      ? AsyncValidateFunction
      : ValidateFunction;
  };
}
