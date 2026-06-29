import {
  getSimpleSchemaType,
  isFileSchema,
  isFixedItems,
} from "@/core/index.js";

import type { ResolveFieldType } from "../fields.js";
import {
  isCycleRef,
  isFilesArray,
  isMultiSelect,
  isSelect,
  retrieveUiOption,
  type FormState,
} from "../state/index.js";
import "../extra-fields/enum.js";
import "../extra-fields/multi-enum.js";
import "../extra-fields/file.js";
import "../extra-fields/files.js";

export function resolver<T>(ctx: FormState<T>): ResolveFieldType {
  return (config) => {
    const { schema } = config;
    if (isCycleRef(ctx, config)) {
      return "expandField";
    }
    if (isSelect(ctx, schema)) {
      return "enumField";
    }
    if (schema.oneOf !== undefined) {
      return "oneOfField";
    }
    if (schema.anyOf !== undefined) {
      return "anyOfField";
    }
    const type = getSimpleSchemaType(schema);
    if (type === "array") {
      if (isMultiSelect(ctx, schema)) {
        return "multiEnumField";
      }
      if (isFixedItems(schema)) {
        return "tupleField";
      }
      if (
        isFilesArray(ctx, schema) &&
        retrieveUiOption(ctx, config, "orderable") !== true
      ) {
        return "filesField";
      }
      return "arrayField";
    }
    if (isFileSchema(schema)) {
      return "fileField";
    }
    return `${type}Field`;
  };
}
