import {
  type Schema,
  SUB_SCHEMAS,
  RECORDS_OF_SUB_SCHEMAS,
  ARRAYS_OF_SUB_SCHEMAS,
  isSchema,
  REF_KEY,
} from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

function prefixMutableSchemaRefs(schema: Schema, prefix: string): Schema {
  for (const key of ARRAYS_OF_SUB_SCHEMAS) {
    if (Array.isArray(schema[key])) {
      schema[key] = schema[key].map((s) =>
        isSchema(s) ? prefixMutableSchemaRefs({ ...s }, prefix) : s
      );
    }
  }
  for (const key of RECORDS_OF_SUB_SCHEMAS) {
    let record = schema[key];
    if (!isSchemaObjectValue(record)) {
      continue;
    }
    schema[key] = record = { ...record };
    for (const key of Object.keys(record)) {
      if (isSchemaObjectValue(record[key])) {
        record[key] = prefixMutableSchemaRefs({ ...record[key] }, prefix);
      }
    }
  }
  for (const key of SUB_SCHEMAS) {
    if (isSchemaObjectValue(schema[key])) {
      schema[key] = prefixMutableSchemaRefs({ ...schema[key] }, prefix);
    }
  }
  const schemaRef = schema[REF_KEY];
  if (schemaRef !== undefined && schemaRef.startsWith("#")) {
    schema[REF_KEY] = `${prefix}${schemaRef}`;
  }
  return schema;
}

export function prefixSchemaRefs(schema: Schema, prefix: string): Schema {
  return prefixMutableSchemaRefs({ ...schema }, prefix);
}
