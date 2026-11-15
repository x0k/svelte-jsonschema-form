import { describe, expect, it } from "vitest";

import { retrieveSchema } from "./resolve.js";
import { type Schema, REF_FLAG } from "./schema.js";
import { createTestContext } from "./testing.js";

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

    const result = retrieveSchema(
      createTestContext({
        rootSchema: schema,
      }),
      schema
    );

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
      createTestContext({
        rootSchema: schema,
      }),
      childSchema
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
