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
  schemaFormat: "json-schema",
  draft2020: false,
  title: "One Of",
  description: "Schema oneOf composition with mutually exclusive sub-schemas.",
  tags: [PresetTag.Composition, PresetTag.Conditional],
});

export default definePreset({
  schema: jsonSchema({
    type: "object",
    oneOf: [
      {
        properties: {
          lorem: {
            type: "string",
          },
        },
        required: ["lorem"],
      },
      {
        properties: {
          ipsum: {
            type: "string",
          },
        },
        required: ["ipsum"],
      },
    ],
  }),
  uiSchema: jsonUiSchema({}),
  initialValue: jsonValue({}),
});
