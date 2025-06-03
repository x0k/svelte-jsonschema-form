import type { Sample } from "@/core/index.js";

export default {
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
} satisfies Sample;
