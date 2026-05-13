import type {
  PlaygroundPresetCategory,
  PlaygroundPreset,
} from "../playground-state.ts";

export const category: PlaygroundPresetCategory = "Schema Logic";

export default {
  schema: {
    title: "A customizable registration form",
    description: "A simple form with additional properties example.",
    type: "object",
    required: ["firstName", "lastName"],
    additionalProperties: {
      type: "string",
    },
    properties: {
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
    },
  },
  uiSchema: {
    firstName: {
      "ui:options": {
        text: {
          autofocus: true,
        },
        flowbite3Text: {
          autofocus: true,
        },
        shadcn4Text: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
  },
  initialValue: {
    firstName: "Chuck",
    lastName: "Norris",
    assKickCount: "infinity",
  },
} satisfies PlaygroundPreset;
