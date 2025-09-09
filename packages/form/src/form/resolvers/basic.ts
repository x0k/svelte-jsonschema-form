import {
  getSimpleSchemaType,
  isFixedItems,
  type Validator,
} from "@/core/index.js";

import type { FormState } from '../state/index.js';
import type { ResolveFieldType } from "../fields.js";

export function resolver<T, V extends Validator>(
  _: FormState<T, V>
): ResolveFieldType {
  return ({ schema }) => {
    if (schema.oneOf !== undefined) {
      return "oneOfField";
    }
    if (schema.anyOf !== undefined) {
      return "anyOfField";
    }
    const type = getSimpleSchemaType(schema);
    if (type === "array") {
      return isFixedItems(schema) ? "tupleField" : "arrayField";
    }
    return `${type}Field`;
  };
}
