import { resolveRef } from "./definitions.js";
import {
  isSchema,
  SET_OF_ARRAYS_OF_SUB_SCHEMAS,
  type Schema,
  type SchemaDefinition,
  type SubSchemasArrayKey,
} from "./schema.js";
import { getSimpleSchemaType } from "./type.js";

export type Path = Array<string | number>;

export function partsToPath(parts: string[]): Path {
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

export function refToPath(ref: string): Path {
  if (ref === "#") {
    return [];
  }
  // TODO: Handle escaped `/`
  const parts = ref.substring(2).split("/");
  return partsToPath(parts);
}

export function getSchemaDefinitionByPath(
  rootSchema: Schema,
  schema: SchemaDefinition | undefined,
  path: Path
): SchemaDefinition | undefined {
  for (let i = 0; i < path.length; i++) {
    if (schema === undefined || !isSchema(schema)) {
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
        if (!isSchema(subSchema)) {
          continue;
        }
        def = getSchemaDefinitionByPath(rootSchema, subSchema, slice);
        if (def === undefined) {
          continue;
        }
        if (isSchema(def)) {
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
