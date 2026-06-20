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
  title: "Pattern Properties",
  description:
    "Pattern-based property validation matching regex-defined property names.",
  tags: [PresetTag.Validation, PresetTag.Object],
});

export default definePreset({
  schema: jsonSchema({
    title: "A customizable registration form",
    description: "A simple form with pattern properties example.",
    type: "object",
    required: ["firstName", "lastName"],
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
    additionalProperties: false,
    patternProperties: {
      "^foo.*$": {
        type: "string",
      },
      "^bar.*$": {
        type: "number",
      },
    },
  }),
  uiSchema: jsonUiSchema({
    "ui:options": {
      translations: {
        "add-object-property": "Add property",
        "additional-property": "fooProp",
      },
    },
    firstName: {
      "ui:options": {
        text: {
          autofocus: true,
        },
        shadcn4Text: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
  }),
  initialValue: jsonValue({
    firstName: "Chuck",
    lastName: "Norris",
    fooPropertyExample: "foo",
    barPropertyExample: 123,
  }),
});
