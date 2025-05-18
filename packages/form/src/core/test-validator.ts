import { isSchemaDeepEqual, isSchemaValueDeepEqual } from "./deep-equal.js";
import type { Schema, SchemaValue } from "./schema.js";
import type { Validator } from "./validator.js";

interface TestCase {
  schema: Schema;
  value: SchemaValue;
  result: boolean;
}

export function createValidator({
  cases = [],
}: { cases?: TestCase[] } = {}): Validator {
  return {
    isValid(schema, _, value) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const c = cases.find(
        (c) =>
          isSchemaDeepEqual(c.schema, schema) &&
          isSchemaValueDeepEqual(c.value, value)
      );
      if (c === undefined) {
        throw new Error(
          `Cannot find test case with ${JSON.stringify({ schema, value })}`
        );
      }
      return c.result;
    },
  };
}
