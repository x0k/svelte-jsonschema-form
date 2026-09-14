import { describe, expect, it } from "vitest";

import { schemaHasNestedConditional } from "./schema-has-nested-conditional.js";
import type { Schema } from "./schema.js";

describe("schemaHasNestedConditional()", () => {
  it("returns false for a non-object schema", () => {
    expect(schemaHasNestedConditional(true)).toBe(false);
  });
  it("returns false for a schema with no conditional anywhere", () => {
    const schema: Schema = {
      type: "object",
      properties: { foo: { type: "string" } },
    };
    expect(schemaHasNestedConditional(schema)).toBe(false);
  });
  it("returns false for the root schema's own dependencies/if, which don't count as nested", () => {
    const dependenciesSchema: Schema = {
      type: "object",
      dependencies: { foo: { required: ["bar"] } },
    };
    expect(schemaHasNestedConditional(dependenciesSchema)).toBe(false);

    const ifSchema: Schema = {
      type: "object",
      if: { properties: { foo: { const: "bar" } } },
      then: { required: ["bar"] },
    };
    expect(schemaHasNestedConditional(ifSchema)).toBe(false);
  });
  it("returns true for a dependencies keyword nested inside properties", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        m: {
          type: "object",
          properties: { animal: { type: "string" } },
          dependencies: { animal: { required: ["food"] } },
        },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for an if keyword nested inside properties", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        m: {
          type: "object",
          if: { properties: { animal: { const: "Cat" } } },
          then: { required: ["food"] },
        },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("resolves a $ref to find a dependencies keyword nested behind it", () => {
    const schema: Schema = {
      type: "object",
      definitions: {
        Animal: {
          type: "object",
          properties: { animal: { type: "string" } },
          dependencies: { animal: { required: ["food"] } },
        },
      },
      properties: { m: { $ref: "#/definitions/Animal" } },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("finds a dependencies keyword declared locally alongside a $ref, not just on the ref target", () => {
    const schema: Schema = {
      type: "object",
      definitions: {
        Animal: {
          type: "object",
          properties: { animal: { type: "string" } },
        },
      },
      properties: {
        m: {
          $ref: "#/definitions/Animal",
          dependencies: { animal: { required: ["food"] } },
        },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns false and does not throw for an unresolvable $ref", () => {
    const schema: Schema = {
      type: "object",
      properties: { m: { $ref: "#/definitions/Missing" } },
    };
    expect(schemaHasNestedConditional(schema)).toBe(false);
  });
  it("returns false and does not infinitely recurse for a circular $ref", () => {
    const schema: Schema = {
      type: "object",
      definitions: {
        Node: {
          type: "object",
          properties: { next: { $ref: "#/definitions/Node" } },
        },
      },
      properties: { root: { $ref: "#/definitions/Node" } },
    };
    expect(schemaHasNestedConditional(schema)).toBe(false);
  });
  it("ignores a $ref that resolves to a boolean schema", () => {
    const schema: Schema = {
      type: "object",
      definitions: { Foo: true },
      properties: { m: { $ref: "#/definitions/Foo" } },
    };
    expect(schemaHasNestedConditional(schema)).toBe(false);
  });
  it("returns true for a dependencies keyword nested inside patternProperties", () => {
    const schema: Schema = {
      type: "object",
      patternProperties: {
        "^x-": {
          type: "object",
          properties: { animal: { type: "string" } },
          dependencies: { animal: { required: ["food"] } },
        },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside a single items schema", () => {
    const schema: Schema = {
      type: "array",
      items: {
        type: "object",
        properties: { animal: { type: "string" } },
        dependencies: { animal: { required: ["food"] } },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside a tuple items array", () => {
    const schema: Schema = {
      type: "array",
      items: [
        {
          type: "object",
          properties: { animal: { type: "string" } },
          dependencies: { animal: { required: ["food"] } },
        },
        { type: "string" },
      ],
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside additionalProperties", () => {
    const schema: Schema = {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: { animal: { type: "string" } },
        dependencies: { animal: { required: ["food"] } },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside allOf", () => {
    const schema: Schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          properties: { animal: { type: "string" } },
          dependencies: { animal: { required: ["food"] } },
        },
      ],
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside anyOf", () => {
    const schema: Schema = {
      anyOf: [
        {
          type: "object",
          properties: { animal: { type: "string" } },
          dependencies: { animal: { required: ["food"] } },
        },
      ],
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside oneOf", () => {
    const schema: Schema = {
      oneOf: [
        {
          type: "object",
          properties: { animal: { type: "string" } },
          dependencies: { animal: { required: ["food"] } },
        },
      ],
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside the root's own if's then branch", () => {
    const schema: Schema = {
      type: "object",
      properties: { switch: { type: "boolean" } },
      if: { properties: { switch: { const: true } } },
      then: {
        properties: {
          m: {
            type: "object",
            properties: { animal: { type: "string" } },
            dependencies: { animal: { required: ["food"] } },
          },
        },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for a dependencies keyword nested inside the root's own if's else branch", () => {
    const schema: Schema = {
      type: "object",
      properties: { switch: { type: "boolean" } },
      if: { properties: { switch: { const: true } } },
      then: {},
      else: {
        properties: {
          m: {
            type: "object",
            properties: { animal: { type: "string" } },
            dependencies: { animal: { required: ["food"] } },
          },
        },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("returns true for an if keyword nested inside the root's own schema-style dependencies value", () => {
    const schema: Schema = {
      type: "object",
      properties: { m: { type: "object" } },
      dependencies: {
        m: {
          properties: {
            m: {
              type: "object",
              if: { properties: { animal: { const: "Cat" } } },
              then: { required: ["food"] },
            },
          },
        },
      },
    };
    expect(schemaHasNestedConditional(schema)).toBe(true);
  });
  it("does not walk into a property-list (array-valued) dependencies entry's non-existent value-schema", () => {
    const schema: Schema = {
      type: "object",
      properties: { foo: { type: "string" }, bar: { type: "string" } },
      dependencies: { foo: ["bar"] },
    };
    expect(schemaHasNestedConditional(schema)).toBe(false);
  });
});
