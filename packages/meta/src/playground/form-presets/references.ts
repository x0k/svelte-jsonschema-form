import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
  jsonSchema,
  jsonUiSchema,
  jsonValue,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  schemaFormat: "json-schema",
  draft2020: false,
  title: "References",
  description:
    "JSON Schema $ref references for reusable and modular schema definitions.",
  tags: [PresetTag.Reference],
});

export default definePreset({
  schema: jsonSchema({
    definitions: {
      address: {
        type: "object",
        properties: {
          street_address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
        },
        required: ["street_address", "city", "state"],
      },
      node: {
        type: "object",
        properties: {
          name: { type: "string" },
          children: {
            type: "array",
            items: {
              $ref: "#/definitions/node",
            },
          },
        },
      },
    },
    type: "object",
    properties: {
      billing_address: {
        title: "Billing address",
        $ref: "#/definitions/address",
      },
      shipping_address: {
        title: "Shipping address",
        $ref: "#/definitions/address",
      },
      tree: {
        title: "Recursive references",
        $ref: "#/definitions/node",
      },
    },
  }),
  uiSchema: jsonUiSchema({
    "ui:definitions": {
      node: {
        name: {
          "ui:options": {
            title: "Custom name",
          },
        },
        children: {
          items: {
            $ref: "node",
          },
        },
      },
    },
    "ui:options": {
      order: ["shipping_address", "billing_address", "tree"],
    },
    tree: {
      $ref: "node",
    },
  }),
  initialValue: jsonValue({
    billing_address: {
      street_address: "21, Jump Street",
      city: "Babel",
      state: "Neverland",
    },
    shipping_address: {
      street_address: "221B, Baker Street",
      city: "London",
      state: "N/A",
    },
    tree: {
      name: "root",
      children: [{ name: "leaf" }],
    },
  }),
});
