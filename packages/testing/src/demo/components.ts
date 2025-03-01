import { SvelteMap } from "svelte/reactivity";
import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const schema: Schema = {
  type: "object",
  title: "Title",
  description: "description",
  properties: {
    array: {
      type: "array",
      items: [
        {
          type: "string",
        },
      ],
      additionalItems: {
        type: "number",
      },
    },
  },
  additionalProperties: {
    type: "string",
  },
};

export const uiSchema: UiSchemaRoot = {
  array: {
    items: {
      "ui:options": {
        help: "test help",
      },
    },
  },
};

// export const errors = new SvelteMap([
//   [
//     "root",
//     [
//       {
//         instanceId: "root",
//         error: null,
//         message: "test error",
//         propertyTitle: "Title",
//       },
//     ],
//   ],
//   [
//     "root",
//     [
//       {
//         instanceId: "root",
//         error: null,
//         message: "test error 2",
//         propertyTitle: "Title",
//       },
//     ],
//   ],
// ]);
