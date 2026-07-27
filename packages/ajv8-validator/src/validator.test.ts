import type { Schema } from "@sjsf/form";
import { Ajv, type AsyncSchema } from "ajv";
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
    validateFormValueAsync(signal, rootSchema, formValue) {
      return v.validateFormValueAsync(
        signal,
        { ...rootSchema, $async: true } as AsyncSchema,
        formValue
      );
    },
  };
});

describe("AJV schema cache eviction after compilation error", () => {
  it("repeated isValid calls throw consistently for a schema with $id and invalid anyOf", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const validator = createFormValidator({ ajv });
    const schema = { $id: "test-caching-isvalid", anyOf: [] } as Schema;
    const rootSchema = {} as Schema;

    expect(() => validator.isValid(schema, rootSchema, undefined)).toThrow();
    expect(() => validator.isValid(schema, rootSchema, undefined)).toThrow();
  });

  it("repeated isValid calls throw consistently for a schema without $id and invalid anyOf", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const validator = createFormValidator({ ajv });
    const schema = {
      type: "object" as const,
      properties: { foo: { type: "string" as const, anyOf: [] } },
    };

    expect(() => validator.isValid(schema, schema, undefined)).toThrow();
    expect(() => validator.isValid(schema, schema, undefined)).toThrow();
  });

  it("repeated validateFormValue calls throw consistently for a schema with $id and invalid anyOf", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const validator = createFormValidator({ ajv });
    const schema = { $id: "test-caching-validate", anyOf: [] } as Schema;

    expect(() => validator.validateFormValue(schema, {})).toThrow();
    expect(() => validator.validateFormValue(schema, {})).toThrow();
  });
});
