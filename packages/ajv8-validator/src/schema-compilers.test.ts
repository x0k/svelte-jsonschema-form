import type { Schema, Config } from "@sjsf/form";
import { Ajv } from "ajv";
import { describe, it, expect } from "vitest";

import { DEFAULT_AJV_CONFIG } from "./model.js";
import {
  createSchemaCompiler,
  createFieldSchemaCompiler,
} from "./schema-compilers.js";

function createConfig(schema: Schema): Config {
  return {
    path: [] as unknown as Config["path"],
    title: "test",
    schema,
    uiSchema: {},
    required: false,
  };
}

describe("createSchemaCompiler", () => {
  it("reuses valid root schema without re-adding", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);

    const validSchema: Schema = { type: "string" };
    const rootSchema: Schema = { $id: "root", type: "object" };
    const compile = createSchemaCompiler(ajv, false, rootSchema);

    const validator1 = compile(validSchema);
    const validator2 = compile(validSchema);

    expect(validator1).toBe(validator2);
  });
});

describe("createFieldSchemaCompiler", () => {
  it("repeated calls throw consistently for invalid field schema", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const compileField = createFieldSchemaCompiler(ajv, false);

    const config = createConfig({ anyOf: [] });

    expect(() => compileField(config)).toThrow();
    expect(() => compileField(config)).toThrow();
  });

  it("reuses valid field schema validator", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const compileField = createFieldSchemaCompiler(ajv, false);

    const schema: Schema = { type: "string" };
    const config = createConfig(schema);

    const validator1 = compileField(config);
    const validator2 = compileField(config);

    expect(validator1).toBe(validator2);
  });

  it("handles async field schema compilation", async () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const compileField = createFieldSchemaCompiler(ajv, true);

    const schema: Schema = { type: "string" };
    const config = createConfig(schema);

    const validator = compileField(config);
    expect(validator.schema).toHaveProperty("$async", true);
  });

  it("evicts broken schema from AJV cache after compilation error", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const compileField = createFieldSchemaCompiler(ajv, false);

    const config = createConfig({ anyOf: [] });

    // First call should throw
    expect(() => compileField(config)).toThrow();

    // Second call should also throw (not silently return broken validator)
    expect(() => compileField(config)).toThrow();
  });
});
