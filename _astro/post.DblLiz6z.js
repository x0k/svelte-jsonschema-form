var e=`import type { Schema, UiSchema } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

export const schema = {
  title: "Post",
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
    },
    content: {
      title: "Content",
      type: "string",
      minLength: 5,
    },
  },
  required: ["title", "content"],
} as const satisfies Schema;

export type Model = FromSchema<typeof schema>;

export const uiSchema: UiSchema = {
  content: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
  },
};
`;export{e as t};