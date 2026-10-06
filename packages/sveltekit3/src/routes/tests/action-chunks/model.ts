import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const schema: Schema = {
  title: "Action chunks",
  type: "object",
  required: ["firstName"],
  properties: {
    // Correlation key: the store picks a submission by its `firstName`.
    firstName: { type: "string", title: "First name" },
    // Untyped: the state holds a raw `File`, so the replacer must emit a
    // marker plus a file part, and the reviver must resolve them.
    attachment: { title: "Attachment" },
  },
};

export const uiSchema: UiSchemaRoot = {
  attachment: { "ui:components": { unknownField: "unknownNativeFileField" } },
};
