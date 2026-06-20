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
  title: "Nested",
  description:
    "Deeply nested object structures with multiple levels of hierarchy.",
  tags: [PresetTag.Object, PresetTag.Composition],
});

export default definePreset({
  schema: jsonSchema({
    title: "A list of tasks",
    type: "object",
    required: ["title"],
    properties: {
      title: {
        type: "string",
        title: "Task list title",
      },
      tasks: {
        type: "array",
        title: "Tasks",
        items: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              title: "Title",
              description: "A sample title",
            },
            details: {
              type: "string",
              title: "Task details",
              description: "Enter the task details",
            },
            done: {
              type: "boolean",
              title: "Done?",
              default: false,
            },
          },
        },
      },
    },
  }),
  uiSchema: jsonUiSchema({
    tasks: {
      items: {
        details: {
          "ui:components": {
            textWidget: "textareaWidget",
          },
        },
      },
    },
  }),
  initialValue: jsonValue({
    title: "My current tasks",
    tasks: [
      {
        title: "My first task",
        details:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        done: true,
      },
      {
        title: "My second task",
        details:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
        done: false,
      },
    ],
  }),
});
