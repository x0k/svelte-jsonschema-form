import type { FormContext } from "../../context";
import {
  type Schema,
  isFilesArray as isFilesArrayInternal,
} from "../../schema";

export function isFilesArray(ctx: FormContext<unknown>, schema: Schema) {
  return isFilesArrayInternal(ctx.validator, schema, ctx.schema);
}
