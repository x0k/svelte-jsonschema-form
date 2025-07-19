import {
  getSchemaDefinitionByPath,
  type Path,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

export type FieldValue = SchemaValue | undefined;

export type FormValue = SchemaValue | undefined;

export interface ValueRef<T> {
  current: T;
}

export const DEFAULT_BOOLEAN_ENUM = [true, false];

export function getRootSchemaTitleByPath(
  rootSchema: Schema,
  path: Path
): string | undefined {
  const def = getSchemaDefinitionByPath(rootSchema, rootSchema, path);
  return typeof def === "object" ? def.title : undefined;
}
