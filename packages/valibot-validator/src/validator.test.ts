import { describe, expect, it } from "vitest";
import {
  createAugmentSchema,
  isSchema,
  isSchemaWithProperties,
} from "@sjsf/form/core";
import * as v from "valibot";

import { setupFormValidator } from "./setup.js";

describe("FormValidator", () => {
  it("should correctly match options", () => {
    const { validator, schema } = setupFormValidator(
      v.union([
        v.object({ foo: v.string() }),
        v.object({ bar: v.string(), baz: v.number() }),
      ])
    );
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
      !isSchema(first) ||
      second === undefined ||
      !isSchema(second)
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
    const { validator, schema } = setupFormValidator(
      v.union([
        v.object({ foo: v.string() }),
        v.object({ bar: v.string(), baz: v.number() }),
      ])
    );
    const [first, second] = schema.anyOf ?? [];
    if (
      first === undefined ||
      !isSchema(first) ||
      !isSchemaWithProperties(first) ||
      second === undefined ||
      !isSchema(second) ||
      !isSchemaWithProperties(second)
    ) {
      throw new Error(`Invalid 'anyOf' items '${JSON.stringify(schema)}'`);
    }
    const firstAg = createAugmentSchema(first);
    expect(validator.isValid(firstAg, schema, {})).toBe(false);
    expect(validator.isValid(firstAg, schema, { foo: "foo" })).toBe(true);
    const secondAg = createAugmentSchema(second);
    expect(validator.isValid(secondAg, schema, { bar: "bar" })).toBe(true);
    expect(
      validator.isValid(secondAg, schema, { foo: "foo", bar: "bar" })
    ).toBe(true);
  });
});
