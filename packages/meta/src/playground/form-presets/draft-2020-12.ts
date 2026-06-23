import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
  jsonSchema,
  jsonUiSchema,
  jsonValue,
} from "../form-preset.ts";
import type { FormState } from "../form-state.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  schema: { type: "json", draft2020: true },
  title: "Draft 2020-12",
  description:
    "JSON Schema Draft 2020-12 features: prefixItems, unevaluatedProperties, $dynamicRef, and $dynamicAnchor.",
  tags: [PresetTag.Validation, PresetTag.Composition],
});

export default definePreset({
  schema: jsonSchema({
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
  } as FormState["schema"]),
  initialValue: jsonValue({}),
  uiSchema: jsonUiSchema({}),
});
