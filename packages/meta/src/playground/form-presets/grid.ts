import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.UiCustomization,
  title: "Grid",
  description:
    "Multi-column grid layouts using responsive field grid configuration.",
  tags: [PresetTag.Layout],
});

export default definePreset({
  // Based on https://habr.com/ru/articles/884862/ (RU)
  schema: {
    title: "Fill in user information",
    type: "object",
    required: ["name", "username"],
    properties: {
      name: { type: "string", title: "Full Name" },
      username: { type: "string", title: "Username" },
      email: { type: "string", title: "E-mail" },
      telephone: { type: "string", title: "Phone" },
      telegram: { type: "string", title: "Telegram" },
      date: { type: "string", format: "date", title: "Date of Birth" },
      bio: { type: "string", title: "About Me" },
      city: { type: "string", title: "City" },
    },
  },
  uiSchema: {
    "ui:options": {
      layouts: {
        "object-properties": {
          style:
            "display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem",
        },
      },
    },
    name: {
      "ui:options": {
        layouts: {
          "object-property": {
            style: "grid-column: 1/3;",
          },
        },
      },
    },
    bio: {
      "ui:components": {
        textWidget: "textareaWidget",
      },
      "ui:options": {
        textarea: {
          style: "flex-grow: 1",
          rows: 5,
        },
        layouts: {
          "object-property": {
            style: "grid-column: 2/4; grid-row: 3/5",
          },
        },
      },
    },
  },
  initialValue: {},
});
