import { isFormValueValidator, type FormValue, type Schema } from "@sjsf/form";
import type { Merger } from "@sjsf/form/core";
import { describe, expect, it } from "vitest";

import { draft07 } from "./ata-precompiled.ts";

const SCHEMA = {
  $id: "root",
  type: "object",
  properties: {
    color: { type: "string", format: "color" },
    file: { type: "string", format: "data-url" },
  },
} satisfies Schema;

/**
 * The playground compiles the bundle with `DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS`
 * so its format predicates survive `Function#toString` embedding. Passing the
 * runtime options instead bundles predicates that close over
 * `COLOR_FORMAT_REGEX`, which is not defined in the generated module and throws
 * a `ReferenceError` the first time a `color` or `data-url` value is validated.
 */
describe("ata-precompiled", () => {
  it("applies the color and data-url formats", async () => {
    // The compiled validator only validates, it never merges, so the merger
    // the playground would pass has no bearing here.
    const merger: Merger = {
      mergeSchemas: (a) => a,
      mergeAllOf: (a) => a,
    };

    const createValidator = (await draft07([SCHEMA]))({
      merger: () => merger,
    });
    if (!isFormValueValidator(createValidator)) {
      throw new Error("the compiled validator cannot validate form values");
    }
    const validate = (formValue: FormValue) =>
      createValidator.validateFormValue(SCHEMA, formValue);

    expect(
      validate({ color: "#fff", file: "data:text/plain;base64,aGk=" })
    ).toEqual({
      value: { color: "#fff", file: "data:text/plain;base64,aGk=" },
    });
    expect(validate({ color: "not-a-color" })).toMatchObject({
      errors: [{ path: ["color"] }],
    });
    expect(validate({ file: "hi" })).toMatchObject({
      errors: [{ path: ["file"] }],
    });
  });
});
