import { getSimpleSchemaType, isFixedItems } from "@/core/index.js";

import type { ResolveFieldType } from "../fields.js";
import { isCycleRef, type FormState } from "../state/index.js";

export function resolver<T>(ctx: FormState<T>): ResolveFieldType {
  return (config) => {
    const { schema } = config;
    if (isCycleRef(ctx, config)) {
      return "expandField";
    }
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
