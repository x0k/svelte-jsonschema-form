import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  title: "Date",
  description: "Date picker widget integration for date-type form fields.",
  tags: [PresetTag.Widget],
});

export default definePreset({
  schema: {
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
  },
  uiSchema: {
    datePicker: {
      "ui:components": {
        textWidget: "datePickerWidget",
      },
    },
  },
  initialValue: {},
});
