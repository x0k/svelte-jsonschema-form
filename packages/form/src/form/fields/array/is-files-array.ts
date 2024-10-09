import { type Schema, isFilesArray as isFilesArrayInternal } from "@/core/schema/index.js";

import type { FormContext } from "../../context.js";

export function isFilesArray(ctx: FormContext, schema: Schema) {
  return isFilesArrayInternal(ctx.validator, schema, ctx.schema);
}
