import type { Schema, UiSchemaRoot } from "@sjsf/form";

/**
 * Every field here exercises a coercion in `convertFormDataEntry` — `""` to
 * `undefined`, `"on"` to `true`, `parseInt`, enum lookups, `File` to a data
 * URL — or a parser branch both submission paths share, since both now send the
 * same parts. A row that disagrees fails on one side only.
 */
export const schema: Schema = {
  title: "Submission parity",
  description: "Every field exercises a FormData coercion or parser branch.",
  type: "object",
  required: ["firstName"],
  // Awkward keys on purpose: encoded into an input `name` and decoded again
  // on the server.
  additionalProperties: { type: "string" },
  // Reached by the same machinery but through a different branch of the parser,
  // so it is covered separately.
  patternProperties: { "^tag-": { type: "string" } },
  properties: {
    // Correlation key: the store picks a submission by its `firstName`.
    firstName: { type: "string", title: "First name", minLength: 2 },
    // Optional and left blank: submitted as `""`, dropped by the converter.
    lastName: { type: "string", title: "Last name" },
    // `parseInt` accepts `"12abc"`; `JSON.parse` does not.
    age: { type: "integer", title: "Age" },
    // `parseFloat` accepts `"1e3"`.
    score: { type: "number", title: "Score" },
    // Unchecked sends no part at all; the server answers `false`.
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
    // Nested: flattened to `profile.city` parts.
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
