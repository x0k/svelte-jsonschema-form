import type { Schema } from "@sjsf/form";
import { validatorTests, formValueValidatorTests } from "validator-testing";
import { describe, expect, it } from "vitest";

import {
  createSchemaValidatorFactory,
  createFormValidator,
  createDefaultValidateFactory,
} from "./validator.js";

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator, {
  skipTitleResolutionTests: true,
});

describe("rootSchemaId", () => {
  const rootSchema: Schema = {
    $id: "my-root",
    type: "object",
    properties: {
      a: { $ref: "#/$defs/str" },
    },
    $defs: {
      str: { type: "string" },
    },
  };

  it("resolves refs addressing the root by its $id (not the static prefix)", () => {
    const createSchemaValidator = createSchemaValidatorFactory(
      createDefaultValidateFactory(rootSchema),
      rootSchema
    );
    const validateRoot = createSchemaValidator(rootSchema);
    expect(validateRoot({ a: "ok" })).toBe(true);
    expect(validateRoot({ a: 1 })).toBe(false);

    // A subschema/field referencing the root's definitions through the
    // root's actual `$id` must resolve via the derived `rootSchemaId`.
    const validateField = createSchemaValidator({
      $ref: "my-root#/$defs/str",
    });
    expect(validateField("ok")).toBe(true);
    expect(validateField(1)).toBe(false);
  });
});
