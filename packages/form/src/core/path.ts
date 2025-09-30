import {
  isSchemaObject,
  SET_OF_ARRAYS_OF_SUB_SCHEMAS,
  type SubSchemasArrayKey,
} from "@/lib/json-schema/index.js";

import { resolveRef } from "./definitions.js";
import { type Schema, type SchemaDefinition } from "./schema.js";
import { getSimpleSchemaType } from "./type.js";

export type Path = Array<string | number>;
export type RPath = Readonly<Path>;

function toParts(ref: string): string[] {
  return ref
    .split("/")
    .slice(1)
    .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
}

export function pathFromRef(ref: string): Path {
  if (ref === "#") {
    return [];
  }
  const parts = toParts(ref);
  let parentIsArrayOfSubSchemas = false;
  return parts.map((p) => {
    if (parentIsArrayOfSubSchemas) {
      const num = Number(p);
      if (Number.isInteger(num) && num >= 0) {
        parentIsArrayOfSubSchemas = false;
        return num;
      }
    }
    parentIsArrayOfSubSchemas = SET_OF_ARRAYS_OF_SUB_SCHEMAS.has(
      p as SubSchemasArrayKey
    );
    return p;
  });
}

export function pathFromLocation(location: string, data: unknown): Path {
  const path: Path = [];
  if (location === "") {
    return path;
  }
  const parts = toParts(location);
  let current: any = data;
  for (const p of parts) {
    if (Array.isArray(current) && /^\d+$/.test(p)) {
      const idx = Number(p);
      path.push(idx);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      current = current[idx];
    } else {
      path.push(p);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      current = current?.[p];
    }
  }
  return path;
}

export function getSchemaDefinitionByPath(
  rootSchema: Schema,
  schema: SchemaDefinition | undefined,
  path: RPath
): SchemaDefinition | undefined {
  for (let i = 0; i < path.length; i++) {
    if (schema === undefined || !isSchemaObject(schema)) {
      return undefined;
    }
    if (schema.$ref) {
      return getSchemaDefinitionByPath(
        rootSchema,
        resolveRef(schema.$ref, rootSchema),
        path.slice(i)
      );
    }
    const alt = schema.anyOf ?? schema.oneOf ?? schema.allOf;
    if (alt) {
      const slice = path.slice(i);
      let def: SchemaDefinition | undefined;
      let lastBool: boolean | undefined;
      for (const subSchema of alt) {
        if (!isSchemaObject(subSchema)) {
          continue;
        }
        def = getSchemaDefinitionByPath(rootSchema, subSchema, slice);
        if (def === undefined) {
          continue;
        }
        if (isSchemaObject(def)) {
          return def;
        }
        lastBool = def;
      }
      if (lastBool !== undefined) {
        return lastBool;
      }
      // Alt schema may be mixed with normal schema so
      // no early exit here
    }
    const k = path[i]!;
    const type = getSimpleSchemaType(schema);
    if (type === "array") {
      const { items, additionalItems }: Schema = schema;
      schema =
        (Array.isArray(items) ? items[k as number] : items) ?? additionalItems;
      continue;
    }
    if (type === "object") {
      const { properties, patternProperties, additionalProperties }: Schema =
        schema;
      schema =
        (properties && properties[k as string]) ??
        (patternProperties &&
          Object.entries(patternProperties).find(([p]) =>
            new RegExp(p).test(k as string)
          )?.[1]) ??
        additionalProperties;
      continue;
    }
    return undefined;
  }
  return schema;
}
