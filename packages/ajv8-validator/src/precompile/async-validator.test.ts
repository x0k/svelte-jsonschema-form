import { fromValidators } from "@sjsf/form/validators/precompile";
import { Ajv } from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import { build } from "esbuild";
import { importModule } from "validator-testing";
import { describe, expect, it } from "vitest";

import {
  createAsyncFormValidatorFactory,
  type ValidateFunctions,
} from "./validator.js";

const schema = {
  $id: "test",
  $async: true,
  type: "object",
  properties: { foo: { type: "string" } },
} as const;

async function compileAsyncValidator() {
  const ajv = new Ajv({ code: { source: true, esm: true }, strict: false });
  // @ts-expect-error incompatible module resolution strategy
  const modules = standaloneCode(ajv, ajv.compile(schema));
  const { outputFiles } = await build({
    minify: true,
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    target: ["es2020"],
    stdin: {
      contents: modules,
      resolveDir: process.cwd(),
      sourcefile: "input.js",
      loader: "js",
    },
  });
  const mod = await importModule<{
    validate: ValidateFunctions[string];
  }>(outputFiles[0]!.text);
  return mod.validate;
}

describe("async precompiled validator", () => {
  it("transforms errors thrown as a bundled ValidationError", async () => {
    const factory = createAsyncFormValidatorFactory({
      validatorRetriever: fromValidators({
        test: await compileAsyncValidator(),
      }),
    });
    const validator = factory({});
    const signal = new AbortController().signal;

    const invalid = await validator.validateFormValueAsync(signal, schema, {
      foo: 1,
    });
    expect("errors" in invalid && invalid.errors).toEqual([
      { path: ["foo"], message: "must be string" },
    ]);

    const valid = await validator.validateFormValueAsync(signal, schema, {
      foo: "bar",
    });
    expect(valid).toEqual({ value: { foo: "bar" } });
  });
});
