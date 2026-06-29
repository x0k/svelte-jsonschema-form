import { beforeEach, describe, expect, it } from "vitest";

import type { Merger } from "./merger.js";
import { retrieveSchema } from "./resolve.js";
import { type Schema, REF_FLAG } from "./schema.js";
import { createMerger } from "./test-merger.js";
import { createValidator } from "./test-validator.js";
import type { Validator } from "./validator.js";

let testValidator: Validator;
let defaultMerger: Merger;

beforeEach(() => {
  testValidator = createValidator();
  defaultMerger = createMerger();
});

describe("retrieveSchema", () => {
  it("$state.snapshot should preserve symbol properties", () => {
    const obj = {
      type: "object",
      properties: {
        child: { $ref: "#" },
      },
      [REF_FLAG]: "#",
    };

    const snap = $state.snapshot(obj);

    expect(snap[REF_FLAG]).toBe("#");
  });

  it("should resolve child property schema from retrieved schema", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        child: {
          $ref: "#",
        },
      },
    };

    const result = retrieveSchema(testValidator, defaultMerger, schema, schema);

    expect(result).toEqual({
      type: "object",
      properties: {
        child: {
          type: "object",
          properties: {
            child: { $ref: "#" },
          },
          [REF_FLAG]: "#",
        },
      },
    });

    const childSchema = result.properties?.child as Schema;

    const childResult = retrieveSchema(
      testValidator,
      defaultMerger,
      childSchema,
      schema
    );

    expect(childResult).toEqual({
      type: "object",
      properties: {
        child: {
          type: "object",
          properties: {
            child: { $ref: "#" },
          },
          [REF_FLAG]: "#",
        },
      },
      [REF_FLAG]: "#",
    });
  });
});
