import type { JSONSchema } from "json-schema-typed/draft-2020-12";

import { noop } from "@/lib/function.js";
import type { SchemaDefinition, Schema } from "@/core/index.js";

interface Context {
  baseUrl: string | undefined;
  anchorMap: Map<string, string>;
}

function buildAnchorMap(schema: JSONSchema.Interface): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, val] of Object.entries(schema.$defs ?? {})) {
    if (typeof val === "object" && val !== null) {
      const anchor = val.$dynamicAnchor ?? val.$anchor;
      if (anchor) map.set(anchor, key);
    }
  }
  return map;
}

function assign<I, O>(convert: (ctx: Context, input: I) => O) {
  return <K extends string>(
    target: { [k in K]?: O },
    value: I,
    ctx: Context,
    _: JSONSchema.Interface,
    key: K
  ) => {
    target[key] = convert(ctx, value);
  };
}

const assignAsIs = assign((_, v) => v) as <K extends string, V>(
  t: { [k in K]?: V },
  v: V | Readonly<V>
) => void;

const ASSIGNERS: {
  [K in keyof JSONSchema.Interface]-?: (
    target: Schema,
    value: Exclude<JSONSchema.Interface[K], undefined>,
    ctx: Context,
    schema: JSONSchema.Interface,
    key: K
  ) => void;
} = {
  /** Unsupported **/
  contentSchema: noop,
  deprecated: noop,
  $vocabulary: noop,
  // $anchor/$dynamicAnchor: plain-name fragment $ids are not valid in draft-07;
  // the $defs key path (#/$defs/{key}) is sufficient for referencing
  $anchor: noop,
  $dynamicAnchor: noop,

  /** Carried over as custom keywords (no draft-07 equivalent) **/
  minContains: assignAsIs,
  maxContains: assignAsIs,

  /** Lossy conversions **/
  // $dynamicRef: resolve fragment via anchorMap → #/$defs/{key}; fall back to
  // verbatim $ref for absolute URLs (loses dynamic scoping semantics)
  $dynamicRef: (t, v, ctx) => {
    if (v.startsWith("#")) {
      const name = v.slice(1);
      const key = ctx.anchorMap.get(name);
      t.$ref = key ? `#/$defs/${key}` : v;
      return;
    }
    const url = new URL(v, ctx.baseUrl);
    const hash = url.hash.slice(1);
    url.hash = "";
    const key = url.href.replaceAll("~", "~0").replaceAll("/", "~1");
    t.$ref = `#/$defs/${key}${hash}`;
  },
  // unevaluatedItems → additionalItems (??= so items handler takes priority)
  unevaluatedItems: (t, v, ctx) => {
    t.additionalItems ??= convertSchemaDef(ctx, v);
  },
  // unevaluatedProperties → additionalProperties (??= so explicit value takes priority)
  unevaluatedProperties: (t, v, ctx) => {
    t.additionalProperties ??= convertSchemaDef(ctx, v);
  },

  /** As is **/
  $id: assignAsIs,
  $comment: assignAsIs,
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

  /** Recursive schema conversions **/
  additionalProperties: assign(convertSchemaDef),
  allOf: assign(convertArrayOfSchemaDefs),
  anyOf: assign(convertArrayOfSchemaDefs),
  oneOf: assign(convertArrayOfSchemaDefs),
  contains: assign(convertSchemaDef),
  properties: assign(convertRecordOfSchemaDefs),
  propertyNames: assign(convertSchemaDef),
  patternProperties: assign(convertRecordOfSchemaDefs),
  if: assign(convertSchemaDef),
  then: assign(convertSchemaDef),
  else: assign(convertSchemaDef),
  not: assign(convertSchemaDef),

  /** Special **/
  $schema: (t) => (t.$schema = "http://json-schema.org/draft-07/schema"),
  $ref: (t, v, ctx) => {
    if (v.startsWith("#")) {
      t.$ref = v;
      return;
    }
    const url = new URL(v, ctx.baseUrl);
    const hash = url.hash.slice(1);
    url.hash = "";
    const key = url.href.replaceAll("~", "~0").replaceAll("/", "~1");
    t.$ref = `#/$defs/${key}${hash}`;
  },
  $defs: (t, v, ctx) => {
    const result: Record<string, SchemaDefinition> = {};
    for (const [key, val] of Object.entries(v)) {
      if (typeof val === "boolean") {
        result[key] = val;
      } else {
        result[key] = convertSchema(
          { ...ctx, baseUrl: val.$id ?? ctx.baseUrl },
          val
        );
      }
    }
    t.$defs = result;
  },
  type: (t, v) => (t.type = v as Schema["type"]),
  dependentSchemas: (t, v, ctx) => {
    const deps = (t.dependencies ??= {});
    for (const [key, val] of Object.entries(v)) {
      deps[key] = convertSchemaDef(ctx, val);
    }
  },
  dependentRequired: (t, v) => {
    const deps = (t.dependencies ??= {});
    Object.assign(deps, v);
  },
  items: (t, v, ctx, s) => {
    const def = convertSchemaDef(ctx, v);
    if (s.prefixItems) {
      t.additionalItems ??= def;
    } else {
      t.items = def;
    }
  },
  prefixItems: (t, v, ctx) => {
    t.items = Array.isArray(v)
      ? convertArrayOfSchemaDefs(ctx, v)
      : convertSchemaDef(ctx, v as JSONSchema);
  },

  /** Deprecated **/
  additionalItems: assign(convertSchemaDef),
  definitions: assign(convertRecordOfSchemaDefs),
  dependencies: (t, v, ctx) => {
    const deps = (t.dependencies ??= {});
    for (const [key, val] of Object.entries(v)) {
      deps[key] = Array.isArray(val)
        ? val
        : convertSchemaDef(ctx, val as JSONSchema);
    }
  },
};

function convertSchema(ctx: Context, schema: JSONSchema.Interface): Schema {
  const result: Schema = {};
  const keys = Object.keys(schema) as Array<keyof JSONSchema.Interface>;
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const v = schema[key];
    if (v === undefined) continue;
    ASSIGNERS[key](result, v as never, ctx, schema, key as never);
  }
  return result;
}

function convertSchemaDef(ctx: Context, schema: JSONSchema): SchemaDefinition {
  if (typeof schema === "boolean") return schema;
  return convertSchema(ctx, schema);
}

function convertRecordOfSchemaDefs(
  ctx: Context,
  schemas: Record<string, JSONSchema>
) {
  const result: Record<string, SchemaDefinition> = {};
  for (const key of Object.keys(schemas)) {
    result[key] = convertSchemaDef(ctx, schemas[key]!);
  }
  return result;
}

function convertArrayOfSchemaDefs(
  ctx: Context,
  schemas: ReadonlyArray<JSONSchema>
) {
  return schemas.map((s) => convertSchemaDef(ctx, s));
}

export function convert(schema: JSONSchema.Interface): Schema {
  return convertSchema(
    {
      baseUrl: schema.$id,
      anchorMap: buildAnchorMap(schema),
    },
    schema
  );
}
