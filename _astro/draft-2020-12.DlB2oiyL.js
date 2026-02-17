import{p as n}from"./package.DSGE-J9T.js";import{p as e,D as s}from"./advanced-examples.DT8uLNFF.js";import"./each.BMwIza1_.js";import"./render.D5KaOs_C.js";import"./definitions.CSr_piYZ.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.oSD68OPL.js";import"./shared.B9lixVVw.js";import"./preload-helper.BUFao3bW.js";import"./buttons.D5CuMo9K.js";/* empty css                                                       *//* empty css                                                                 */const t=`import type { JSONSchema } from "json-schema-typed/draft-2020-12";
import { identity, noop } from "@sjsf/form/lib/function";
import type { SchemaDefinition } from "@sjsf/form/core";
import type { Schema } from "@sjsf/form";

function assign<I, O>(convert: (input: I, baseUrl: string | undefined) => O) {
  return <K extends string>(
    target: { [k in K]?: O },
    value: I,
    baseUrl: string | undefined,
    _: JSONSchema.Interface,
    key: K
  ) => {
    target[key] = convert(value, baseUrl);
  };
}

const assignAsIs = assign(identity) as <K extends string, V>(
  t: { [k in K]?: V },
  v: V | Readonly<V>
) => void;

const ASSIGNERS: {
  [K in keyof JSONSchema.Interface]-?: (
    target: Schema,
    value: Exclude<JSONSchema.Interface[K], undefined>,
    baseUrl: string | undefined,
    schema: JSONSchema.Interface,
    key: K
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
  $ref: (t, v, b) => {
    if (v.startsWith("#")) {
      t.$ref = v;
      return;
    }
    const url = new URL(v, b);
    const hash = url.hash.slice(1);
    url.hash = "";
    let key = url.href.replaceAll("~", "~0").replaceAll("/", "~1");
    t.$ref = \`#/$defs/\${key}\${hash}\`;
  },
  $defs: (t, v, b) => {
    const result: Record<string, SchemaDefinition> = {};
    for (const [key, val] of Object.entries(v)) {
      result[key] =
        typeof val === "boolean" ? val : convertSchemaDef(val, val.$id ?? b);
    }
    t.$defs = result;
  },
  type: (t, v) => (t.type = v as Schema["type"]),
  dependentSchemas: (t, v, b) => {
    const deps = (t.dependencies ??= {});
    for (const [key, val] of Object.entries(v)) {
      deps[key] = convertSchemaDef(val, b);
    }
  },
  dependentRequired: (t, v) => {
    const deps = (t.dependencies ??= {});
    Object.assign(deps, v);
  },
  items: (t, v, b, s) => {
    const def = convertSchemaDef(v, b);
    if (s.prefixItems) {
      t.additionalItems = def;
    } else {
      t.items = def;
    }
  },
  prefixItems: (t, v, b) => {
    t.items = Array.isArray(v)
      ? convertArrayOfSchemaDefs(v, b)
      : convertSchemaDef(v as JSONSchema, b);
  },
  // Deprecated
  additionalItems: assign(convertSchemaDef),
  definitions: assign(convertRecordOfSchemaDefs),
  dependencies: (t, v, b) => {
    const deps = (t.dependencies ??= {});
    for (const [key, val] of Object.entries(v)) {
      deps[key] = Array.isArray(val)
        ? val
        : convertSchemaDef(val as JSONSchema, b);
    }
  },
};

function convertSchema(
  schema: JSONSchema.Interface,
  baseUrl: string | undefined
): Schema {
  const result: Schema = {};
  const keys = Object.keys(schema) as Array<keyof JSONSchema.Interface>;
  for (const key of keys) {
    const v = schema[key];
    if (v === undefined) {
      continue;
    }
    ASSIGNERS[key](result, v as never, baseUrl, schema, key as never);
  }
  return result;
}

function convertSchemaDef(
  schema: JSONSchema,
  baseUrl: string | undefined
): SchemaDefinition {
  if (typeof schema === "boolean") {
    return schema;
  }
  return convertSchema(schema, baseUrl);
}

function convertRecordOfSchemaDefs(
  schemas: Record<string, JSONSchema>,
  baseUrl: string | undefined
) {
  const result: Record<string, SchemaDefinition> = {};
  for (const key of Object.keys(schemas)) {
    result[key] = convertSchemaDef(schemas[key], baseUrl);
  }
  return result;
}

function convertArrayOfSchemaDefs(
  schemas: ReadonlyArray<JSONSchema>,
  baseUrl: string | undefined
) {
  return schemas.map((s) => convertSchemaDef(s, baseUrl));
}

export function convert(schema: JSONSchema.Interface) {
  return convertSchema(schema, schema.$id);
}
`,a=`<script lang="ts">
  import type { JSONSchema } from "json-schema-typed/draft-2020-12";
  import { createForm, BasicForm } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  // This adapter is intended to produce a Draft-07 schema that is
  // structurally equivalent to a Draft 2020-12 schema.
  // It has some limitations — see the usage of the \`noop\` function.
  import { convert } from "./convert";

  const schema = {
    type: "array",
    prefixItems: [
      { title: "foo", type: "string", default: "carp" },
      { title: "bar", type: "string", minLength: 3 },
    ],
    items: { title: "Additional", type: "number" },
  } as const satisfies JSONSchema;

  const form = createForm({
    ...defaults,
    // WARN: Some validation functionality is lost during schema conversion.
    // Keep this in mind on the client side and use the original schema for server-side validation.
    schema: convert(schema),
    // Example using \`Ajv2020\`:
    // validator: <T,>(options: ValidatorFactoryOptions) => {
    //   const validator = defaults.validator<T>({
    //     ...options,
    //     ajv: addFormComponents(new Ajv2020(DEFAULT_AJV_CONFIG)),
    //   });
    //   // TODO: Pass the original schema parts to the \`isValid\` method.
    //   return {
    //     ...validator,
    //     validateFormValue(_, formValue) {
    //       return validator.validateFormValue(schema, formValue);
    //     },
    //   };
    // },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,g={package:e(n,s),files:{"src/routes/convert.ts":t,"src/routes/+page.svelte":a}};export{g as layer};
