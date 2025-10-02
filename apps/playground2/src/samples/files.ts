import type { Sample } from "@/core/index.js";

export default {
  resolver: "compat",
  schema: {
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
  },
  uiSchema: {
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
  },
  initialValue: {},
} satisfies Sample;
