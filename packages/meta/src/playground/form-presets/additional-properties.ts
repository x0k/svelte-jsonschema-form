import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaLogic,
  title: "Additional Properties",
  description:
    "Dynamic property patterns using additionalProperties and patternProperties.",
  tags: [PresetTag.Object, PresetTag.Validation],
});

export default definePreset({
  schema: {
    title: "A customizable registration form",
    description: "A simple form with additional properties example.",
    type: "object",
    required: ["firstName", "lastName"],
    additionalProperties: {
      type: "string",
    },
    properties: {
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
    },
  },
  uiSchema: {
    firstName: {
      "ui:options": {
        text: {
          autofocus: true,
        },
        flowbite3Text: {
          autofocus: true,
        },
        shadcn4Text: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
  },
  initialValue: {
    firstName: "Chuck",
    lastName: "Norris",
    assKickCount: "infinity",
  },
});
