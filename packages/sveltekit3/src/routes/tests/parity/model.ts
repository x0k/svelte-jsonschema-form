import type { Schema, UiSchemaRoot } from "@sjsf/form";

/**
 * Every field here is a place the two submission paths can disagree.
 *
 * With JS, `connect()` sends the state as `JSON.stringify` chunks. Without it,
 * the browser posts real parts and every value goes through
 * `convertFormDataEntry`, which coerces `""` to `undefined`, `"on"` to `true`,
 * `parseInt`, enum lookups, and `File` to a data URL. `JSON.parse` needs none of
 * that, so each coercion is a candidate.
 *
 * Both routes render this schema, so a disagreement fails on one side only.
 */
export const schema: Schema = {
  title: "Submission parity",
  description: "Every field is a known JSON/FormData divergence.",
  type: "object",
  required: ["firstName"],
  // Awkward keys on purpose: FormData has to encode these into an input `name`
  // and decode them again, where the JSON path carries them verbatim.
  additionalProperties: { type: "string" },
  properties: {
    // Correlation key: the store picks a submission by its `firstName`.
    firstName: { type: "string", title: "First name", minLength: 2 },
    // Optional and left blank: JSON drops the key, FormData sends `""`.
    lastName: { type: "string", title: "Last name" },
    // `parseInt` accepts `"12abc"`; `JSON.parse` does not.
    age: { type: "integer", title: "Age" },
    // `parseFloat` accepts `"1e3"`.
    score: { type: "number", title: "Score" },
    // Unchecked sends no part at all; the JSON path carries `false`.
    agree: { type: "boolean", title: "Agree" },
    // `"true"` in a boolean field.
    newsletter: { type: "boolean", title: "Newsletter", enum: [true, false] },
    // An unmatched value throws here rather than reaching the validator.
    color: { type: "string", title: "Color", enum: ["red", "green", "blue"] },
    // Repeated keys, and no keys at all when nothing is picked.
    tags: {
      type: "array",
      title: "Tags",
      items: { type: "string", title: "Tag" },
    },
    // `null` against `type: ["string", "null"]`.
    nickname: { type: ["string", "null"], title: "Nickname" },
    // Nested: flattened to `profile.city` on the FormData path.
    profile: {
      type: "object",
      title: "Profile",
      properties: {
        city: { type: "string", title: "City" },
        zip: { type: "string", title: "Zip" },
      },
    },
    // `format: "data-url"`, where `File` becomes a data URL.
    avatar: { type: "string", title: "Avatar", format: "data-url" },
    // Untyped: `File` stays a `File`, and an empty input arrives zero-byte.
    attachment: { title: "Attachment" },
  },
};

export const uiSchema: UiSchemaRoot = {
  "ui:options": {
    form: {
      enctype: "multipart/form-data",
      method: "POST",
      action: "?/first",
    },
  },
  newsletter: { "ui:components": { booleanField: "booleanSelectField" } },
  color: { "ui:components": { stringField: "enumField" } },
  // `tags` keeps the default `arrayField`: `arrayTagsField` is an extra
  // component rather than an action field, so it cannot replace one.
  avatar: { "ui:components": { stringField: "fileField" } },
  attachment: { "ui:components": { unknownField: "unknownNativeFileField" } },
};
