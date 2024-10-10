import type { Sample } from "./Sample.js";

const date: Sample = {
  status: "perfect",
  schema: {
    title: "Date and time widgets",
    type: "object",
    properties: {
      native: {
        title: "Native",
        description:
          "May not work on some browsers, like IE.",
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
  uiSchema: {},
  formData: {},
};

export default date;
