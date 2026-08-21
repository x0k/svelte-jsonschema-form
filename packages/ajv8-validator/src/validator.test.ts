import type { Schema } from "@sjsf/form";
import { Ajv } from "ajv";
import { validatorTests, formValueValidatorTests } from "validator-testing";
import { describe, it, expect } from "vitest";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "./model.js";
import { createAsyncFormValidator, createFormValidator } from "./validator.js";

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator);
formValueValidatorTests((options) => {
  const v = createAsyncFormValidator({
    ...options,
    ajv: addFormComponents(new Ajv({ ...DEFAULT_AJV_CONFIG })),
  });
  return {
    ...v,
    validateFormValueAsync(signal, formValue) {
      return v.validateFormValueAsync(signal, formValue);
    },
  };
});

describe("AJV schema cache eviction after compilation error", () => {
  it("repeated isValid calls throw consistently for a schema with $id and invalid anyOf", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const invalidSchema = { $id: "test-caching-isvalid", anyOf: [] } as Schema;
    const validator = createFormValidator({ ajv, schema: {} });

    expect(() => validator.isValid(invalidSchema, undefined)).toThrow();
    expect(() => validator.isValid(invalidSchema, undefined)).toThrow();
  });

  it("repeated isValid calls throw consistently for a schema without $id and invalid anyOf", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const invalidSchema = {
      type: "object" as const,
      properties: { foo: { type: "string" as const, anyOf: [] } },
    };
    const validator = createFormValidator({ ajv, schema: {} });

    expect(() => validator.isValid(invalidSchema, undefined)).toThrow();
    expect(() => validator.isValid(invalidSchema, undefined)).toThrow();
  });
});
