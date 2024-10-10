import type { Sample } from "./Sample.js";

const widgets: Sample = {
  status: "perfect",
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
          toggle: {
            type: "boolean",
            title: "toggle",
            description: "This is the toggle-description",
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
        "ui:widget": "radio",
        "ui:options": {
          hideTitle: false,
        }
      },
      select: {
        "ui:widget": "select",
        "ui:options": {
          hideTitle: false,
        }
      },
      toggle: {
        "ui:widget": "toggle",
      },
    },
    string: {
      textarea: {
        "ui:widget": "textarea",
        "ui:options": {
          input: {
            rows: 5,
          },
        },
      },
      placeholder: {
        "ui:options": {
          input: {
            placeholder: "This is a placeholder",
          },
        },
      },
    },
    secret: {
      "ui:field": "hidden",
    },
    disabled: {
      "ui:options": {
        input: {
          disabled: true,
        },
      },
    },
    readonly: {
      "ui:options": {
        input: {
          readonly: true,
        },
      },
    },
    widgetOptions: {
      "ui:options": {
        input: {
          style: "flex-grow: 1; background-color: darkorange;",
        },
      },
    },
    selectWidgetOptions: {
      "ui:options": {
        input: {
          style: "flex-grow: 1; background-color: pink;",
        },
      },
    },
  },
  formData: {
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
};

export default widgets;
