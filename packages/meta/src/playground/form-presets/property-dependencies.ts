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
  category: FormPresetCategory.SchemaLogic,
  schema: { type: "json", draft2020: false },
  title: "Property Dependencies",
  description:
    "Conditional field visibility and requirements tied to property values.",
  tags: [PresetTag.Conditional],
});

export default definePreset({
  schema: jsonSchema({
    title: "Property dependencies",
    description: "These samples are best viewed without live validation.",
    type: "object",
    properties: {
      unidirectional: {
        title: "Unidirectional",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          credit_card: {
            type: "number",
          },
          billing_address: {
            type: "string",
          },
        },
        required: ["name"],
        dependencies: {
          credit_card: ["billing_address"],
        },
      },
      bidirectional: {
        title: "Bidirectional",
        description:
          "Dependencies are not bidirectional, you can, of course, define the bidirectional dependencies explicitly.",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          credit_card: {
            type: "number",
          },
          billing_address: {
            type: "string",
          },
        },
        required: ["name"],
        dependencies: {
          credit_card: ["billing_address"],
          billing_address: ["credit_card"],
        },
      },
    },
  }),
  uiSchema: jsonUiSchema({
    unidirectional: {
      credit_card: {
        "ui:options": {
          help: "If you enter anything here then billing_address will become required.",
        },
      },
      billing_address: {
        "ui:options": {
          help: "It's okay to have a billing address without a credit card number.",
        },
      },
    },
    bidirectional: {
      credit_card: {
        "ui:options": {
          help: "If you enter anything here then billing_address will become required.",
        },
      },
      billing_address: {
        "ui:options": {
          help: "If you enter anything here then credit_card will become required.",
        },
      },
    },
  }),
  initialValue: jsonValue({
    unidirectional: {
      name: "Tim",
    },
    bidirectional: {
      name: "Jill",
    },
  }),
});
