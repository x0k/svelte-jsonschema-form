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
  schema: { type: "json", draft2020: false },
  title: "Null",
  description: "Null type field handling and its UI representation.",
  tags: [PresetTag.Null],
});

export default definePreset({
  schema: jsonSchema({
    title: "Null field example",
    description: "A short form with a null field",
    type: "object",
    required: ["firstName"],
    properties: {
      helpText: {
        title: "A null field",
        description:
          "Null fields like this are great for adding extra information",
        type: "null",
      },
      firstName: {
        type: "string",
        title: "A regular string field",
        default: "Chuck",
      },
    },
  }),
  uiSchema: jsonUiSchema({
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
  }),
  initialValue: jsonValue({}),
});
