import { describe, expect, it } from "vitest";
import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import {
  createAugmentSchema,
  isSchemaWithProperties,
} from "@sjsf/form/core";
import { z as zz } from "zod/v4";
import { z as zm } from "zod/v4-mini";

import { setupAsyncFormValidator as setupAsyncFormValidatorClassic } from "./classic/index.js";
import { setupFormValidator as setupFormValidatorMini } from "./mini/index.js";

describe("FormValidator", () => {
  it.each([
    ["classic", setupAsyncFormValidatorClassic, zz],
    ["mini", setupFormValidatorMini, zm],
  ])("should correctly match options (%s)", (_, setupFormValidator, z) => {
    const { validator, schema } = setupFormValidator(
      z.union([
        z.object({ foo: z.string() }),
        z.object({ bar: z.string(), baz: z.number() }),
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
  it.each([
    ["classic", setupAsyncFormValidatorClassic, zz],
    ["mini", setupFormValidatorMini, zm],
  ])("should use augmented schema", (_, setupFormValidator, z) => {
    const { validator, schema } = setupFormValidator(
      z.union([
        z.object({ foo: z.string() }),
        z.object({ bar: z.string(), baz: z.number() }),
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
    expect(validator.isValid(firstAg, schema, {})).toBe(false);
    expect(validator.isValid(firstAg, schema, { foo: "foo" })).toBe(true);
    const secondAg = createAugmentSchema(second);
    expect(validator.isValid(secondAg, schema, { bar: "bar" })).toBe(true);
    expect(
      validator.isValid(secondAg, schema, { foo: "foo", bar: "bar" })
    ).toBe(true);
  });
});
