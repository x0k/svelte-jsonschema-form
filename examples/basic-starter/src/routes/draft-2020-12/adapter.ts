import type { JSONSchema } from "json-schema-typed/draft-2020-12";
import { identity, noop } from "@sjsf/form/lib/function";
import type { SchemaDefinition } from "@sjsf/form/core";
import type { Schema } from "@sjsf/form";

function assign<I, O>(convert: (input: I) => O) {
  return <K extends string>(target: { [k in K]?: O }, value: I, key: K) => {
    target[key] = convert(value);
  };
}

const assignAsIs = assign(identity) as <K extends string, V>(
  t: { [k in K]?: V },
  v: V | Readonly<V>,
  k: K
) => void;

const ASSIGNERS: {
  [K in keyof JSONSchema.Interface]-?: (
    target: Schema,
    value: Exclude<JSONSchema.Interface[K], undefined>,
    key: K,
    schema: JSONSchema.Interface
  ) => void;
} = {
  $anchor: noop,
  $vocabulary: noop,
  $dynamicAnchor: noop,
  $dynamicRef: noop,
  unevaluatedItems: noop,
  unevaluatedProperties: noop,
  contentSchema: noop,
  deprecated: noop,
  maxContains: noop,
  minContains: noop,
  //
  $id: assignAsIs,
  $comment: assignAsIs,
  $ref: assignAsIs,
  title: assignAsIs,
  description: assignAsIs,
  required: assignAsIs,
  enum: assignAsIs,
  default: assignAsIs,
  pattern: assignAsIs,
  examples: assignAsIs,
  exclusiveMaximum: assignAsIs,
  exclusiveMinimum: assignAsIs,
  format: assignAsIs,
  minimum: assignAsIs,
  maximum: assignAsIs,
  multipleOf: assignAsIs,
  minLength: assignAsIs,
  maxLength: assignAsIs,
  minItems: assignAsIs,
  maxItems: assignAsIs,
  minProperties: assignAsIs,
  maxProperties: assignAsIs,
  readOnly: assignAsIs,
  writeOnly: assignAsIs,
  uniqueItems: assignAsIs,
  const: assignAsIs,
  contentEncoding: assignAsIs,
  contentMediaType: assignAsIs,
  //
  $defs: assign(convertRecordOfSchemaDefs),
  additionalProperties: assign(convertSchemaDef),
  allOf: assign(convertArrayOfSchemaDefs),
  anyOf: assign(convertArrayOfSchemaDefs),
  oneOf: assign(convertArrayOfSchemaDefs),
  contains: assign(convertSchemaDef),
  properties: assign(convertRecordOfSchemaDefs),
  propertyNames: assign(convertSchemaDef),
  patternProperties: assign(convertSchemaDef),
  if: assign(convertSchemaDef),
  then: assign(convertSchemaDef),
  else: assign(convertSchemaDef),
  not: assign(convertSchemaDef),
  //
  $schema: (t) => (t.$schema = "http://json-schema.org/draft-07/schema#"),
  type: (t, v) => (t.type = v as Schema["type"]),
  dependentSchemas: (t, v) => {
    const deps = (t.dependencies ??= {});
    for (const [key, val] of Object.entries(v)) {
      deps[key] = convertSchemaDef(val);
    }
  },
  dependentRequired: (t, v) => {
    const deps = (t.dependencies ??= {});
    Object.assign(deps, v);
  },
  items: (t, v, _, s) => {
    const def = convertSchemaDef(v);
    if (s.prefixItems) {
      t.additionalItems = def;
    } else {
      t.items = def;
    }
  },
  prefixItems: (t, v) => {
    t.items = Array.isArray(v)
      ? convertArrayOfSchemaDefs(v)
      : convertSchemaDef(v as JSONSchema);
  },
  // Deprecated
  additionalItems: assign(convertSchemaDef),
  definitions: assign(convertRecordOfSchemaDefs),
  dependencies: (t, v) => {
    const deps = (t.dependencies ??= {});
    for (const [key, val] of Object.entries(v)) {
      deps[key] = Array.isArray(val)
        ? val
        : convertSchemaDef(val as JSONSchema);
    }
  },
};

function convertSchema(schema: JSONSchema.Interface): Schema {
  const result: Schema = {};
  const keys = Object.keys(schema) as Array<keyof JSONSchema.Interface>;
  for (const key of keys) {
    const v = schema[key];
    if (v === undefined) {
      continue;
    }
    ASSIGNERS[key](result, v as never, key as never, schema);
  }
  return result;
}

function convertSchemaDef(schema: JSONSchema): SchemaDefinition {
  if (typeof schema === "boolean") {
    return schema;
  }
  return convertSchema(schema);
}

function convertRecordOfSchemaDefs(schemas: Record<string, JSONSchema>) {
  const result: Record<string, SchemaDefinition> = {};
  for (const key of Object.keys(schemas)) {
    result[key] = convertSchemaDef(schemas[key]);
  }
  return result;
}

function convertArrayOfSchemaDefs(schemas: ReadonlyArray<JSONSchema>) {
  return schemas.map(convertSchemaDef);
}

export const adapt = convertSchema;
