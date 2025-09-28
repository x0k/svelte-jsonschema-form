import { describe, expect, it } from "vitest";
import { isSchemaObject } from "@sjsf/form/lib/json-schema";
import { createAugmentSchema, isSchemaWithProperties } from "@sjsf/form/core";
import * as v from "valibot";

import { adapt } from "./setup.js";

describe("FormValidator", () => {
  it("should correctly match options", () => {
    const { validator: createValidator, schema } = adapt(
      v.union([
        v.object({ foo: v.string() }),
        v.object({ bar: v.string(), baz: v.number() }),
      ])
    );
    const validator = createValidator();
    expect(validator.isValid(schema, schema, {})).toBe(false);
    expect(validator.isValid(schema, schema, { foo: "foo" })).toBe(true);
    expect(validator.isValid(schema, schema, { bar: "bar" })).toBe(false);
    // NOTE: `anyOf` is used for `union` representation
    expect(validator.isValid(schema, schema, { foo: "foo", baz: 123 })).toBe(
      true
    );
    const [first, second] = schema?.anyOf ?? [];
    if (
      first === undefined ||
      !isSchemaObject(first) ||
      second === undefined ||
      !isSchemaObject(second)
    ) {
      throw new Error(`Invalid anyOf value "${JSON.stringify(schema)}"`);
    }
    expect(validator.isValid(first, schema, {})).toBe(false);
    expect(validator.isValid(first, schema, { foo: "foo" })).toBe(true);

    expect(validator.isValid(second, schema, { bar: "bar" })).toBe(false);
    expect(validator.isValid(second, schema, { foo: "foo", baz: 123 })).toBe(
      false
    );
  });
  it("should use augmented schema", () => {
    const { validator: createValidator, schema } = adapt(
      v.union([
        v.object({ foo: v.string() }),
        v.object({ bar: v.string(), baz: v.number() }),
      ])
    );
    const [first, second] = schema.anyOf ?? [];
    if (
      first === undefined ||
      !isSchemaObject(first) ||
      !isSchemaWithProperties(first) ||
      second === undefined ||
      !isSchemaObject(second) ||
      !isSchemaWithProperties(second)
    ) {
      throw new Error(`Invalid 'anyOf' items '${JSON.stringify(schema)}'`);
    }
    const firstAg = createAugmentSchema(first);
    const validator = createValidator();
    expect(validator.isValid(firstAg, schema, {})).toBe(false);
    expect(validator.isValid(firstAg, schema, { foo: "foo" })).toBe(true);
    const secondAg = createAugmentSchema(second);
    expect(validator.isValid(secondAg, schema, { bar: "bar" })).toBe(true);
    expect(
      validator.isValid(secondAg, schema, { foo: "foo", bar: "bar" })
    ).toBe(true);
  });
});
