import {
  getSchemaDefinitionByPath,
  type Path,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

export type FieldValue = SchemaValue | undefined;

export type FormValue = SchemaValue | undefined;

export interface ValuesRegistry {}

export type Resolvable<T> =
  | {
      [K in keyof ValuesRegistry]: T extends ValuesRegistry[K] ? K : never;
    }[keyof ValuesRegistry]
  | T;

export const DEFAULT_BOOLEAN_ENUM = [true, false];

export function resolveValue<T>(
  registry: ValuesRegistry,
  val: Resolvable<T>
): T extends string | undefined ? never : T {
  if (typeof val === "string") {
    return registry[val as keyof ValuesRegistry];
  }
  return val as T extends string | undefined ? never : T;
}

export function getRootSchemaTitleByPath(
  rootSchema: Schema,
  path: Path
): string | undefined {
  const def = getSchemaDefinitionByPath(rootSchema, rootSchema, path);
  return typeof def === "object" ? def.title : undefined;
}
