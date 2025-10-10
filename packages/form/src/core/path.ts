import {
  isSchemaObject,
  SET_OF_ARRAYS_OF_SUB_SCHEMAS,
  type SubSchemasArrayKey,
} from "@/lib/json-schema/index.js";
import { isRecord } from "@/lib/object.js";

import { resolveRef } from "./definitions.js";
import {
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
} from "./schema.js";
import type { Validator } from "./validator.js";
import type { Merger } from "./merger.js";
import { getClosestMatchingOption } from "./matching.js";
import { getDiscriminatorFieldFromSchema } from "./discriminator.js";
import { isSchemaArrayValue, isSchemaObjectValue } from "./value.js";

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

// TODO: Use value to infer schema correctly
export function getSchemaDefinitionByPath(
  rootSchema: Schema,
  schema: SchemaDefinition | undefined,
  path: RPath
): SchemaDefinition | undefined {
  function pickSubSchema(subSchemas: SchemaDefinition[], subPath: RPath) {
    let def: SchemaDefinition | undefined;
    let lastBool: boolean | undefined;
    for (const subSchema of subSchemas) {
      if (!isSchemaObject(subSchema)) {
        continue;
      }
      def = getSchemaDefinitionByPath(rootSchema, subSchema, subPath);
      if (def === undefined) {
        continue;
      }
      if (isSchemaObject(def)) {
        return def;
      }
      lastBool = def;
    }
    return lastBool;
  }

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
      const subSchema = pickSubSchema(alt, path.slice(i));
      if (subSchema !== undefined) {
        return subSchema;
      }
      // Alt schema may be mixed with normal schema so
      // no early exit here
    }
    const k = path[i]!;
    const type = typeof k;
    if (type === "number") {
      const { items, additionalItems }: Schema = schema;
      schema =
        (Array.isArray(items) ? items[k as number] : items) ?? additionalItems;
      continue;
    }
    if (type === "string") {
      const {
        properties,
        patternProperties,
        additionalProperties,
        dependencies,
        then,
        else: otherwise,
      }: Schema = schema;
      schema =
        (properties && properties[k as string]) ??
        (patternProperties &&
          Object.entries(patternProperties).find(([p]) =>
            new RegExp(p).test(k as string)
          )?.[1]) ??
        additionalProperties ??
        (dependencies &&
          pickSubSchema(
            Object.values(dependencies).filter(isRecord),
            path.slice(i)
          )) ??
        ((then || otherwise) &&
          pickSubSchema([then, otherwise].filter(isRecord), path.slice(i)));
      continue;
    }
    return undefined;
  }
  return schema;
}

export function getSchemaDefinitionByPath2(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  schema: SchemaDefinition | undefined,
  value: SchemaValue | undefined,
  path: RPath
) {
  function pickSubSchema(
    schemaDefs: SchemaDefinition[],
    schema: Schema,
    value: SchemaValue | undefined,
    path: RPath
  ) {
    const schemas: Schema[] = schemaDefs.map((s) =>
      typeof s === "boolean" ? (s ? {} : { not: {} }) : s
    );

    const index = getClosestMatchingOption(
      validator,
      merger,
      rootSchema,
      value,
      schemas,
      -1,
      getDiscriminatorFieldFromSchema(schema)
    );

    return getSchemaDefinition(schemas[index], value, path);
  }

  function getSchemaDefinition(
    schema: SchemaDefinition | undefined,
    value: SchemaValue | undefined,
    path: RPath
  ): SchemaDefinition | undefined {
    for (let i = 0; i < path.length; i++) {
      if (schema === undefined || !isSchemaObject(schema)) {
        return undefined;
      }
      if (schema.$ref) {
        return getSchemaDefinition(
          resolveRef(schema.$ref, rootSchema),
          value,
          path.slice(i)
        );
      }
      if (schema.allOf) {
        return getSchemaDefinition(
          merger.mergeAllOf(schema),
          value,
          path.slice(i)
        );
      }
      const alt = schema.anyOf ?? schema.oneOf;
      if (alt) {
        const subSchema = pickSubSchema(alt, schema, value, path.slice(i));
        if (subSchema !== undefined) {
          return subSchema;
        }
        // Alt schema may be mixed with normal schema so
        // no early exit here
      }
      const k = path[i]!;
      const type = typeof k;
      if (type === "number") {
        const { items, additionalItems }: Schema = schema;
        schema =
          (Array.isArray(items) ? items[k as number] : items) ??
          additionalItems;
        value = isSchemaArrayValue(value) ? value[k as number] : undefined;
        continue;
      }
      if (type === "string") {
        const {
          properties,
          patternProperties,
          additionalProperties,
          dependencies,
          then,
          else: otherwise,
        }: Schema = schema;
        schema =
          (properties && properties[k as string]) ??
          (patternProperties &&
            Object.entries(patternProperties).find(([p]) =>
              new RegExp(p).test(k as string)
            )?.[1]) ??
          additionalProperties ??
          (dependencies &&
            pickSubSchema(
              Object.values(dependencies).filter(isRecord),
              schema,
              value,
              path.slice(i)
            )) ??
          ((then || otherwise) &&
            pickSubSchema(
              [then, otherwise].filter(isRecord),
              schema,
              value,
              path.slice(i)
            ));
        value = isSchemaObjectValue(value) ? value[k] : undefined;
        continue;
      }
      return undefined;
    }
    return schema;
  }
  return getSchemaDefinition(schema, value, path);
}
