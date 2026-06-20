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
  title: "Alternatives",
  description:
    "Multiple field definitions combined with anyOf for polymorphic object type.",
  tags: [PresetTag.Composition],
});

export default definePreset({
  resolver: "compat",
  schema: jsonSchema({
    definitions: {
      Color: {
        title: "Color",
        type: "string",
        anyOf: [
          {
            type: "string",
            enum: ["#ff0000"],
            title: "Red",
          },
          {
            type: "string",
            enum: ["#00ff00"],
            title: "Green",
          },
          {
            type: "string",
            enum: ["#0000ff"],
            title: "Blue",
          },
        ],
      },
      Toggle: {
        title: "Toggle",
        type: "boolean",
        oneOf: [
          {
            title: "Enable",
            const: true,
          },
          {
            title: "Disable",
            const: false,
          },
        ],
      },
    },
    title: "Image editor",
    type: "object",
    required: ["currentColor", "colorMask", "blendMode"],
    properties: {
      currentColor: {
        $ref: "#/definitions/Color",
        title: "Brush color",
      },
      colorMask: {
        type: "array",
        uniqueItems: true,
        items: {
          $ref: "#/definitions/Color",
        },
        title: "Color mask",
      },
      toggleMask: {
        title: "Apply color mask",
        $ref: "#/definitions/Toggle",
      },
      colorPalette: {
        type: "array",
        title: "Color palette",
        items: {
          $ref: "#/definitions/Color",
        },
      },
      blendMode: {
        title: "Blend mode",
        type: "string",
        oneOf: [
          { const: "screen", title: "Screen" },
          { const: "multiply", title: "Multiply" },
          { const: "overlay", title: "Overlay" },
        ],
      },
    },
  }),
  uiSchema: jsonUiSchema({
    blendMode: {
      "ui:options": {
        disabledEnumValues: ["multiply"],
      },
    },
    toggleMask: {
      "ui:components": {
        selectWidget: "radioWidget",
      },
    },
  }),
  initialValue: jsonValue({
    currentColor: "#00ff00",
    colorMask: ["#0000ff"],
    colorPalette: ["#ff0000"],
    blendMode: "screen",
  }),
});
