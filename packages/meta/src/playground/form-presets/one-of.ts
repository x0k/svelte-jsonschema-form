import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaLogic,
  title: "One Of",
  description: "Schema oneOf composition with mutually exclusive sub-schemas.",
  tags: [PresetTag.Composition, PresetTag.Conditional],
});

export default definePreset({
  schema: {
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
  },
  uiSchema: {},
  initialValue: {},
});
