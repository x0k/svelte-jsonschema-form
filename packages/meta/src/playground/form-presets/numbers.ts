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
  title: "Numbers",
  description:
    "Numeric field types (integer, number), ranges, steps, and enum constraints.",
  tags: [PresetTag.Validation, PresetTag.Object],
});

export default definePreset({
  resolver: "compat",
  schema: jsonSchema({
    type: "object",
    title: "Number fields & widgets",
    properties: {
      number: {
        title: "Number",
        type: "number",
      },
      integer: {
        title: "Integer",
        type: "integer",
      },
      numberEnum: {
        type: "number",
        title: "Number enum",
        enum: [1, 2, 3],
      },
      numberEnumRadio: {
        type: "number",
        title: "Number enum",
        enum: [1, 2, 3],
      },
      integerRange: {
        title: "Integer range",
        type: "integer",
        minimum: -50,
        maximum: 50,
      },
      integerRangeSteps: {
        title: "Integer range (by 10)",
        type: "integer",
        minimum: 50,
        maximum: 100,
        multipleOf: 10,
      },
    },
  }),
  uiSchema: jsonUiSchema({
    numberEnumRadio: {
      "ui:components": {
        selectWidget: "radioWidget",
      },
    },
    integerRange: {
      "ui:components": {
        numberWidget: "rangeWidget",
      },
    },
    integerRangeSteps: {
      "ui:components": {
        numberWidget: "rangeWidget",
      },
    },
  }),
  initialValue: jsonValue({
    number: 3.14,
    integer: 42,
    numberEnum: 2,
    integerRange: 42,
    integerRangeSteps: 80,
  }),
});
