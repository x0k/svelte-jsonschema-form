import { format } from "@cfworker/json-schema";
import { validatorTests, formValueValidatorTests } from "validator-testing";
import { describe, it, expect } from "vitest";

import { setupFormFormats, createFormValidator } from "./validator.svelte.js";

// NOTE: The following tweaks are necessary due to a problem with
// compiling the augmented schemas
// https://github.com/cfworker/cfworker/issues/335
validatorTests(createFormValidator, {
  useOriginalSchema: true,
});
formValueValidatorTests(createFormValidator, {
  useOriginalSchema: true,
  skipTitleResolutionTests: true,
});

describe("setupFormFormats", () => {
  it("installs color and data-url formats", () => {
    setupFormFormats(format);
    const validator = createFormValidator();

    // color format
    expect(
      validator.isValid(
        { type: "string", format: "color" },
        { type: "string" },
        "#fff"
      )
    ).toBe(true);
    expect(
      validator.isValid(
        { type: "string", format: "color" },
        { type: "string" },
        "not-a-color"
      )
    ).toBe(false);

    // data-url format
    expect(
      validator.isValid(
        { type: "string", format: "data-url" },
        { type: "string" },
        "data:text/plain;base64,eA=="
      )
    ).toBe(true);
    expect(
      validator.isValid(
        { type: "string", format: "data-url" },
        { type: "string" },
        "not-a-data-url"
      )
    ).toBe(false);
  });
});
