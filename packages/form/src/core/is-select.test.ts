// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/schema/isSelectTest.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/schema/isMultiSelectTest.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { beforeEach, describe, it, expect } from "vitest";

import {
  getSelectOptionValuesSafe,
  isMultiSelect,
  isSelect,
} from "./is-select.js";
import type { Merger } from "./merger.js";
import type { Schema } from "./schema.js";
import { createMerger } from "./test-merger.js";
import { createValidator } from "./test-validator.js";
import type { Validator } from "./validator.js";

let testValidator: Validator;
let defaultMerger: Merger;

beforeEach(() => {
  testValidator = createValidator();
  defaultMerger = createMerger();
});

describe("isSelect2()", () => {
  it("should be false if items is undefined", () => {
    const schema: Schema = {};
    expect(isSelect(testValidator, defaultMerger, schema, schema)).toBe(false);
  });
  describe("schema items enum is not an array", () => {
    it("should be false if oneOf/anyOf schemas are not all constants", () => {
      const schema: Schema = {
        anyOf: [{ type: "string", enum: ["Foo"] }, { type: "string" }],
      };
      expect(isSelect(testValidator, defaultMerger, schema, schema)).toBe(
        false
      );
    });
    it("should be true if oneOf/anyOf schemas are all constants", () => {
      const schema: Schema = {
        oneOf: [
          { type: "string", enum: ["Foo"] },
          { type: "string", enum: ["Foo"] },
        ],
      };
      expect(isSelect(testValidator, defaultMerger, schema, schema)).toBe(true);
    });
  });
  it("should retrieve reference schema definitions", () => {
    const schema: Schema = {
      definitions: {
        FooItem: { type: "string", enum: ["foo"] },
      },
      $ref: "#/definitions/FooItem",
    };
    defaultMerger = createMerger({
      merges: [
        {
          left: { type: "string", enum: ["foo"] },
          right: {
            definitions: { FooItem: { type: "string", enum: ["foo"] } },
          },
          result: {
            type: "string",
            enum: ["foo"],
            definitions: { FooItem: { type: "string", enum: ["foo"] } },
          },
        },
      ],
    });
    expect(isSelect(testValidator, defaultMerger, schema, schema)).toBe(true);
  });
});

describe("isMultiSelect2()", () => {
  describe("uniqueItems is true", () => {
    describe("schema items enum is an array", () => {
      it("should be true", () => {
        const schema: Schema = {
          items: { enum: ["foo", "bar"] },
          uniqueItems: true,
        };
        expect(
          isMultiSelect(testValidator, defaultMerger, schema, schema)
        ).toBe(true);
      });
    });
    it("should be false if items is undefined", () => {
      const schema: Schema = {};
      expect(isMultiSelect(testValidator, defaultMerger, schema, schema)).toBe(
        false
      );
    });
    describe("schema items enum is not an array", () => {
      it("should be false if oneOf/anyOf is not in items schema", () => {
        const schema: Schema = { items: {}, uniqueItems: true };
        expect(
          isMultiSelect(testValidator, defaultMerger, schema, schema)
        ).toBe(false);
      });
      it("should be false if oneOf/anyOf schemas are not all constants", () => {
        const schema: Schema = {
          items: {
            oneOf: [{ type: "string", enum: ["Foo"] }, { type: "string" }],
          },
          uniqueItems: true,
        };
        expect(
          isMultiSelect(testValidator, defaultMerger, schema, schema)
        ).toBe(false);
      });
      it("should be true if oneOf/anyOf schemas are all constants", () => {
        const schema: Schema = {
          items: {
            oneOf: [
              { type: "string", enum: ["Foo"] },
              { type: "string", enum: ["Foo"] },
            ],
          },
          uniqueItems: true,
        };
        expect(
          isMultiSelect(testValidator, defaultMerger, schema, schema)
        ).toBe(true);
      });
    });
    it("should retrieve reference schema definitions", () => {
      const schema: Schema = {
        definitions: {
          FooItem: { type: "string", enum: ["foo"] },
        },
        items: { $ref: "#/definitions/FooItem" },
        uniqueItems: true,
      };
      expect(isMultiSelect(testValidator, defaultMerger, schema, schema)).toBe(
        true
      );
    });
  });
  it("should be false if uniqueItems is false", () => {
    const schema: Schema = {
      items: { enum: ["foo", "bar"] },
      uniqueItems: false,
    };
    expect(isMultiSelect(testValidator, defaultMerger, schema, schema)).toBe(
      false
    );
  });
});

describe("a schema carrying both oneOf and anyOf", () => {
  const CONST: Schema[] = [{ const: "x" }, { const: "y" }];
  const TYPES: Schema[] = [{ type: "string" }, { type: "number" }];

  beforeEach(() => {
    testValidator = createValidator();
    defaultMerger = createMerger();
  });

  it("reads anyOf for the select decision when both lists are populated", () => {
    const schema: Schema = { oneOf: TYPES, anyOf: CONST };
    expect(isSelect(testValidator, defaultMerger, schema, schema)).toBe(true);
  });

  it("reads anyOf for the option values when both lists are populated", () => {
    const schema: Schema = { oneOf: TYPES, anyOf: CONST };
    expect(getSelectOptionValuesSafe(schema)).toEqual(["x", "y"]);
  });

  // An empty list offers no option to select, so it never shadowed a
  // populated sibling: the field rendered as a select with zero options.
  it.each([
    ["empty oneOf, populated anyOf", { oneOf: [], anyOf: CONST }],
    ["empty anyOf, populated oneOf", { anyOf: [], oneOf: CONST }],
  ])("reads the populated list for %s", (_name, schema) => {
    expect(isSelect(testValidator, defaultMerger, schema, schema)).toBe(true);
    expect(getSelectOptionValuesSafe(schema)).toEqual(["x", "y"]);
  });

  it("offers no options when every list is empty", () => {
    const schema: Schema = { oneOf: [], anyOf: [] };
    expect(getSelectOptionValuesSafe(schema)).toEqual([]);
  });
});
