export const FIELDS = {
  "any-of": {
    "name": "anyOfField",
    "filename": "any-of",
    "wrapperOf": "combination"
  },
  "boolean": {
    "name": "booleanField",
    "filename": "boolean",
    "wrapperOf": "field-base"
  },
  "integer": {
    "name": "integerField",
    "filename": "integer",
    "wrapperOf": "field-base"
  },
  "null": {
    "name": "nullField",
    "filename": "null",
    "wrapperOf": null
  },
  "number-field": {
    "name": "numberField",
    "filename": "number-field",
    "wrapperOf": "field-base"
  },
  "one-of": {
    "name": "oneOfField",
    "filename": "one-of",
    "wrapperOf": "combination"
  },
  "string": {
    "name": "stringField",
    "filename": "string",
    "wrapperOf": "field-base"
  },
  "unknown": {
    "name": "unknownField",
    "filename": "unknown",
    "wrapperOf": null
  },
  "array-field": {
    "name": "arrayField",
    "filename": "array-field",
    "wrapperOf": "array-base"
  },
  "array-item-field": {
    "name": "arrayItemField",
    "filename": "array-item-field",
    "wrapperOf": null
  },
  "tuple-field": {
    "name": "tupleField",
    "filename": "tuple-field",
    "wrapperOf": "array-base"
  },
  "object-field": {
    "name": "objectField",
    "filename": "object-field",
    "wrapperOf": null
  },
  "object-property-field": {
    "name": "objectPropertyField",
    "filename": "object-property-field",
    "wrapperOf": null
  }
} as const;

export const EXTRA_FIELDS = {
  "aggregated": {
    "name": "aggregatedField",
    "filename": "aggregated",
    "wrapperOf": null
  },
  "array-files": {
    "name": "arrayFilesField",
    "filename": "array-files",
    "wrapperOf": "files"
  },
  "array-native-files": {
    "name": "arrayNativeFilesField",
    "filename": "array-native-files",
    "wrapperOf": "native-files"
  },
  "array-tags": {
    "name": "arrayTagsField",
    "filename": "array-tags",
    "wrapperOf": "tags"
  },
  "boolean-select": {
    "name": "booleanSelectField",
    "filename": "boolean-select",
    "wrapperOf": null
  },
  "enum": {
    "name": "enumField",
    "filename": "enum",
    "wrapperOf": null
  },
  "file": {
    "name": "fileField",
    "filename": "file",
    "wrapperOf": null
  },
  "files": {
    "name": "filesField",
    "filename": "files",
    "wrapperOf": null
  },
  "multi-enum": {
    "name": "multiEnumField",
    "filename": "multi-enum",
    "wrapperOf": null
  },
  "native-file": {
    "name": "nativeFileField",
    "filename": "native-file",
    "wrapperOf": null
  },
  "native-files": {
    "name": "nativeFilesField",
    "filename": "native-files",
    "wrapperOf": null
  },
  "object-key-enum": {
    "name": "objectKeyEnumField",
    "filename": "object-key-enum",
    "wrapperOf": null
  },
  "remote-enum": {
    "name": "remoteEnumField",
    "filename": "remote-enum",
    "wrapperOf": null
  },
  "tags": {
    "name": "tagsField",
    "filename": "tags",
    "wrapperOf": null
  },
  "unknown-native-file": {
    "name": "unknownNativeFileField",
    "filename": "unknown-native-file",
    "wrapperOf": "native-file"
  }
} as const;
