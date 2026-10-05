import type { Schema, UiSchemaRoot } from "@sjsf/form";

/**
 * Every field here exists because the two submission paths disagree about it.
 *
 * With JavaScript, `connect()` serializes the form state with `JSON.stringify`
 * into hidden inputs, and the server reads them back with `JSON.parse`. Without
 * JavaScript the browser posts real parts, and the server runs each value
 * through `convertFormDataEntry`, which coerces: `""` to `undefined`,
 * `"on"` to `true`, `parseInt`, `parseFloat`, enum lookups, and a `File` to a
 * data URL. `JSON.parse` needs none of that, so any coercion is a place the two
 * paths can return different values for the same form.
 *
 * Both routes render this one schema, so a row that disagrees fails on exactly
 * one of them and the diff names the field.
 */
export const schema: Schema = {
  title: "Submission parity",
  description: "Every field is a known JSON/FormData divergence.",
  type: "object",
  required: ["firstName"],
  // Rows 19-20: keys the FormData path has to encode into an input `name` and
  // decode again, where the JSON path carries them verbatim.
  additionalProperties: { type: "string" },
  properties: {
    // The correlation key: the submission store is shared between the routes
    // and picks a submission by its `firstName`.
    firstName: { type: "string", title: "First name", minLength: 2 },
    // Rows 2-3: optional and left blank, where the JSON path drops the key
    // entirely and the FormData path sends `""`.
    lastName: { type: "string", title: "Last name" },
    // Rows 8-9: `parseInt` accepts `"12abc"`, `JSON.parse` does not.
    age: { type: "integer", title: "Age" },
    // Row 10: `parseFloat` accepts `"1e3"` and `"Infinity"`.
    score: { type: "number", title: "Score" },
    // Rows 4-5: an unchecked checkbox sends no part at all, where the JSON path
    // carries `false`.
    agree: { type: "boolean", title: "Agree" },
    // Row 6: `"true"` in a boolean field.
    newsletter: { type: "boolean", title: "Newsletter", enum: [true, false] },
    // Row 9: an unmatched enum value throws on the FormData path instead of
    // reaching the validator.
    color: { type: "string", title: "Color", enum: ["red", "green", "blue"] },
    // Rows 11-13: repeated keys, and no keys at all when nothing is picked.
    tags: {
      type: "array",
      title: "Tags",
      items: { type: "string", title: "Tag" },
    },
    // Rows 14-15: `null` against `type: ["string", "null"]`.
    nickname: { type: ["string", "null"], title: "Nickname" },
    // Row 13: a nested object, flattened to `profile.city` on the FormData path.
    profile: {
      type: "object",
      title: "Profile",
      properties: {
        city: { type: "string", title: "City" },
        zip: { type: "string", title: "Zip" },
      },
    },
    // Row 16: `format: "data-url"`, where `File` becomes a data URL.
    avatar: { type: "string", title: "Avatar", format: "data-url" },
    // Rows 17-18: an untyped property, where `File` stays a `File`, and an
    // empty file input arrives as a zero-byte `File`.
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
  // `arrayField` is left at its default: `arrayTagsField` is registered as an
  // extra component rather than an action field, so it cannot replace a field.
  avatar: { "ui:components": { stringField: "fileField" } },
  attachment: { "ui:components": { unknownField: "unknownNativeFileField" } },
};
