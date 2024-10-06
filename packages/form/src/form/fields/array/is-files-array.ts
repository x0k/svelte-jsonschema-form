import { type Schema, isFilesArray as isFilesArrayInternal } from "@/core/schema";

import type { FormContext } from "../../context";

export function isFilesArray(ctx: FormContext, schema: Schema) {
  return isFilesArrayInternal(ctx.validator, schema, ctx.schema);
}
