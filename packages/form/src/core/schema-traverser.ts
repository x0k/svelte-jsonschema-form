import {
  type SubSchemasArrayKey,
  type SchemaDefinition,
  type SubSchemaKey,
  ARRAYS_OF_SUB_SCHEMAS,
  RECORDS_OF_SUB_SCHEMAS,
  SUB_SCHEMAS,
  isSchema,
  type SubSchemasRecordKey,
} from "./schema.js";

export interface Visitor<Node, Context> {
  onEnter?: (node: Node, ctx: Context) => void;
  onLeave?: (node: Node, ctx: Context) => void;
}

export type SchemaTraverserContextType = "array" | "record" | "sub" | "root";

export interface AbstractSchemaTraverserContext<
  T extends SchemaTraverserContextType,
> {
  type: T;
}

export interface ArraySchemaTraverserContext
  extends AbstractSchemaTraverserContext<"array"> {
  key: SubSchemasArrayKey;
  index: number;
}

export interface RecordSchemaTraverserContext
  extends AbstractSchemaTraverserContext<"record"> {
  key: SubSchemasRecordKey;
  property: string;
}

export interface SubSchemaTraverserContext
  extends AbstractSchemaTraverserContext<"sub"> {
  key: SubSchemaKey;
}

export interface RootSchemaTraverserContext
  extends AbstractSchemaTraverserContext<"root"> {}

export type SchemaTraverserContext =
  | ArraySchemaTraverserContext
  | RecordSchemaTraverserContext
  | SubSchemaTraverserContext
  | RootSchemaTraverserContext;

export type SchemaDefinitionVisitor = Visitor<SchemaDefinition, SchemaTraverserContext>;

export function traverseSchemaDefinition(
  schema: SchemaDefinition,
  visitor: SchemaDefinitionVisitor,
  ctx: SchemaTraverserContext = { type: "root" }
) {
  visitor.onEnter?.(schema, ctx);
  if (!isSchema(schema)) {
    visitor.onLeave?.(schema, ctx);
    return;
  }
  for (const key of ARRAYS_OF_SUB_SCHEMAS) {
    const array = schema[key];
    if (array === undefined || !Array.isArray(array)) {
      continue;
    }
    const ctx: ArraySchemaTraverserContext = {
      type: "array",
      key,
      index: 0,
    }
    for (let index = 0; index < array.length; index++) {
      ctx.index = index;
      traverseSchemaDefinition(array[index]!, visitor, ctx);
    }
  }
  for (const key of RECORDS_OF_SUB_SCHEMAS) {
    const record = schema[key];
    if (record === undefined) {
      continue;
    }
    const ctx: RecordSchemaTraverserContext = {
      type: "record",
      key,
      property: "",
    }
    for (const property of Object.keys(record)) {
      const value = record[property];
      if (value === undefined || Array.isArray(value)) {
        continue;
      }
      ctx.property = property;
      traverseSchemaDefinition(value, visitor, ctx);
    }
  }
  for (const key of SUB_SCHEMAS) {
    const value = schema[key];
    if (value === undefined || Array.isArray(value)) {
      continue;
    }
    traverseSchemaDefinition(value, visitor, { type: "sub", key });
  }
  visitor.onLeave?.(schema, ctx);
}
