import type {
  PlaygroundPresetCategory,
  PlaygroundPreset,
} from "../playground-state.ts";

export const category: PlaygroundPresetCategory = "Schema Logic";

export default {
  schema: {
    type: "object",
    allOf: [
      {
        properties: {
          lorem: {
            type: ["string", "boolean"],
            default: true,
          },
        },
      },
      {
        properties: {
          lorem: {
            type: "boolean",
          },
          ipsum: {
            type: "string",
          },
        },
      },
    ],
  },
  uiSchema: {},
  initialValue: {},
} satisfies PlaygroundPreset;
