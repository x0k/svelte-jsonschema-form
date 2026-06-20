import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
  jsonSchema,
  jsonUiSchema,
  jsonValue,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  schemaFormat: "json-schema",
  draft2020: false,
  title: "Files",
  description: "File upload handling with native file picker array widgets.",
  tags: [PresetTag.Array, PresetTag.Widget],
});

export default definePreset({
  resolver: "compat",
  schema: jsonSchema({
    title: "Files",
    type: "object",
    properties: {
      file: {
        type: "string",
        format: "data-url",
        title: "Single file",
      },
      filesAccept: {
        type: "string",
        format: "data-url",
        title: "Single File with Accept attribute",
      },
      files: {
        type: "array",
        title: "Multiple files",
        items: {
          type: "string",
          format: "data-url",
        },
      },
      orderableFiles: {
        type: "array",
        title: "Multiple files with order",
        items: {
          type: "string",
          format: "data-url",
        },
      },
      nativeFile: {
        title: "Native file",
      },
      nativeFiles: {
        type: "array",
        title: "Multiple native files",
        items: {},
      },
      orderableNativeFiles: {
        type: "array",
        title: "Multiple native files with order",
        items: {},
      },
    },
  }),
  uiSchema: jsonUiSchema({
    filesAccept: {
      "ui:options": {
        file: {
          accept: ".pdf",
        },
        flowbite3File: {
          accept: ".pdf",
        },
      },
    },
    orderableFiles: {
      "ui:options": {
        orderable: true,
      },
    },
    nativeFile: {
      "ui:components": {
        unknownField: "unknownNativeFileField",
      },
    },
    nativeFiles: {
      "ui:components": {
        arrayField: "arrayNativeFilesField",
      },
    },
    orderableNativeFiles: {
      items: {
        "ui:components": {
          unknownField: "unknownNativeFileField",
        },
      },
    },
  }),
  initialValue: jsonValue({}),
});
