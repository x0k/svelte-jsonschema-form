import {
  type SubSchemasArrayKey,
  type SchemaDefinition,
  type SubSchemaKey,
  ARRAYS_OF_SUB_SCHEMAS,
  RECORDS_OF_SUB_SCHEMAS,
  SUB_SCHEMAS,
  isSchema,
  type SubSchemasRecordKey,
  type Schema,
} from "./schema.js";
import type { Visitor } from "./traverser.js";
import type { Path } from "./path.js";

export type SchemaTraverserContextType = "array" | "record" | "sub" | "root";

export interface AbstractSchemaTraverserContext<
  T extends SchemaTraverserContextType,
> {
  type: T;
  path: Path;
}

export interface ArraySchemaTraverserContext
  extends AbstractSchemaTraverserContext<"array"> {
  parent: Schema
  key: SubSchemasArrayKey;
  index: number;
}

export interface RecordSchemaTraverserContext
  extends AbstractSchemaTraverserContext<"record"> {
  parent: Schema
  key: SubSchemasRecordKey;
  property: string;
}

export interface SubSchemaTraverserContext
  extends AbstractSchemaTraverserContext<"sub"> {
  parent: Schema
  key: SubSchemaKey;
}

export interface RootSchemaTraverserContext
  extends AbstractSchemaTraverserContext<"root"> {}

export type SchemaTraverserContext =
  | ArraySchemaTraverserContext
  | RecordSchemaTraverserContext
  | SubSchemaTraverserContext
  | RootSchemaTraverserContext;

export type SchemaDefinitionVisitor<R> = Visitor<
  SchemaDefinition,
  SchemaTraverserContext,
  R
>;

export function* traverseSchemaDefinition<R>(
  schema: SchemaDefinition,
  visitor: SchemaDefinitionVisitor<R>,
  ctx: SchemaTraverserContext = { type: "root", path: [] }
): Generator<R> {
  if (visitor.onEnter) {
    yield* visitor.onEnter(schema, ctx);
  }
  if (isSchema(schema)) {
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
      for (let index = 0; index < array.length; index++) {
        c.index = index;
        c.path[c.path.length - 1] = index;
        yield* traverseSchemaDefinition(array[index]!, visitor, c);
      }
    }
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
      for (const property of Object.keys(record)) {
        const value = record[property];
        if (value === undefined || Array.isArray(value)) {
          continue;
        }
        c.property = property;
        c.path[c.path.length - 1] = property;
        yield* traverseSchemaDefinition(value, visitor, c);
      }
    }
    const c: SubSchemaTraverserContext = {
      type: "sub",
      parent: schema,
      key: "additionalItems",
      path: ctx.path.concat(""),
    };
    for (const key of SUB_SCHEMAS) {
      const value = schema[key];
      if (value === undefined || Array.isArray(value)) {
        continue;
      }
      c.key = key;
      c.path[c.path.length - 1] = key;
      yield* traverseSchemaDefinition(value, visitor, c);
    }
  }
  if (visitor.onLeave) {
    yield* visitor.onLeave(schema, ctx);
  }
}
