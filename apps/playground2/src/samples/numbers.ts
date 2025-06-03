import type { Sample } from "@/core/index.js";

export default {
  resolver: "compat",
  schema: {
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
  },
  uiSchema: {
    numberEnumRadio: {
      "ui:components": {
        selectWidget: "radioWidget",
      },
    },
    integerRange: {
      "ui:components": {
        numberWidget: "rangeWidget"
      }
    },
    integerRangeSteps: {
      "ui:components": {
        numberWidget: "rangeWidget"
      }
    },
  },
  initialValue: {
    number: 3.14,
    integer: 42,
    numberEnum: 2,
    integerRange: 42,
    integerRangeSteps: 80,
  },
} satisfies Sample;
