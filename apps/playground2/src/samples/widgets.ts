import type { Sample } from "@/core/index.js";

export default {
  resolver: "compat",
  schema: {
    title: "Widgets",
    type: "object",
    properties: {
      stringFormats: {
        type: "object",
        title: "String formats",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          uri: {
            type: "string",
            format: "uri",
          },
        },
      },
      boolean: {
        type: "object",
        title: "Boolean field",
        properties: {
          default: {
            type: "boolean",
            title: "checkbox (default)",
            description: "This is the checkbox-description",
          },
          radio: {
            type: "boolean",
            title: "radio buttons",
            description: "This is the radio-description",
          },
          select: {
            type: "boolean",
            title: "select box",
            description: "This is the select-description",
          },
        },
      },
      string: {
        type: "object",
        title: "String field",
        properties: {
          default: {
            type: "string",
            title: "text input (default)",
          },
          textarea: {
            type: "string",
            title: "textarea",
          },
          placeholder: {
            type: "string",
          },
          color: {
            type: "string",
            format: "color",
            title: "color picker",
            default: "#151ce6",
          },
        },
      },
      secret: {
        type: "string",
        default: "I'm a hidden string.",
      },
      disabled: {
        type: "string",
        title: "A disabled field",
        default: "I am disabled.",
      },
      readonly: {
        type: "string",
        title: "A readonly field",
        default: "I am read-only.",
      },
      readonly2: {
        type: "string",
        title: "Another readonly field",
        default: "I am also read-only.",
        readOnly: true,
      },
      widgetOptions: {
        title: "Widget with options",
        type: "string",
        default: "I am orange",
      },
      selectWidgetOptions: {
        title: "Select widget with options",
        type: "string",
        enum: ["foo", "bar"],
      },
      selectWidgetOptions2: {
        title: "Select widget with options, overriding the enum titles.",
        type: "string",
        oneOf: [
          {
            const: "foo",
            title: "Foo",
          },
          {
            const: "bar",
            title: "Bar",
          },
        ],
      },
    },
  },
  uiSchema: {
    boolean: {
      radio: {
        "ui:components": {
          booleanField: "booleanSelectField",
          selectWidget: "radioWidget",
        },
      },
      select: {
        "ui:components": {
          booleanField: "booleanSelectField",
        },
      },
    },
    string: {
      textarea: {
        "ui:components": {
          textWidget: "textareaWidget",
        },
        "ui:options": {
          textarea: {
            rows: 5,
          },
          flowbite3Textarea: {
            rows: 5,
          },
        },
      },
      placeholder: {
        "ui:options": {
          text: {
            placeholder: "This is a placeholder",
          },
          flowbite3Text: {
            placeholder: "This is a placeholder",
          },
          shadcn4Text: {
            placeholder: "This is a placeholder",
          },
        },
      },
    },
    secret: {
      "ui:options": {
        text: {
          type: "hidden",
        },
        flowbite3Text: {
          type: "hidden",
        },
        shadcn4Text: {
          type: "hidden",
        },
      },
    },
    disabled: {
      "ui:options": {
        text: {
          disabled: true,
        },
        flowbite3Text: {
          disabled: true,
        },
        shadcn4Text: {
          disabled: true,
        },
      },
    },
    readonly: {
      "ui:options": {
        text: {
          readonly: true,
        },
        flowbite3Text: {
          readonly: true,
        },
        shadcn4Text: {
          readonly: true,
        },
      },
    },
    widgetOptions: {
      "ui:options": {
        text: {
          style: "flex-grow: 1; background-color: darkorange;",
        },
        flowbite3Text: {
          style: "flex-grow: 1; background-color: darkorange;",
        },
        shadcn4Text: {
          style: "flex-grow: 1; background-color: darkorange;",
        },
      },
    },
    selectWidgetOptions: {
      "ui:options": {
        select: {
          style: "flex-grow: 1; background-color: pink; color: black;",
        },
        flowbite3Select: {
          style: "flex-grow: 1; background-color: pink; color: black;",
        },
        shadcn4SelectTrigger: {
          style: "flex-grow: 1; background-color: pink; color: black;",
        },
      },
    },
  },
  initialValue: {
    stringFormats: {
      email: "chuck@norris.net",
      uri: "http://chucknorris.com/",
    },
    boolean: {
      default: true,
      radio: true,
      select: true,
    },
    string: {
      default: "Hello...",
      textarea: "... World",
    },
    secret: "I'm a hidden string.",
  },
} satisfies Sample;
