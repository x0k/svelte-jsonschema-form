import type {
  ArraySchemaTraverserContext,
  RecordSchemaTraverserContext,
  SchemaTraverserContext,
  SubSchemaTraverserContext,
} from "./schema-traverser.js";
import {
  type SchemaDefinition,
  type Schema,
  SUB_SCHEMAS,
  RECORDS_OF_SUB_SCHEMAS,
  ARRAYS_OF_SUB_SCHEMAS,
  isSchema,
  type SubSchemaKey,
  type SubSchemasArrayKey,
  type SubSchemasRecordKey,
} from "./schema.js";

export type TransformedSchema<R> = Omit<
  Schema,
  SubSchemaKey | SubSchemasArrayKey | SubSchemasRecordKey
> & {
  items?: R | R[] | undefined;
  additionalItems?: R | undefined;
  contains?: R | undefined;
  additionalProperties?: R | undefined;
  propertyNames?: R | undefined;
  if?: R | undefined;
  then?: R | undefined;
  else?: R | undefined;
  not?: R | undefined;
  // Records
  $defs?: Record<string, R> | undefined;
  properties?: Record<string, R> | undefined;
  patternProperties?: Record<string, R> | undefined;
  dependencies?: Record<string, R | string[]> | undefined;
  definitions?: Record<string, R> | undefined;
  // Arrays
  allOf?: R[] | undefined;
  anyOf?: R[] | undefined;
  oneOf?: R[] | undefined;
};

export type TransformedSchemaDefinition<R> = TransformedSchema<R> | boolean;

export function transformSchemaDefinition<R>(
  schema: SchemaDefinition,
  transform: (
    shallowCopy: TransformedSchemaDefinition<R>,
    ctx: SchemaTraverserContext
  ) => R,
  ctx: SchemaTraverserContext = { type: "root", path: [] }
): R {
  if (!isSchema(schema)) {
    return transform(schema, ctx);
  }
  const shallowCopy = {
    ...schema,
  } as TransformedSchema<R>;
  for (const key of ARRAYS_OF_SUB_SCHEMAS) {
    const array = schema[key];
    if (array === undefined || !Array.isArray(array)) {
      continue;
    }
    const c: ArraySchemaTraverserContext = {
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
  const map = new Map<string, R>();
  for (const key of RECORDS_OF_SUB_SCHEMAS) {
    const record = schema[key];
    if (record === undefined) {
      continue;
    }
    const c: RecordSchemaTraverserContext = {
      type: "record",
      parent: schema,
      key,
      property: "",
      path: ctx.path.concat(key, ""),
    };
    for (const [property, value] of Object.entries(record)) {
      if (Array.isArray(value)) {
        continue;
      }
      c.property = property;
      c.path[c.path.length - 1] = property;
      map.set(property, transformSchemaDefinition(value, transform, c));
    }
    shallowCopy[key] = Object.fromEntries(map);
    map.clear();
  }
  const c: SubSchemaTraverserContext = {
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
