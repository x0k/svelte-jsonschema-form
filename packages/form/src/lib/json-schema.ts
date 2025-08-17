import type { JSONSchema7Definition } from "json-schema";

import { isEmptyRecord } from "@/lib/object.js";

export function isSchemaObject<D extends JSONSchema7Definition>(
  schemaDef: D
): schemaDef is Exclude<D, boolean> {
  return typeof schemaDef === "object";
}

export function isAllowAnySchema(
  def: JSONSchema7Definition
): def is true | Record<string, never> {
  return isSchemaObject(def) ? isEmptyRecord(def) : def === true;
}
