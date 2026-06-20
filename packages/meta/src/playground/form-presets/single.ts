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
  title: "Single",
  description: "Minimal form example with a single text input field.",
  tags: [PresetTag.Object],
});

export default definePreset({
  schema: jsonSchema({
    title: "A single-field form",
    type: "string",
  }),
  initialValue: jsonValue("initial value"),
  uiSchema: jsonUiSchema({}),
});
