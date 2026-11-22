import {
  getSimpleSchemaType,
  getXxxOfKey,
  isFilesArraySchema,
  isFileSchema,
  isFixedItemsSchema,
  isMultiSelectSchema,
  isSelectSchema,
  isUnionSchema,
} from "#core/index.js";

import type { ResolveFieldType } from "../fields.js";
import {
  isCycleRef,
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
    if (isSelectSchema(ctx, schema)) {
      return "enumField";
    }
    if (isUnionSchema(schema)) {
      return "unionField";
    }
    const xxxOfKey = getXxxOfKey(schema);
    if (xxxOfKey !== undefined) {
      return `${xxxOfKey}Field`;
    }
    const type = getSimpleSchemaType(schema);
    if (type === "array") {
      if (isMultiSelectSchema(ctx, schema)) {
        return "multiEnumField";
      }
      if (isFixedItemsSchema(schema)) {
        return "tupleField";
      }
      if (
        isFilesArraySchema(ctx, schema) &&
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
