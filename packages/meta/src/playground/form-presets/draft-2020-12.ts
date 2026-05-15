import type { FormPreset, FormPresetCategory } from "../form-state.ts";

export const category: FormPresetCategory = "Schema Basics";

export default {
  schema: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://example.com/schema",
    title: "Draft 2020-12",
    description:
      "This schema is an example of how SJSF can support Draft 2020-12 schemas using conversion (`@sjsf/form/converters/draft-2020-12`).",

    type: "object",

    properties: {
      tuple: {
        type: "array",
        prefixItems: [{ type: "string" }, { type: "integer" }],
        items: { type: "boolean" },
      },

      extra: {
        type: "object",
        properties: {
          known: { type: "string" },
        },
        unevaluatedProperties: { type: "number" },
      },

      refExample: {
        $dynamicRef: "#node",
      },
    },

    $defs: {
      node: {
        $dynamicAnchor: "node",
        type: "object",
        properties: {
          value: { type: "string" },
        },
      },
    },
  } as FormPreset["schema"],
  initialValue: {},
  uiSchema: {},
} satisfies FormPreset;
