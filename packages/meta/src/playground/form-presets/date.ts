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
  title: "Date",
  description: "Date picker widget integration for date-type form fields.",
  tags: [PresetTag.Widget],
});

export default definePreset({
  schema: jsonSchema({
    title: "Date and time widgets",
    type: "object",
    properties: {
      native: {
        title: "Native",
        description: "May not work on some browsers, like IE.",
        type: "object",
        properties: {
          datetime: {
            type: "string",
            format: "date-time",
          },
          date: {
            type: "string",
            format: "date",
          },
          time: {
            type: "string",
            format: "time",
          },
        },
      },
      datePicker: {
        title: "Date picker",
        description: "May not work because shadow DOM",
        type: "string",
      },
      // NOTE: Alt date widgets don't supported
      // alternative: {
      //   title: 'Alternative',
      //   description: 'These work on most platforms.',
      //   type: 'object',
      //   properties: {
      //     'alt-datetime': {
      //       type: 'string',
      //       format: 'date-time',
      //     },
      //     'alt-date': {
      //       type: 'string',
      //       format: 'date',
      //     },
      //   },
      // },
    },
  }),
  uiSchema: jsonUiSchema({
    datePicker: {
      "ui:components": {
        textWidget: "datePickerWidget",
      },
    },
  }),
  initialValue: jsonValue({}),
});
