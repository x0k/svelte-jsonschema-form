import type { FromSchema } from "json-schema-to-ts";
import type { Schema } from "@sjsf/form";

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

export type CreatePost = FromSchema<typeof schema>;
