import {
  isTruthySchemaDefinition,
  isSchema,
  type Schema,
  type SchemaDefinition,
} from "../schema.js";
import { mergeSchemas } from "../merge.js";

function getSchemas(schema: SchemaDefinition): SchemaDefinition[] {
  if (!isSchema(schema) || schema.allOf === undefined) {
    return [schema];
  }
  const { allOf, ...rest } = schema;
  const array = allOf.flatMap((s) => getSchemas(s));
  array.push(rest);
  return array;
}

export function allOfMerge(schema: Schema) {
  const schemas = getSchemas(schema);
  let allTrue = true;
  let wIndex = 0;
  for (let i = 0; i < schemas.length; i++) {
    const item = schemas[i]!;
    if (item === false) {
      return false;
    }
    if (!isTruthySchemaDefinition(item)) {
      allTrue = false;
      if (wIndex !== i) {
        schemas[wIndex] = item;
      }
      wIndex++;
    }
  }
  if (wIndex === 0) {
    return schemas[0];
  }
  let result = schemas[0] as Schema;
  for (let i = 1; i < wIndex; i++) {
    result = mergeSchemas(result, schemas[i] as Schema);
  }
  return result;
}
