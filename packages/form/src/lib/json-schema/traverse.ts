import type {
  JSONSchema7 as Schema,
  JSONSchema7Definition as SchemaDefinition,
} from "json-schema";

import type { Visitor } from "@/lib/traverser.js";
import {
  isSchemaObject,
  isSubSchemaKey,
  isSubSchemasArrayKey,
  isSubSchemasRecordKey,
  type AnySubSchemaKey,
  type SubSchemaKey,
  type SubSchemasArrayKey,
  type SubSchemasRecordKey,
} from "@/lib/json-schema/index.js";

export type SchemaTraverserContextType = "array" | "record" | "sub" | "root";

export interface AbstractSchemaTraverserContext<
  T extends SchemaTraverserContextType,
  K extends AnySubSchemaKey,
> {
  type: T;
  path: SubSchemasArrayKey extends K ? Array<string | number> : string[];
}

export interface ArraySchemaTraverserContext<K extends AnySubSchemaKey>
  extends AbstractSchemaTraverserContext<"array", K> {
  parent: Schema;
  key: SubSchemasArrayKey & K;
  index: number;
}

export interface RecordSchemaTraverserContext<K extends AnySubSchemaKey>
  extends AbstractSchemaTraverserContext<"record", K> {
  parent: Schema;
  key: SubSchemasRecordKey & K;
  property: string;
}

export interface SubSchemaTraverserContext<K extends AnySubSchemaKey>
  extends AbstractSchemaTraverserContext<"sub", K> {
  parent: Schema;
  key: SubSchemaKey & K;
}
export interface RootSchemaTraverserContext<K extends AnySubSchemaKey>
  extends AbstractSchemaTraverserContext<"root", K> {}

export type SchemaTraverserContext<K extends AnySubSchemaKey> =
  | ArraySchemaTraverserContext<K>
  | RecordSchemaTraverserContext<K>
  | SubSchemaTraverserContext<K>
  | RootSchemaTraverserContext<K>;

export type SchemaDefinitionVisitor<K extends AnySubSchemaKey, R> = Visitor<
  SchemaDefinition,
  SchemaTraverserContext<K>,
  R
>;

export function makeSchemaDefinitionTraverser<
  const K extends AnySubSchemaKey,
  R,
>(keys: ReadonlyArray<K>, visitor: SchemaDefinitionVisitor<K, R>) {
  return function* traverse(
    schema: SchemaDefinition,
    ctx: SchemaTraverserContext<K> = { type: "root", path: [] }
  ): Generator<R> {
    if (visitor.onEnter) {
      yield* visitor.onEnter(schema, ctx);
    }
    if (isSchemaObject(schema)) {
      const fakeKey = "";
      const subCtx: SubSchemaTraverserContext<K> = {
        type: "sub",
        parent: schema,
        key: fakeKey as SubSchemaKey & K,
        // @ts-expect-error
        path: ctx.path.concat(fakeKey as SubSchemaKey),
      };
      const arrayCtx: ArraySchemaTraverserContext<K> = {
        type: "array",
        parent: schema,
        key: fakeKey as SubSchemasArrayKey & K,
        index: 0,
        // @ts-expect-error
        path: ctx.path.concat(fakeKey as SubSchemasArrayKey, 0),
      };
      const recordCtx: RecordSchemaTraverserContext<K> = {
        type: "record",
        parent: schema,
        key: fakeKey as SubSchemasRecordKey & K,
        property: "",
        // @ts-expect-error
        path: ctx.path.concat(fakeKey as SubSchemasRecordKey, ""),
      };
      for (const key of keys) {
        if (isSubSchemaKey(key)) {
          const value = schema[key];
          if (value === undefined || Array.isArray(value)) {
            continue;
          }
          subCtx.key = key;
          subCtx.path[subCtx.path.length - 1] = key;
          yield* traverse(value, subCtx);
        }
        if (isSubSchemasArrayKey(key)) {
          const array = schema[key];
          if (array === undefined || !Array.isArray(array)) {
            continue;
          }
          arrayCtx.key = key;
          arrayCtx.path[arrayCtx.path.length - 2] = key;
          for (let index = 0; index < array.length; index++) {
            arrayCtx.index = index;
            arrayCtx.path[arrayCtx.path.length - 1] = index;
            yield* traverse(array[index]!, arrayCtx);
          }
        }
        if (isSubSchemasRecordKey(key)) {
          const record = schema[key];
          if (record === undefined) {
            continue;
          }
          recordCtx.key = key;
          recordCtx.path[recordCtx.path.length - 2] = key;
          for (const property of Object.keys(record)) {
            const value = record[property];
            if (value === undefined || Array.isArray(value)) {
              continue;
            }
            recordCtx.property = property;
            recordCtx.path[recordCtx.path.length - 1] = property;
            yield* traverse(value, recordCtx);
          }
        }
      }
    }
    if (visitor.onLeave) {
      yield* visitor.onLeave(schema, ctx);
    }
  };
}
