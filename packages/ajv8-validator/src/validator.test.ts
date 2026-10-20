import type { Schema } from "@sjsf/form";
import { resetLogOnce } from "@sjsf/form/lib/log-once";
import { Ajv, type AsyncSchema, type ValidateFunction } from "ajv";
import { validatorTests, formValueValidatorTests } from "validator-testing";
import { afterEach, describe, it, expect, vi } from "vitest";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "./model.js";
import { createValidator as createPrecompileValidator } from "./precompile/validator.js";
import {
  createAsyncFormValidator,
  createFormValidator,
  createValidator,
} from "./validator.js";

afterEach(() => {
  resetLogOnce();
});

const throwingValidate = (() => {
  throw new Error("boom");
}) as unknown as ValidateFunction;

describe("runtime validation warnings", () => {
  it("logs a runtime validation failure only once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const validator = createValidator({
      compileSchema: () => throwingValidate,
    });
    expect(validator.isValid({}, {}, undefined)).toBe(false);
    expect(validator.isValid({}, {}, undefined)).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("logs a precompile validation failure only once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const validator = createPrecompileValidator({
      validatorRetriever: () => throwingValidate,
    });
    expect(validator.isValid({}, {}, undefined)).toBe(false);
    expect(validator.isValid({}, {}, undefined)).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

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
