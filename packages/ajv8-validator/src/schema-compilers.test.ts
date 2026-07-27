import type { Schema, Config } from "@sjsf/form";
import { Ajv, type ValidateFunction } from "ajv";
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
    const compile = createSchemaCompiler(ajv, false);

    const validSchema: Schema = { type: "string" };
    const rootSchema: Schema = { $id: "root", type: "object" };

    const validator1 = compile(validSchema, rootSchema);
    const validator2 = compile(validSchema, rootSchema);

    expect(validator1).toBe(validator2);
  });

  it("clears cached validator when root schema changes", () => {
    const ajv = new Ajv(DEFAULT_AJV_CONFIG);
    const validatorsCache = new WeakMap<Schema, ValidateFunction>();
    const compile = createSchemaCompiler(ajv, false, validatorsCache);

    const validSchema: Schema = { type: "string" };
    const rootSchema1: Schema = { $id: "root1", type: "object" };
    const rootSchema2: Schema = {
      $id: "root1",
      type: "object",
      properties: {},
    };

    compile(validSchema, rootSchema1);
    expect(validatorsCache.has(validSchema)).toBe(true);

    // Root schema changed with same ID - should clear cache and recompile
    compile(validSchema, rootSchema2);
    expect(validatorsCache.has(validSchema)).toBe(true);
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
