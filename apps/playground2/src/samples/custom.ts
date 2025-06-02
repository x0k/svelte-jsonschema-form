import type { Sample } from "@/shared/index.js";

export default {
  schema: {
    title: "Custom components",
    type: "object",
    properties: {
      field: {
        title: "Custom field",
        type: "object",
        required: ["lat", "lon"],
        properties: {
          lat: {
            type: "number",
          },
          lon: {
            type: "number",
          },
        },
      },
      layout: {
        title: "Array with custom layout",
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
  uiSchema: {
    field: {
      "ui:components": {
        objectField: "geoField",
      },
    },
    layout: {
      "ui:components": {
        layout: "customLayout",
      },
    },
  },
  formData: {
    field: {
      lat: 0,
      lon: 0,
    },
    layout: ["svelte", "jsonschema", "form", "array", "of", "strings"],
  },
} satisfies Sample;
