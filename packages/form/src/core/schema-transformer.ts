import type {
  ArraySchemaTraverserContext,
  RecordSchemaTraverserContext,
  SchemaTraverserContext,
  SubSchemaTraverserContext,
} from "./schema-traverser.js";
import {
  type SchemaDefinition,
  SUB_SCHEMAS,
  RECORDS_OF_SUB_SCHEMAS,
  ARRAYS_OF_SUB_SCHEMAS,
  isSchema,
  type SchemaKey,
  type TransformedSchemaDefinition,
  type TransformedSchema,
  type Schema,
} from "./schema.js";

export function transformSchemaDefinition<R>(
  schema: SchemaDefinition,
  transform: (
    shallowCopy: TransformedSchemaDefinition<R, Schema>,
    ctx: SchemaTraverserContext<SchemaKey>
  ) => R,
  ctx: SchemaTraverserContext<SchemaKey> = { type: "root", path: [] }
): R {
  if (!isSchema(schema)) {
    return transform(schema, ctx);
  }
  const shallowCopy = {
    ...schema,
  } as TransformedSchema<R, Schema>;
  for (const key of ARRAYS_OF_SUB_SCHEMAS) {
    const array = schema[key];
    if (array === undefined || !Array.isArray(array)) {
      continue;
    }
    const c: ArraySchemaTraverserContext<SchemaKey> = {
      type: "array",
      parent: schema,
      key,
      index: 0,
      path: ctx.path.concat(key, 0),
    };
    shallowCopy[key] = array.map((item, index) => {
      c.index = index;
      c.path[c.path.length - 1] = index;
      return transformSchemaDefinition(item, transform, c);
    });
  }
  const map = new Map<string, R | string[]>();
  for (const key of RECORDS_OF_SUB_SCHEMAS) {
    const record = schema[key];
    if (record === undefined) {
      continue;
    }
    const c: RecordSchemaTraverserContext<SchemaKey> = {
      type: "record",
      parent: schema,
      key,
      property: "",
      path: ctx.path.concat(key, ""),
    };
    const keys = Object.keys(record);
    const keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
      const property = keys[i]!;
      const value = record[property]!;
      if (Array.isArray(value)) {
        map.set(property, value);
        continue;
      }
      c.property = property;
      c.path[c.path.length - 1] = property;
      map.set(property, transformSchemaDefinition(value, transform, c));
    }
    shallowCopy[key] = Object.fromEntries(map) as Record<string, R>;
    map.clear();
  }
  const c: SubSchemaTraverserContext<SchemaKey> = {
    type: "sub",
    parent: schema,
    key: "items",
    path: ctx.path.concat(""),
  };
  for (const key of SUB_SCHEMAS) {
    const value = schema[key];
    if (value === undefined || Array.isArray(value)) {
      continue;
    }
    c.key = key;
    c.path[c.path.length - 1] = key;
    shallowCopy[key] = transformSchemaDefinition(value, transform, c);
  }
  return transform(shallowCopy, ctx);
}
