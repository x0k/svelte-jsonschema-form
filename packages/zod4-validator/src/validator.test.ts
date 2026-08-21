import { createAugmentSchema, isSchemaWithProperties } from "@sjsf/form/core";
import { isSchemaObject } from "@sjsf/form/lib/json-schema";
import { describe, expect, it } from "vitest";
import { z as zz } from "zod/v4";
import { z as zm } from "zod/v4-mini";

import { adaptAsync as setupAsyncFormValidatorClassic } from "./classic/index.js";
import { adapt as setupFormValidatorMini } from "./mini/index.js";

describe("FormValidator", () => {
  it.each([
    ["classic", setupAsyncFormValidatorClassic, zz],
    ["mini", setupFormValidatorMini, zm],
  ])("should correctly match options (%s)", (_, setupFormValidator, z) => {
    const { validator: createValidator, schema } = setupFormValidator(
      z.union([
        z.object({ foo: z.string() }),
        z.object({ bar: z.string(), baz: z.number() }),
      ])
    );
    const validator = createValidator();
    expect(validator.isValid(schema, {})).toBe(false);
    expect(validator.isValid(schema, { foo: "foo" })).toBe(true);
    expect(validator.isValid(schema, { bar: "bar" })).toBe(false);
    // NOTE: `anyOf` is used for `union` representation
    expect(validator.isValid(schema, { foo: "foo", baz: 123 })).toBe(true);
    const [first, second] = schema?.anyOf ?? [];
    if (
      first === undefined ||
      !isSchemaObject(first) ||
      second === undefined ||
      !isSchemaObject(second)
    ) {
      throw new Error(`Invalid anyOf value "${JSON.stringify(schema)}"`);
    }
    expect(validator.isValid(first, {})).toBe(false);
    expect(validator.isValid(first, { foo: "foo" })).toBe(true);

    expect(validator.isValid(second, { bar: "bar" })).toBe(false);
    expect(validator.isValid(second, { foo: "foo", baz: 123 })).toBe(false);
  });
  it.each([
    ["classic", setupAsyncFormValidatorClassic, zz],
    ["mini", setupFormValidatorMini, zm],
  ])("should use augmented schema", (_, setupFormValidator, z) => {
    const { validator: createValidator, schema } = setupFormValidator(
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
    const validator = createValidator();
    expect(validator.isValid(firstAg, {})).toBe(false);
    expect(validator.isValid(firstAg, { foo: "foo" })).toBe(true);
    const secondAg = createAugmentSchema(second);
    expect(validator.isValid(secondAg, { bar: "bar" })).toBe(true);
    expect(validator.isValid(secondAg, { foo: "foo", bar: "bar" })).toBe(true);
  });
  it("should validate form value", () => {
    const { validator: createValidator } = setupFormValidatorMini(
      zm.object({ foo: zm.string() })
    );
    const validator = createValidator();
    expect(validator.validateFormValue({}).errors).not.toBeUndefined();
    expect(validator.validateFormValue({ foo: "foo" }).errors).toBeUndefined();
  });
});
