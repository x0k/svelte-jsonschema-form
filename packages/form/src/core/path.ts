import { resolveRef } from "./definitions.js";
import { isSchema, type Schema, type SchemaDefinition } from "./schema.js";
import { getSimpleSchemaType } from "./type.js";

export type Path = Array<string | number>;

/**
 * `patternProperties` keyword is ignored
 */
export function getSchemaDefinitionByPath(schema: Schema, path: Path) {
  return internalGetSchemaDefinitionByPath(schema, schema, path);
}

function internalGetSchemaDefinitionByPath(
  rootSchema: Schema,
  schema: SchemaDefinition | undefined,
  path: Path
): SchemaDefinition | undefined {
  for (let i = 0; i < path.length; i++) {
    if (schema === undefined || !isSchema(schema)) {
      return undefined;
    }
    if (schema.$ref) {
      return internalGetSchemaDefinitionByPath(
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
        def = internalGetSchemaDefinitionByPath(rootSchema, subSchema, slice);
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
    const k = path[i];
    const type = getSimpleSchemaType(schema);
    if (type === "array") {
      const { items, additionalItems }: Schema = schema;
      schema =
        (Array.isArray(items) ? items[k as number] : items) ?? additionalItems;
      continue;
    }
    if (type === "object") {
      const { properties, additionalProperties }: Schema = schema;
      schema = (properties && properties[k as string]) ?? additionalProperties;
      continue;
    }
    return undefined;
  }
  return schema;
}
