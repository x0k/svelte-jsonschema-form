import type { Ref } from '@/lib/svelte.svelte.js';
import {
  getSchemaDefinitionByPath,
  type Path,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

export type FieldValue = SchemaValue | undefined;

export type FormValue = SchemaValue | undefined;

// TODO: Remove in v4
/** @deprecated use `Ref` from `lib/types` */
export type ValueRef<T> = Ref<T>

export const DEFAULT_BOOLEAN_ENUM = [true, false];

export function getRootSchemaTitleByPath(
  rootSchema: Schema,
  path: Path
): string | undefined {
  const def = getSchemaDefinitionByPath(rootSchema, rootSchema, path);
  return typeof def === "object" ? def.title : undefined;
}
