import { Validator } from "ata-validator";
import { importModule } from "validator-testing";
import { describe, expect, it, vi } from "vitest";

import {
  COLOR_FORMAT_REGEX,
  DATA_URL_FORMAT_REGEX,
} from "../validator.svelte.js";
import { DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS } from "./validator.svelte.js";

const { formats } = DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS;

function literalOf(predicate: (value: string) => boolean) {
  // The predicate is embedded in a bundle through `Function#toString`, so
  // its source must carry the whole regular expression. A transform may
  // wrap the literal in parentheses.
  const match = predicate.toString().match(/\(?(\/.*\/[a-z]*)\)?\.test\(/s);
  if (match === null) {
    throw new Error("predicate does not test a regular expression literal");
  }
  return match[1];
}

describe("precompiled format predicates", () => {
  it("carry the same regular expressions as the runtime formats", () => {
    expect(literalOf(formats.color)).toBe(COLOR_FORMAT_REGEX.toString());
    expect(literalOf(formats["data-url"])).toBe(
      DATA_URL_FORMAT_REGEX.toString()
    );
  });

  it("validate inside a bundle that imports nothing", async () => {
    const schema = {
      $id: "f",
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      properties: {
        color: { type: "string", format: "color" },
        file: { type: "string", format: "data-url" },
      },
    };
    const bundle = Validator.bundleStandalone(
      [schema],
      DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS
    );
    const { validators } = await importModule<{
      validators: ((data: unknown) => { valid: boolean })[];
    }>(bundle);
    const validate = validators[0];
    if (validate === undefined) {
      throw new Error("the bundle carries no validator");
    }
    expect(
      validate({ color: "#fff", file: "data:text/plain;base64,aGk=" }).valid
    ).toBe(true);
    expect(validate({ color: "not-a-color" }).valid).toBe(false);
    expect(validate({ file: "hi" }).valid).toBe(false);
  });

  it("are importable where dynamic code is refused", async () => {
    const F = globalThis.Function;
    globalThis.Function = function () {
      throw new EvalError("dynamic code is refused here");
    } as unknown as FunctionConstructor;
    try {
      vi.resetModules();
      const mod = await import("./validator.svelte.js");
      expect(typeof mod.createFormValidatorFactory).toBe("function");
      expect(
        mod.DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS.formats.color("red")
      ).toBe(true);
    } finally {
      globalThis.Function = F;
    }
  });
});
