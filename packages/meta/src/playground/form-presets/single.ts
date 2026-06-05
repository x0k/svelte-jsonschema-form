import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  title: "Single",
  description: "Minimal form example with a single text input field.",
  tags: [PresetTag.Object],
});

export default definePreset({
  schema: {
    title: "A single-field form",
    type: "string",
  },
  initialValue: "initial value",
  uiSchema: {},
});
