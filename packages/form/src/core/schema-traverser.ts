import {
  ARRAYS_OF_SUB_SCHEMAS,
  isSchema,
  RECORDS_OF_SUB_SCHEMAS,
  SUB_SCHEMAS,
  type SchemaDefinition,
} from "./schema.js";

export interface Visitor<Node> {
  onEnter?: (node: Node) => void;
  onLeave?: (node: Node) => void;
}

export type SchemaDefinitionVisitor = Visitor<SchemaDefinition>;

export function traverseSchemaDefinition(
  schema: SchemaDefinition,
  visitor: SchemaDefinitionVisitor
) {
  visitor.onEnter?.(schema);
  if (!isSchema(schema)) {
    visitor.onLeave?.(schema);
    return;
  }
  for (const key of ARRAYS_OF_SUB_SCHEMAS) {
    const array = schema[key];
    if (array === undefined || !Array.isArray(array)) {
      continue;
    }
    for (let i = 0; i < array.length; i++) {
      traverseSchemaDefinition(array[i]!, visitor);
    }
  }
  for (const key of RECORDS_OF_SUB_SCHEMAS) {
    const record = schema[key];
    if (record === undefined) {
      continue;
    }
    for (const property of Object.keys(record)) {
      const value = record[property];
      if (value === undefined || Array.isArray(value)) {
        continue;
      }
      traverseSchemaDefinition(value, visitor);
    }
  }
  for (const key of SUB_SCHEMAS) {
    const value = schema[key];
    if (value === undefined || Array.isArray(value)) {
      continue;
    }
    traverseSchemaDefinition(value, visitor);
  }
  visitor.onLeave?.(schema);
}
